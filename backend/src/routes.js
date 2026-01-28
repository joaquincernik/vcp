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
router.get("/personas", async (req, res) => {
  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.SPREADSHEET_ID,
      range: "Padron!G3:G1200",
    });

    const data = response.data.values;
    const filtrado = data.flat().filter((nombre) => {
      //flat junta todas essa 1200 en una misma fila
      // Convertimos a minúsculas para que la búsqueda sea más flexible
      return limpiarTexto(nombre).includes("Gatti, Celina".toLowerCase());
    });

    if (filtrado.length === 0) {
      return res.status(404).json({
        ok: false,
        error: "No se encontraron resultados",
      });
    }

    res.json({
      ok: true,
      res: filtrado,
      data: response.data.values || [],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      error: "Error leyendo Google Sheets",
    });
  }
});

router.post("/buscar", async (req, res) => {
  try {
    const { nombre, apellido } = req.body;

    if (!nombre || !apellido) {
      return res.status(400).json({
        ok: false,
        error: "Nombre y apellido son obligatorios",
      });
    }

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.SPREADSHEET_ID,
      range: "Padron!G3:G1200",
    });

    const rows = response.data.values || [];

    const nombreBuscado = nombre.trim().toLowerCase();
    const apellidoBuscado = apellido.trim().toLowerCase();
    const nombreBuscar = apellidoBuscado + ", " + nombreBuscado;

    const resultados = rows.filter((row) => {
      const nombreSheet = (row[0] || "").toLowerCase();

      return nombreBuscar === nombreSheet;
    });

    res.json({
      ok: true,
      total: resultados.length,
      resultados,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      error: "Error buscando en el padrón",
    });
  }
});

export default router;
