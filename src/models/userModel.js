import db from "../db/rds.js";
import bcrypt, { genSalt } from "bcryptjs";

export const createUser = async(user) =>{
    const {username, email, password} = user;

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const result = await db.query(
        `INSERT INTO users (username, email, password) VALUES (?,?,?)`,
        [username, email, hashedPassword]
    )
};

export const getUserByEmail = async () =>{
    const [rows] = await db.query(
        `SELECT * FROM users WHERE email = ?`,
        [email]
    )
    return rows[0]; // Retorna el usuario encontrado o `undefined`
}