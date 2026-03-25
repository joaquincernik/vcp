import { sheets } from "../google.js";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import Estado from "../models/Estado.js";

import {
  buscarUsuarioSheet,
  updateTelefonoSheet,
  guardarUsuarioSheet,
  registrarUsuarioBd,
  buscarUsuarioBd,
  buscarUsuarioBdId,
  buscarEstadoSheet,
} from "../service/usuarioService.js";
import { where } from "sequelize";
dotenv.config();

export const detalleUsuario = async (req,res) =>{
  const {id} = req.params;
  try{

    const usuario = await buscarUsuarioBdId(id)
  
    if (!usuario) {
        return res.status(404).json({
          ok: false,
          error: "Usuario no encontrado",
        });
      }
    return res.status(200).json({
      ok: true,
      usuario
    });
  }
  catch(error){
    console.log('====================================');
    console.log(error);
    console.log('====================================');
    res.status(500).json({
      ok: false,
      error: "Error interno buscando usuario por detalle",
    });
  }
}
export const loginUsuario = async (req, res) => {
  try {
    console.log(req.body);

    let dniIngresado = req.body.dni;
    let password = req.body.password;

    let usuarioBd = await buscarUsuarioBd(dniIngresado);
    console.log(usuarioBd.Estado.nombre);

    let nombreEstado = usuarioBd.Estado.nombre;;

    if (!usuarioBd) {
      return res.status(404).json({
        ok: false,
        error: "Usuario no encontrado",
      });
    }

    //check pass
    const isPasswordValid = await bcrypt.compare(password, usuarioBd.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        ok: false,
        error: "Contraseña incorrecta",
      });
    }


    await checkUpdateEstado(nombreEstado, usuarioBd.id);

    const token = jwt.sign(
      { id: usuarioBd.id, dni: usuarioBd.dni, rol: usuarioBd.rol, nombre: usuarioBd.nombre },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }, // Expira en 1 hora; ajusta según necesites
    );

    return res.status(200).json({
      ok: true,
      message: "Login exitoso",
      token, // Incluye el token
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      ok: false,
      error: "Error en login",
    });
  }
};
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
    idEstado: 1,
  };

  const index = await buscarUsuarioSheet(sheet, personaIngresada.dni);

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
    personaIngresada.id = Number(sheet[sheet.length - 1][0]) + 1;
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

  //ahora tengo que chequear en que estado esta (m1,m2, etc)
  let sheetEstado;
  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.SPREADSHEET_ID,
      range: "Eventos-RegistroManual!B:C", //aca traigo las primeras dos columnas, id y dni
    });
    sheetEstado = response.data.values;
  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      error: "Error leyendo Google Sheets estado",
    });
  }

  const arrayEstado = await buscarEstadoSheet(sheetEstado, personaIngresada.id);
 // console.log(arrayEstado);
  
  if (arrayEstado !== undefined) {
    let nombre = arrayEstado[0].toLowerCase();
    let idEstado = await Estado.findOne({ where: { nombre } });
   // console.log(idEstado?.dataValues?.id);

    idEstado? personaIngresada.idEstado = idEstado?.dataValues?.id : 1;
  //  console.log(personaIngresada);
    
  }

  //gaurdado en bd
  try {
    const usuarioExistente = await buscarUsuarioBd(personaIngresada.dni);
    if (usuarioExistente) {
      return res.status(409).json({
        status: 409,
        ok: false,
        error: "Usuario con dni ya registrado en la base de datos",
      });
    }
    const guardadoBd = await registrarUsuarioBd(personaIngresada);
    console.log(personaIngresada);
    
        const token = jwt.sign(
      { id: personaIngresada.id, dni: personaIngresada.dni, rol: personaIngresada.rol, nombre: personaIngresada.nombre },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }, // Expira en 1 hora; ajusta según necesites
    );
    return res.status(200).json({
      status: 200,
      ok: true,
      message: "Usuario registrado exitosamente",
      token
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
