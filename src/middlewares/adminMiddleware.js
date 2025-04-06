 //middleware para rutas protegidas solo acceso a administradores
export const isAdmin = (req, res, next) =>{
    if(req.user.role != "admin"){
        return res.status(403).json({
            message: "Access a la ruta denegado. Solo Administradores" ,
            role: req.user.role
        });
    }
    next();
}