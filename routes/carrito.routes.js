const express = require('express');
const routerCarrito = express.Router();
const Contenedor = require("../db/Contenedor");

const contenedorCarrito = new Contenedor("carritos.txt");

//Crea un carrito y devuelve su ID OK
routerCarrito.post('/', async (req, res) => {
    try {
        const nuevoCarrito = {
            timestamp: new Date().getTime(),
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

//Vacia un carrito y lo elimina OK
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

//Lista todos los productos guardados en un carrito OK
routerCarrito.get('/:id/productos', async (req, res) => {
    try {
        const {id} = req.params;
        await contenedorCarrito.getById(id)
            .then( carrito => {
                if(!carrito){throw new Error(`Carrito no existente`)}
                return res.status(200).json(
                    carrito.productos
                );
            });
    } catch (e) {
        return res.status(400).json({
            error: 1,
            msj: e.message
        });
    }
});

//Agrega un producto al carrito OK
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
            timestamp: new Date().getTime()
        };

        //Modifico
        await contenedorCarrito.getById(id)
            .then(carrito => {
                if(!carrito){throw new Error(`Carrito no existente`)}
                let newId = carrito.productos.length === 0 ? 1 : carrito.productos[carrito.productos.length - 1].id + 1;
                carrito.productos.push({id: newId, ...nuevoProducto});
                return carrito;
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
            msj: e.message
        });
    }
});

//Borra un producto de un carrito OK
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
                if(!carrito){throw new Error(`Carrito no existente`)}
                const productosFiltrados = carrito.productos.filter(element => element.id != id_prod);
                carrito.productos = productosFiltrados;
                return carrito;
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
            msj: e.message
        });
    }
});

module.exports = routerCarrito;