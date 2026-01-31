import { Router } from "express";
import { sheets } from "./google.js";
import bcrypt from "bcrypt";
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

    const personaIngresada = {
      id: 0,
      dni: req.body.dni,
      telefono: req.body.telefono,
      nombre: req.body.nombre,
      apellido: req.body.apellido,
      password: await bcrypt.hash(req.body.password, 10),
    };

    //const telefonoIngresado = req.body.telefono;
    //const dniIngresado = req.body.dni;

    const index = response.data.values.findIndex(
      (row) => row[1] === personaIngresada.dni,
    );

    //Caso A, persona encontrado, solo se chequea si se actualiza el telefono
    if (index !== -1) {
      //extraigo el id de la persona
      personaIngresada.id = Number(response.data.values[index][0]);

      //chequeo si cambio el telefono
      if (
        personaIngresada.telefono !== response.data.values[index][2] ||
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
            values: [[personaIngresada.telefono]],
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
      personaIngresada.id =
        Number(response.data.values[response.data.values.length - 1][0]) + 1;
      const nombreCompleto =
        personaIngresada.apellido + ", " + personaIngresada.nombre;

      //guardado
      const guardado = await sheets.spreadsheets.values.append({
        spreadsheetId: process.env.SPREADSHEET_ID,
        range: "Padron!A:P",
        valueInputOption: "USER_ENTERED",
        insertDataOption: "INSERT_ROWS",
        requestBody: {
          values: [
            [
              Number(personaIngresada.id),
              personaIngresada.dni,
              personaIngresada.telefono,
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
              personaIngresada.apellido,
              personaIngresada.nombre,
            ],
          ],
        },
      });
      if (guardado.status !== 200) {
        return res.status(400).json({
          status: 400,
          ok: false,
          error: "Error guardando persona en el padron",
        });
      }
    }

    //------------guardado de usuario---------------
    //primero chequeo de que no existe el usuario con ese dni
    const responseCheck = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.SPREADSHEET_ID,
      range: "Usuarios!B:B",
    });
    const indexCheck = responseCheck.data.values.findIndex(
      (row) => row[0] === personaIngresada.dni,
    );

    if (indexCheck !== -1) {
      return res.status(302).json({
        status: 302,
        ok: false,
        error: "Usuario con dni ya registrado",
      });
    }

    const guardadoUsuario = await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.SPREADSHEET_ID,
      range: "Usuarios!A:F",
      valueInputOption: "USER_ENTERED",
      insertDataOption: "INSERT_ROWS",
      requestBody: {
        values: [
          [
            Number(personaIngresada.id),
            personaIngresada.dni,
            personaIngresada.telefono,
            personaIngresada.nombre,
            personaIngresada.apellido,
            personaIngresada.password,
          ],
        ],
      },
    });

    if (guardadoUsuario.status !== 200) {
      return res.status(400).json({
        ok: false,
        error: "Error guardando persona en el padron",
      });
    } else {
      return res.status(200).json({
        ok: true,
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      error: "Error leyendo Google Sheets",
    });
  }
});

export default router;
