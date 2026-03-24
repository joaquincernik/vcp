import { Router } from "express";
import { sheets } from "./google.js";
import {
  crearUsuario,
  loginUsuario
} from "./controller/usuarioController.js"

import dotenv from "dotenv";
dotenv.config();

const router = Router();
// Función para quitar tildes y dejar el texto limpio

router.post("/personas", crearUsuario);
router.post("/login", loginUsuario)

export default router;
