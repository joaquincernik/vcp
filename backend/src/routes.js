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
      range: "Padron!L:L",
    });

    const data = response.data.values.flat();
    let posicion = -1;
    const dniF = req.body.dni;
    const filtrado = data.filter((dni, index) => {
      if (dni == "-" || dni == "" || dni == null) return false;

      if (dni == dniF) {
        posicion = index + 1;
        return true;
      }
    });

    //------- creacion de persona en padron-------------------
    if (filtrado.length === 0) {
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
      console.log("====================================");
      console.log(idNuevo);
      console.log("====================================");

      const nombre = req.body.nombre;
      const apellido = req.body.apellido;

      const guardado = await sheets.spreadsheets.values.append({
        spreadsheetId: process.env.SPREADSHEET_ID,
        range: "Padron!A:Z",
        valueInputOption: "USER_ENTERED",
        insertDataOption: "INSERT_ROWS",
        requestBody: {
          values: [
            [idNuevo + 1, "", "", "", "", "", , apellido, "", "", "", "", ""],
          ],
        },
      });

      return res.status(404).json({
        ok: false,
        error: "No se encontraron resultados",
      });
    }

    //busqueda ahora del detalle de la persona
    const responseDetalle = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.SPREADSHEET_ID,
      range: `Padron!${posicion}:${posicion}`,
    });

    res.json({
      ok: true,
      res: filtrado[0],
      //data: response.data.values || [],
      posicion: posicion,
      detalle: responseDetalle.data.values.flat() || [],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      error: "Error leyendo Google Sheets",
    });
  }
});

export default router;
