import mysql from "mysql2/promise";
import dotenv from "dotenv";

// Cargar las variables de entorno
dotenv.config();

// Imprimir las variables para verificar que se están cargando correctamente
console.log("DB_HOST:", process.env.DB_HOST);
console.log("DB_USER:", process.env.DB_USER);
console.log("DB_PASSWORD:", process.env.DB_PASSWORD);
console.log("DB_NAME:", process.env.DB_NAME);


// Crear la conexión a la base de datos utilizando las variables de entorno
const db = mysql.createPool({
    host: process.env.DB_HOST,           // Dirección de la base de datos
    user: process.env.DB_USER,           // Usuario de la base de datos
    password: process.env.DB_PASSWORD,   // Contraseña de la base de datos
    database: process.env.DB_NAME,       // Nombre de la base de datos
    waitForConnections: true,
    connectionLimit: 10,                 // Limitar la cantidad de conexiones simultáneas
    queueLimit: 0,                        // Sin límite de espera para la cola de conexiones
});


// Función de prueba para verificar la conexión a la base de datos
const testConnection = async () => {
    try {
        const connection = await db.getConnection();
        console.log("Conexión exitosa a la base de datos");
        connection.release(); // Libera la conexión después de la prueba
    } catch (error) {
        console.error("Error de conexión a la base de datos:", error);
    }
};

// Llamar la función para probar la conexión
testConnection();

export default db;

