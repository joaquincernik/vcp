import { sheets } from "../google.js";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import Usuario from "../models/Usuario.js";
dotenv.config();

export const buscarUsuarioSheet = async (sheet, dni) => {
  return sheet.findIndex((row) => row[1] === dni);
  //devuelve -1 si no encuentra el dni, o el index de la fila si lo encuentra
};

export const updateTelefonoSheet = async (personaIngresada, index) => {
  //actualizamos telefono
  const guardado = await sheets.spreadsheets.values.update({
    spreadsheetId: process.env.SPREADSHEET_ID,
    range: `Padron!C${index + 1}`,
    valueInputOption: "USER_ENTERED",
    requestBody: {
      values: [[personaIngresada.telefono]],
    },
  });

  return guardado.status;
};

export const guardarUsuarioSheet = async (personaIngresada, nombreCompleto) => {
//guardado
    const guardado = await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.SPREADSHEET_ID,
      range: "Padron!A:P",
      valueInputOption: "USER_ENTERED",
      insertDataOption: "INSERT_ROWS",
      requestBody: {
        values: [
          [
            personaIngresada.id,
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
    return guardado;
}

export const registrarUsuarioBd = async (usuarioData) => {
try {
    const nuevoUsuario = await Usuario.create({
      id: usuarioData.id,
      dni: usuarioData.dni,
      telefono: usuarioData.telefono,
      nombre: usuarioData.nombre,
      apellido: usuarioData.apellido,
      password: usuarioData.password,  // Debe estar hasheada con bcrypt
    });
    return nuevoUsuario;  // Devuelve el usuario creado
  } catch (error) {
    console.error('Error creando usuario:', error);
    throw error;  // Lanza el error para manejarlo en el controlador
  }

}

export const buscarUsuarioBd = async (dni) => {
    return await Usuario.findOne({ where: { dni } });
   
}