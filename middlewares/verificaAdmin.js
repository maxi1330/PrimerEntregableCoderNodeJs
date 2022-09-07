//Middleware que verifica si es admin (puse una variable booleana que viene en el header para verificar)
let verificaAdmin = (req, res, next) => {
    let isAdmin = req.get("admin");
    if(!isAdmin){
        return res.status(403).json({
            error: -1,
            msj: `ruta ${req.originalUrl} metodo ${req.method} no autorizada`
        });
    }
    next();
}

module.exports = { verificaAdmin }