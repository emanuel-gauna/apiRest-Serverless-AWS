import express from "express";
import { listTask , searchTaskById , addTask , patchTask , destroyTask } from "../controllers/taskController.js";

const router = express.Router();

// Definir rutas
router.get("/", listTask);
router.get("/:id", searchTaskById);
router.post("/", addTask);
router.put("/:id", patchTask);
router.delete("/:id", destroyTask);

export default router;
