import db from "../db/rds.js";
import bcrypt, { genSalt } from "bcryptjs";

export const createUser = async(user) =>{
    const {username, email, password} = user;
    const[result] = await db.query(
        `INSERT INTO users (username, email, password) VALUES (?,?,?)`,
        [username, email, password]
    );
    return { id:result.insertId, username, email}; // Devuelve el nuevo usuario
};

export const getUserByEmail = async (email) =>{
    const [rows] = await db.query(
        `SELECT * FROM users WHERE email = ?`,
        [email]
    )
    return rows[0]; // Retorna el usuario encontrado o `undefined`
}