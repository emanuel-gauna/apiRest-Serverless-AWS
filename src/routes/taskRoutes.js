import express from "express";
import {
  listTask,
  searchTaskById,
  addTask,
  patchTask,
  destroyTask,
  getOwnTaskById,
  listUserTasks,
  createOwnTask,
} from "../controllers/taskController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { isAdmin } from "../middlewares/adminMiddleware.js";
import { validateCreateTask } from "../validators/taskValidator.js";
import { validateFields } from "../middlewares/validateFields.js";

const router = express.Router();

// rutas para admin
router.get("/admin", authMiddleware, isAdmin, listTask); // primero autenticado y luego si es admin puede seguir en esa ruta
router.get("/admin/:id", authMiddleware, isAdmin, searchTaskById); //protegida acceso solo admin
router.post("/admin", authMiddleware, isAdmin, addTask); //ruta protegida con token
router.put("/admin/:id", authMiddleware, isAdmin, patchTask); //ruta protegida
router.delete("/admin/:id", authMiddleware, isAdmin, destroyTask); //ruta protegida

//rutas para user
router.get("/", authMiddleware, listUserTasks);
router.get("/:id", authMiddleware, getOwnTaskById);
router.post("/",authMiddleware, validateCreateTask , validateFields, createOwnTask);

export default router
