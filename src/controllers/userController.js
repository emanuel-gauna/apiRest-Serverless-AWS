import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { validationResult } from "express-validator";
import { createUser, getUserByEmail } from "../models/userModel.js";
import dotenv from "dotenv";
dotenv.config();

const secretKey = process.env.JWT_SECRET;

export const registerUser = async (req ,res) =>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

        const { username, email, password} = req.body;
    
    try {
        const existingUser = await getUserByEmail(email);
        if (existingUser) return res.status(400).json({message: "El mail ya esta registrado"});

        const hashedPassword = bcrypt.hashSync(password,10);//hashearcontraseña
        const user = await createUser({ username, email, password: hashedPassword});//crear nuevo usuario
        const token = jwt.sign({id:user.id}, secretKey, { expiresIn: '1h'}); //generar token
        return res.status(201).json({
            message: "Usuario creado correctamente",
            user,
            token // enviar EL TOKEN EN LA RESPUESTA
        });  
    } catch (error) {
        return res.status(500).json({message: "Error al registrar el usuario", error: error.message})
    }
}

export const loginUser = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const {email, password} = req.body;

    try {
        const user = await getUserByEmail(email);
        if (!user) return res.status(404).json({message: "El mail no existe"});

        // 🔑 **Comparar la contraseña ingresada con la hasheada**
        const isMatch = bcrypt.compareSync(password, user.password);
        if (!isMatch) return res.status(401).json({message: "La contraseña no coinciden"});

        // 🏷️ **Generar JWT**
        const token = jwt.sign({id: user.id, email: user.email}, secretKey, {expiresIn: "1h"});
        return res.json({token, user});
    } catch (error) {
        return res.status(500).json({message: "Error al iniciar sesion", error})
    }
};