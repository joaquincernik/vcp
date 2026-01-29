import { Router } from "express";
import { sheets } from "./google.js";
import dotenv from "dotenv";
dotenv.config();

const router = Router();
// Función para quitar tildes y dejar el texto limpio
const limpiarTexto = (texto) => {
  return texto
    .toString()
    .normalize("NFD") // Separa la letra de su tilde
    .replace(/[\u0300-\u036f]/g, "") // Elimina las tildes (caracteres especiales)
    .toLowerCase()
    .trim();
};
router.post("/personas", async (req, res) => {
  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.SPREADSHEET_ID,
      range: "Padron!G:G",
    });

    const data = response.data.values;
    let posicion = -1;

    const busquedaLimpia = limpiarTexto(
      `${req.body.apellido}, ${req.body.nombre}`,
    );
    
    const filtrado = data.flat().filter((nombre, index) => {
      if (!nombre) return false;

      const nombreLimpio = limpiarTexto(nombre);
      const coincide = nombreLimpio.includes(busquedaLimpia) ;

      if (coincide) {
        // Si coincide, guardamos la posición (index + 1 si quieres conteo humano)
        posicion = index + 1;
      }

      return coincide;
    });

    if (filtrado.length === 0) {
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
