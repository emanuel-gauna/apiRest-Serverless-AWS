import express from "express";
import { listTask , searchTaskById , addTask , patchTask , destroyTask } from "../controllers/taskController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Definir rutas
router.get("/", listTask);
router.get("/:id", searchTaskById);
router.post("/", authMiddleware ,addTask); //ruta protegida con token
router.put("/:id", authMiddleware ,patchTask);//ruta protegida
router.delete("/:id", authMiddleware , destroyTask);//ruta protegida

export default router;
