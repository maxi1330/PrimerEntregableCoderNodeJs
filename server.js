/* ---------------------- Modulos ----------------------*/
const express = require('express');
const cors = require('cors');

//Instancia de Server
const app = express();
const routerProductos = require('./routes/productos.routes.js');
const routerCarrito = require('./routes/carrito.routes');

/* ---------------------- Middlewares ---------------------- */
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static('public'));
app.use(cors({ origin: true }));

/* ---------------------- Rutas ----------------------*/
app.use('/api/productos', routerProductos);
app.use('/api/carrito', routerCarrito);

/* ---------------------- Servidor ----------------------*/
const PORT = process.env.PORT || 8080;
const server = app.listen(PORT, ()=>{
    console.log(`Servidor escuchando en puerto ${PORT}`);
})

server.on('error', error=>{
    console.error(`Error en el servidor ${error}`);
});
