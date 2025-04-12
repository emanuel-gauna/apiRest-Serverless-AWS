//esta middleware solo se aplica en peticiones que se envian en el body 
import { validationResult } from "express-validator";

export const validateFields = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next(); // continúa al siguiente middleware o controlador
};
