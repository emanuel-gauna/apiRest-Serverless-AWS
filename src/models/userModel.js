import db from "../db/rds.js";
import bcrypt, { genSalt } from "bcryptjs";

export const createUser = async(userData) =>{
    const {username, email, password, role="user"} = userData;
     //rol por defecto

    const[result] = await db.query(
        `INSERT INTO users (username, email, password, role) VALUES (?,?,?,?)`,
        [username, email, password, role]
    );
    return { id:result.insertId, username, email, role}; // Devuelve el nuevo usuario
};

export const getUserByEmail = async (email) =>{
    const [rows] = await db.query(
        `SELECT * FROM users WHERE email = ?`,
        [email]
    )
    return rows[0]; // Retorna el usuario encontrado o `undefined`
}
export const getUserById = async(id)=>{
    const [rows] = await db.query(
        `SELECT * FROM users WHERE id = ?`,
        [id]
    )
    return rows[0];
}
export const destroyUser = async(id) =>{
    const [result] = await db.query(
        `DELETE FROM users WHERE id = ?`,
        [id]
        );
        return result.affectedRows > 0;
}