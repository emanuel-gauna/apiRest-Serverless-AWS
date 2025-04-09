import express from "express";
import {
  loginUser,
  registerUser,
  deleteUserById,
  adminEditUser,
  editOwnUser,
  allUsers,
  getUsersRole
} from "../controllers/userController.js";

import { authMiddleware } from "../middlewares/authMiddleware.js";
import { isAdmin } from "../middlewares/adminMiddleware.js";
import { validateFields } from "../middlewares/validateFields.js";
import {
  validateRegister,
  validateLogin,
  validateEditOwnUser,
  validateAdminEditUser
} from "../validators/userValidators.js";

const router = express.Router();

//buscar un todos los usuarios,y por rol(solo admin) 
router.get("/" , authMiddleware ,isAdmin,allUsers );
router.get("/role/:role", authMiddleware, isAdmin, getUsersRole);

// Registro y login
router.post("/register", validateRegister, validateFields, registerUser);
router.post("/login", validateLogin, validateFields, loginUser);

// Eliminar usuario (solo admin)
router.delete("/edit/:id", authMiddleware, isAdmin, validateFields, deleteUserById);

// Editar perfil propio (usuario autenticado)
router.put("/:id", authMiddleware, validateEditOwnUser, validateFields, editOwnUser);

// Editar cualquier usuario (admin)
router.put("/admin/:id", authMiddleware, isAdmin, validateAdminEditUser, validateFields, adminEditUser);

export default router;
