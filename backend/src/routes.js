import { Router } from "express";
import { sheets } from "./google.js";
import {
  crearUsuario
} from "./controller/usuarioController.js"
import bcrypt from "bcrypt";
import dotenv from "dotenv";
dotenv.config();

const router = Router();
// Función para quitar tildes y dejar el texto limpio

router.post("/personas", crearUsuario);

export default router;
