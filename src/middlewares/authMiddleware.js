import jwt from "jsonwebtoken";
const secretKey = process.env.SECRET_KEY; // ⚠️ Mejor usar variable de entorno

export const authMiddleware = (req, res, next) => {
    // 1️⃣ Leer el token del header "Authorization"
    const token = req.header("Authorization");
// 2️⃣ Si no hay token, devolver un error 401 (No autorizado)
    if (!token) {
        // 3️⃣ Verificar si el token es válido
        return res.status(401).json({ message: "Acceso denegado. No hay token." });
    }

    try {
        // 3️⃣ Verificar si el token es válido
        const decoded = jwt.verify(token, secretKey);
        // 4️⃣ Si el token es válido, guardar los datos en req.user
        req.user = decoded; // Agrega el usuario a la request
        next();
    } catch (error) {
        res.status(401).json({ message: "Token inválido." });
    }
};
