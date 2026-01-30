import { Router } from "express";
import { sheets } from "./google.js";
import dotenv from "dotenv";
dotenv.config();

const router = Router();
// Función para quitar tildes y dejar el texto limpio

router.post("/personas", async (req, res) => {
  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.SPREADSHEET_ID,
      range: "Padron!A:C", //aca traigo las primeras dos columnas, id y dni
    });

    const telefonoIngresado = req.body.telefono;
    const dniIngresado = req.body.dni;
    //    const data = response.data.values.flat();
    console.log("====================================");
    console.log(response.data.values[response.data.values.length - 1]);
    console.log("====================================");
    const index = response.data.values.findIndex(
      (row) => row[1] === dniIngresado,
    );

    //Caso A, persona encontrado, solo se chequea si se actualiza el telefono
    if (index !== -1) {
      //chequeo si cambio el telefono
      console.log("====================================");
      console.log(telefonoIngresado, response.data.values[index][2]);
      console.log("====================================");
      if (
        telefonoIngresado !== response.data.values[index][2] ||
        response.data.values[index][2] === "" ||
        response.data.values[index][2] === null ||
        response.data.values[index][2] === undefined
      ) {
        //actualizamos telefono
        const guardado = await sheets.spreadsheets.values.update({
          spreadsheetId: process.env.SPREADSHEET_ID,
          range: `Padron!C${index + 1}`,
          valueInputOption: "USER_ENTERED",
          requestBody: {
            values: [[telefonoIngresado]],
          },
        });
        if (guardado.status !== 200) {
          return res.status(400).json({
            ok: false,
            error: "Error actualizando numero de telefono",
          });
        }
      }
    }

    //Caso B, persona no encontrada
    else {
      const ultimoId = response.data.values[response.data.values.length - 1][0];
      const nombre = req.body.nombre;
      const apellido = req.body.apellido;
      const telefono = req.body.telefono;
      const nombreCompleto = apellido + ", " + nombre;

      //guardado
      const guardado = await sheets.spreadsheets.values.append({
        spreadsheetId: process.env.SPREADSHEET_ID,
        range: "Padron!A:P",
        valueInputOption: "USER_ENTERED",
        insertDataOption: "INSERT_ROWS",
        requestBody: {
          values: [
            [
              Number(ultimoId) + 1,
              dniIngresado,
              telefono,
              "",
              "",
              "",
              "",
              "",
              nombreCompleto,
              "",
              "",
              "",
              "",
              "",
              apellido,
              nombre,
            ],
          ],
        },
      });
      console.log('====================================');
      console.log(guardado.status);
      console.log('====================================');

    }
    //------- creacion de persona en padron-------------------
    /* if (filtrado.length === 0) {
      //no se encontro la persona en el padron

      //busqueda del ultimo id
      const responseUltimoId = await sheets.spreadsheets.values.get({
        spreadsheetId: process.env.SPREADSHEET_ID,
        range: "Padron!A:A",
      });

      const ultimoId = responseUltimoId.data.values.flat();
      const idNuevo = ultimoId
        .filter((item) => item && item.toString().trim() !== "")
        .at(-1);

      const nombre = req.body.nombre;
      const apellido = req.body.apellido;
      const nombreCompleto = apellido + ", " + nombre;
      const telefono = req.body.telefono;

      const guardado = await sheets.spreadsheets.values.append({
        spreadsheetId: process.env.SPREADSHEET_ID,
        range: "Padron!A:Z",
        valueInputOption: "USER_ENTERED",
        insertDataOption: "INSERT_ROWS",
        requestBody: {
          values: [
            [
              Number(idNuevo) + 1,
              "",
              "",
              "",
              "",
              "",
              nombreCompleto,
              "",
              "",
              "",
              "",
              dniF,
              "",
              apellido,
              nombre,
              "",
              "",
              "",
              telefono,
            ],
          ],
        },
      });

      if (guardado.status !== 200) {
        return res.status(400).json({
          ok: false,
          error: "Error creando persona en el padron de google sheet",
        });
      }
    } else {
      //busqueda ahora del detalle de la persona
      const responseDetalle = await sheets.spreadsheets.values.get({
        spreadsheetId: process.env.SPREADSHEET_ID,
        range: `Padron!${posicion}:${posicion}`,
      });

      const telefonoAnterior = responseDetalle.data.values.flat()[18];
      const telefonoNuevo = req.body.telefono;

      console.log("====================================");
      console.log(responseDetalle.data.values.flat());
      console.log("====================================");

      res.json({
        ok: true,
        res: filtrado[0],
        //data: response.data.values || [],
        posicion: posicion,
        detalle: responseDetalle.data.values.flat() || [],
      });
    } */
  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      error: "Error leyendo Google Sheets",
    });
  }
});

export default router;
