import express from "express";
import { registerValidation, loginValidation } from "../validations/userValidations.js";
import { loginUser, registerUser, deleteUserById, editUser } from "../controllers/userController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { isAdmin } from "../middlewares/adminMiddleware.js";
import { validateFields } from "../middlewares/validateFields.js";


const router = express.Router();
const secretKey = process.env.JWT_SECRET;

router.post("/register", validateFields , registerValidation, registerUser);
router.post("/login", validateFields ,loginValidation, loginUser);
router.delete("/:id", validateFields , authMiddleware, isAdmin, deleteUserById)
router.put(":id", validateFields, editUser);


export default router;