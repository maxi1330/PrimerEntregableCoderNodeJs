const express = require('express');
const routerCarrito = express.Router();
const Contenedor = require("../db/Contenedor");

const contenedorCarrito = new Contenedor("carrito.txt");

//Crea un carrito y devuelve su ID
routerCarrito.post('/', async (req, res) => {
    try {
        const nuevoCarrito = {
            timestamp: new Date.now(),
            productos: []
        }

        await contenedorCarrito.save(nuevoCarrito).then( id => {
            return res.status(200).json({
                msj: 'Carrito creado',
                id: id
            });
        });
    } catch (e) {
        return res.status(400).json({
            error: 1,
            msj: "Ocurrio un error"
        });
    }
});

//Vacia un carrito y lo elimina
routerCarrito.delete('/:id', async (req, res) => {
    try {
        const {id} = req.params;
        await contenedorCarrito.deleteById(id)
            .then( id => {
                return res.status(200).json({
                    msj: 'Carrito borrado',
                    id: id
                });
            });
    } catch (e) {
        return res.status(400).json({
            error: 1,
            msj: "Ocurrio un error"
        });
    }
});

//Lista todos los productos guardados en un carrito
routerCarrito.get('/:id/productos', async (req, res) => {
    try {
        const {id} = req.params;
        await contenedorCarrito.getById(id)
            .then( carrito => {
                return res.status(200).json(
                    carrito.productos
                );
            });
    } catch (e) {
        return res.status(400).json({
            error: 1,
            msj: "Ocurrio un error"
        });
    }
});

//Agrega un producto al carrito
routerCarrito.post('/:id/productos', async (req, res) => {
    try {
        //Chequeos
        let {id} = req.params;
        if (!id) {
            return res.status(400).json({
                error: 3,
                msj: "Faltan especificar ID"
            });
        }

        let {nombre, descripcion, codigo, imagenUrl, precio, stock} = req.body;
        if (!nombre || !descripcion || !codigo || !imagenUrl || !precio || !stock) {
            return res.status(400).json({
                error: 2,
                msj: "Faltan items"
            });
        }

        const nuevoProducto = {
            nombre,
            descripcion,
            codigo,
            imagenUrl,
            precio,
            stock,
            timestamp: new Date.now()
        };

        //Modifico
        await contenedorCarrito.getById(id)
            .then(carrito => {
                let newId = carrito.productos.length === 0 ? 1 : carrito.productos[carrito.productos.length - 1].id + 1;
                return carrito.productos.push({id: newId, ...nuevoProducto});
            })
            .then(async carritoModificado => {
                await contenedorCarrito.modify(carritoModificado);
                return res.status(200).json({
                    msg: `Producto agregado en carrito ID: ${carritoModificado.id}`
                });
            });
    } catch (e) {
        return res.status(400).json({
            error: 1,
            msj: "Ocurrio un error"
        });
    }
});

//Borra un producto de un carrito
routerCarrito.delete('/:id/productos/:id_prod', async (req, res) => {
    try {
        let {id, id_prod} = req.params;
        if (!id || !id_prod) {
            return res.status(400).json({
                error: 3,
                msj: "Faltan especificar ID"
            });
        }

        await contenedorCarrito.getById(id)
            .then( carrito => {
                const productosFiltrados = carrito.productos.filter(element => element.id !== id_prod);
                return carrito.productos = productosFiltrados;
            })
            .then( async carritoModificado => {
                await contenedorCarrito.modify(carritoModificado);
                return res.status(200).json({
                    msg: `Producto eliminado en carrito ID: ${carritoModificado.id}`
                });
            });
    } catch (e) {
        return res.status(400).json({
            error: 1,
            msj: "Ocurrio un error"
        });
    }
});

module.exports = routerCarrito;