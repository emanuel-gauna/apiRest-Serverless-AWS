import { body } from "express-validator";

// ✅ Validación para registrar un usuario
export const validateRegister = [
  body("nombre", "El nombre es obligatorio").notEmpty(),
  body("email", "El email no es válido").isEmail(),
  body("password", "El password debe tener al menos 6 caracteres").isLength({ min: 6 }),
  body("rol").optional().isIn(["admin", "cliente"]).withMessage("El rol debe ser 'admin' o 'cliente'")
];

// ✅ Validación para iniciar sesión
export const validateLogin = [
  body("email", "El email es obligatorio").isEmail(),
  body("password", "El password es obligatorio").notEmpty()
];

// ✅ Validación para que el usuario edite su propio perfil
export const validateEditOwnUser = [
  body("nombre").optional().notEmpty().withMessage("El nombre no puede estar vacío"),
  body("email").optional().isEmail().withMessage("Debe ser un email válido"),
  body("password").optional().isLength({ min: 6 }).withMessage("La contraseña debe tener al menos 6 caracteres")
  // 👇 no se permite cambiar rol en esta validación
];

// ✅ Validación para que un admin edite a un usuario
export const validateAdminEditUser = [
  body("nombre").optional().notEmpty().withMessage("El nombre no puede estar vacío"),
  body("email").optional().isEmail().withMessage("Debe ser un email válido"),
  body("password").optional().isLength({ min: 6 }).withMessage("La contraseña debe tener al menos 6 caracteres"),
  body("rol").optional().isIn(["admin", "cliente"]).withMessage("El rol debe ser 'admin' o 'cliente'")
];
