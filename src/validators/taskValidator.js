import { body } from "express-validator";

export const validateCreateTask = [
  body("title")
    .notEmpty()
    .withMessage("El título es obligatorio")
    .isLength({ max: 100 })
    .withMessage("El título no puede tener más de 100 caracteres"),

  body("description")
    .notEmpty()
    .withMessage("La descripción es obligatoria")
    .isLength({ max: 255 })
    .withMessage("La descripción no puede tener más de 255 caracteres"),
];
