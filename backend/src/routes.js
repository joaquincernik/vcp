import { Router } from "express";
import { sheets } from "./google.js";
import {
  crearUsuario,
  loginUsuario,
  detalleUsuario
} from "./controller/usuarioController.js"

import dotenv from "dotenv";
dotenv.config();

const router = Router();
// Función para quitar tildes y dejar el texto limpio

router.post("/register", crearUsuario);
router.post("/login", loginUsuario)
router.get("/usuario/:id", detalleUsuario)
export default router;
