import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { createUser, getUserByEmail, destroyUser, getUserById, editUserById, getAllUsers, getUserByRole } from "../models/userModel.js";
import dotenv from "dotenv";

dotenv.config();

const secretKey = process.env.JWT_SECRET;

export const allUsers = async(req ,res) => {
    try {
        const users = await getAllUsers();
        const userRemovedPass = users.map(user =>{
            const { password, ...rest } = user;
            return rest;
        });

        return res.status(200).json({
            message: `todos los usuarios registrados`,
            user: userRemovedPass
        })
    } catch (error) {
        return res.status(500).json({
            message: "Error al buscar los usuarios",
            error: error.message || error
        });
    }
}
export const getUsersRole = async (req,res) => {
    const {role} = req.params;

    const validRoles = ["user", "admin"];
    if(!validRoles.includes(role)){
        return res.status(400).json({
            message: "El rol no es válido",
            error: "El rol debe ser user o admin"
            });
    }
    try {
        const userWithRole = await getUserByRole(role);
        const userRemovedPass = userWithRole.map(({password, ...rest}) =>rest);
            return res.status(200).json({
                message: `todos los usuarios con el rol: ${role}`,
                user: userRemovedPass
                })
    } catch (error) {
        return res.status(500).json({
            message:  "Error al buscar los usuarios por rol",
            error: error.message || error
        })
    }
}

export const registerUser = async (req ,res) =>{
        const { username, email, password, role} = req.body;
    try {
        const existingUser = await getUserByEmail(email);//usuario existente
        if (existingUser) return res.status(400).json({message: "El mail ya esta registrado"});

        const hashedPassword = bcrypt.hashSync(password,10);//hashear contraseña
        const user = await createUser({ username, email, password: hashedPassword, role});//crear nuevo usuario
        const token = jwt.sign({
            id:user.id,
            username:user.username,
            email:user.email,
            role:user.role
        },  secretKey, { expiresIn: '1h'}); //generar token
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
    const {email, password} = req.body;
    try {
        const user = await getUserByEmail(email);
        if (!user) return res.status(404).json({message: "El mail no inexistente, Cree un registro de usuario"});

        // Comparar la contraseña ingresada con la hasheada
        const isMatch = bcrypt.compareSync(password, user.password);
        if (!isMatch) return res.status(401).json({message: "La contraseña no coinciden"});

        // Generar JWT
        const token = jwt.sign({id: user.id, username: user.username , email: user.email, role: user.role}, secretKey, {expiresIn: "1h"});
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
//editar usuario
export const adminEditUser = async (req, res) => {
    const { id } = req.params;
    const { username, email, role } = req.body;

    try {
        const userData = { username, email, role}; // Ignorar cualquier otro campo como 'role'

        const updated = await editUserById(id, userData);
        if (!updated) {
            return res.status(404).json({ message: "Usuario inexistente" });
    }

    const updatedUser = await getUserById(id);
    return res.status(200).json({
      message: "Usuario editado por admin",
      user: updatedUser,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error al editar el usuario",
      error: error.message || error,
    });
  }
};


//edit de usuario por el mismo
// controllers/userController.js
export const editOwnUser = async (req, res) => {
    const { id } = req.params;
  
    // Verificamos que el usuario que intenta editar es él mismo
    if (parseInt(id) !== req.user.id) {
      return res.status(403).json({ message: "No tenés permisos para editar otro usuario" });
    }
  
    const { username, email } = req.body;
  
    try {
      const updated = await editUserById(id, { username, email });
      if (!updated) {
        return res.status(404).json({ message: "Usuario no encontrado" });
      }
  
      const updatedUser = await getUserById(id);
      return res.status(200).json({
        message: "Usuario actualizado",
        user: updatedUser
      });
    } catch (error) {
      return res.status(500).json({ message: "Error al editar usuario", error: error.message });
    }
  };
  

//eliminar usuario(solo por admin)
export const deleteUserById = async(req, res)=>{
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