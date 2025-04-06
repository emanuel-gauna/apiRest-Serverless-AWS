import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { validationResult } from "express-validator";
import { createUser, getUserByEmail, destroyUser, getUserById } from "../models/userModel.js";
import dotenv from "dotenv";
dotenv.config();

const secretKey = process.env.JWT_SECRET;

export const registerUser = async (req ,res) =>{
    const errors = validationResult(req);//validaciones de errores
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

        const { username, email, password, role} = req.body;
    
    try {
        const existingUser = await getUserByEmail(email);//usuario existente
        if (existingUser) return res.status(400).json({message: "El mail ya esta registrado"});

        const hashedPassword = bcrypt.hashSync(password,10);//hashear contraseña
        const user = await createUser({ username, email, password: hashedPassword, role});//crear nuevo usuario
        const token = jwt.sign({id:user.id, role:user.role},  secretKey, { expiresIn: '1h'}); //generar token
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
        if (!user) return res.status(404).json({message: "El mail no inexistente, Cree un registro de usuario"});

        // Comparar la contraseña ingresada con la hasheada
        const isMatch = bcrypt.compareSync(password, user.password);
        if (!isMatch) return res.status(401).json({message: "La contraseña no coinciden"});

        // Generar JWT
        const token = jwt.sign({id: user.id, email: user.email, role: user.role}, secretKey, {expiresIn: "1h"});
        return res.status(200).json({
            message: "Inicio de sesion exitoso",
            token,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role // para que el frontend lo sepa si hace falta
            }// enviar el usuario en la respuesta
        });
    } catch (error) {
        return res.status(500).json({message: "Error al iniciar sesion", error})
    }
};
export const deleteUserById = async(req, res)=>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    const {id} = req.params;
    try {
        const user = await getUserById(id);
        if (!user) return res.status(404).json({message: "El usuario no existe"})

        const userDeleted = await destroyUser(id);
        if(!userDeleted) return res.status(500).json({message:"No se pudo eliminar el usuario"});
        return res.status(200).json({
            message: "Usuario eliminado correctamente",
            user: {
                id: user.id,
                username: user.username
            }
        })
    } catch (error) {
        return res.status(500).json({
            message: "Error al eliminar un usuario",
            error: error.message || error
        })
    }
}