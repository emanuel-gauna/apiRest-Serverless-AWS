import express from "express";
import { registerValidation, loginValidation } from "../validations/userValidations.js";
import { loginUser, registerUser } from "../controllers/userController.js";


const router = express.Router();
const secretKey = process.env.JWT_SECRET;

router.post("/register", registerValidation, registerUser);
router.post("/login", loginValidation, loginUser)


export default router;