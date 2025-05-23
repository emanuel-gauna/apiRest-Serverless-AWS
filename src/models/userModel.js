import db from "../db/rds.js";
import bcrypt, { genSalt } from "bcryptjs";

export const getAllUsers = async()=>{
    const [rows] = await db.query(`SELECT * FROM users`);
    return rows;
    
}
export const getUserByRole = async(role)=>{
    const [rows] = await db.query(`SELECT * FROM users WHERE role = ?`,
        [role]);
        return rows;
}

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
    return rows[0];//retorna el 1er resultado ya que el id es unico
}
export const  editUserById = async(id, userData)=>{
    const [result] = await db.query(
        `UPDATE users SET  ? WHERE id = ?`,
        [userData, id]
    )
    return result.affectedRows > 0 ;
}

export const destroyUser = async(id) =>{
    const [result] = await db.query(
        `DELETE FROM users WHERE id = ?`,
        [id]
        );
        return result.affectedRows > 0; //true si se modifico algo y false si no se modifico nada en las filas(rows)
}