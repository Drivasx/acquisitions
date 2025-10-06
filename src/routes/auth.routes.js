import express from "express";
import { signup } from "#controllers/auth.controller.js";

const router = express.Router();

router.post("/sign-up", signup);


router.post("/sign-in", (req, res) => {
  // Lógica de autenticación
  res.send("POST /api/auth/sign-in response");
});


router.post("/sign-out", (req, res) => {
  // Lógica de cierre de sesión
  res.send("POST /api/auth/sign-out response");
});

export default router;