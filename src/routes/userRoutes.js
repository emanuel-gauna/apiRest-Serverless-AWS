import express from "express";
import { registerValidation, loginValidation } from "../validations/userValidations.js";
import { loginUser, registerUser, deleteUserById } from "../controllers/userController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { isAdmin } from "../middlewares/adminMiddleware.js";


const router = express.Router();
const secretKey = process.env.JWT_SECRET;

router.post("/register", registerValidation, registerUser);
router.post("/login", loginValidation, loginUser);
router.delete("/:id", authMiddleware, isAdmin, deleteUserById)


export default router;