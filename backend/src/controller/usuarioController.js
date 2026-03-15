import { sheets } from "../google.js";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import {
  buscarUsuarioSheet,
  updateTelefonoSheet,
  guardarUsuarioSheet,
  registrarUsuarioBd,
  buscarUsuarioBd,
} from "../service/usuarioService.js";
dotenv.config();

export const crearUsuario = async (req, res) => {
  //sincroniacion con sheets
  let sheet;
  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.SPREADSHEET_ID,
      range: "Padron!A:C", //aca traigo las primeras dos columnas, id y dni
    });
    sheet = response.data.values;
  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      error: "Error leyendo Google Sheets",
    });
  }

  //creamos el objeto persona con los datos ingresados
  const personaIngresada = {
    id: 0,
    dni: req.body.dni,
    telefono: req.body.telefono,
    nombre: req.body.nombre,
    apellido: req.body.apellido,
    password: await bcrypt.hash(req.body.password, 10),
  };

  const index = await buscarUsuarioSheet(
    sheet,
    personaIngresada.dni,
  );

  //Caso A, persona encontrado, solo se chequea si se actualiza el telefono
  if (index !== -1) {
    //extraigo el id de la persona
    personaIngresada.id = Number(sheet[index][0]);

    //chequeo si cambio el telefono
    if (
      personaIngresada.telefono !== sheet[index][2] ||
      sheet[index][2] === "" ||
      sheet[index][2] === null ||
      sheet[index][2] === undefined
    ) {
      //actualizamos telefono
      const responseUpdate = await updateTelefonoSheet(personaIngresada, index);
      if (responseUpdate !== 200) {
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
      Number(sheet[sheet.length - 1][0]) + 1;
    const nombreCompleto =
      personaIngresada.apellido + ", " + personaIngresada.nombre;

    const guardado = await guardarUsuarioSheet(
      personaIngresada,
      nombreCompleto,
    );

    if (guardado.status !== 200) {
      return res.status(400).json({
        status: 400,
        ok: false,
        error: "Error guardando persona en el padron",
      });
    }
  }

  //gaurdado en bd
  try {
    const usuarioExistente = await buscarUsuarioBd(personaIngresada.dni);
    if (usuarioExistente) {
      return res.status(302).json({
        status: 302,
        ok: false,
        error: "Usuario con dni ya registrado en la base de datos",
      });
    }
    const guardadoBd = await registrarUsuarioBd(personaIngresada);
    return res.status(200).json({
      status: 200,
      ok: true,
      message: "Usuario registrado exitosamente",   
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: 500,
      ok: false,
      error: "Error guardando persona en la base de datos",
    });
  }

};
