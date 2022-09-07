const express = require('express');
const routerProductos = express.Router();
const Contenedor = require("../db/Contenedor")

const contenedorProductos = new Contenedor("productos.txt");

//Lista un producto por ID o todos
routerProductos.get('/:id', async (req, res) => {
    try {
        const {id} = req.params;
        let productos = id !== undefined ?
            await contenedorProductos.getById(id) :
            await contenedorProductos.getAll();
        return res.status(200).json(productos);
    } catch (e) {
        return res.status(400).json({
            error: 1,
            msj: "Ocurrio un error"
        });
    }
});

//Agrega un producto nuevo *ADMIN
routerProductos.post('/', async (req, res) => {
    try {
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
            stock
        };

        await contenedorProductos.save(nuevoProducto)
            .then(id => {
                console.log(`Agregado el producto con el id: ${id}`);
                return res.status(200).json({
                    msj: `Producto agregado con exito. ID: ${id}`
                });
            });

    } catch (e) {
        return res.status(400).json({
            error: 1,
            msj: "Ocurrio un error"
        });
    }
});

//Actualiza un producto por ID *ADMIN
routerProductos.put('/:id', async (req, res) => {
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
        let productoModificar = await contenedorProductos.getById(id)

        const productoModificado = {
            timestamp: productoModificar.timestamp,
            id: productoModificar.id,
            nombre: nombre ? nombre : productoModificar.nombre,
            descripcion: descripcion ? descripcion : productoModificar.descripcion,
            codigo: codigo ? codigo : productoModificar.codigo,
            imagenUrl: imagenUrl ? imagenUrl : productoModificar.imagenUrl,
            precio: precio ? precio : productoModificar.precio,
            stock: stock ? stock : productoModificar.stock
        };

        await contenedorProductos.modify(productoModificado);
        return res.status(201).json({msg: `Producto actualizado.`});
    } catch (e) {
        return res.status(400).json({
            error: 1,
            msj: "Ocurrio un error"
        });
    }
});

//Borra un producto *ADMIN
routerProductos.delete('/:id', async (req, res) => {
    try {
        let {id} = req.params;
        if (!id) {
            return res.status(400).json({
                error: 3,
                msj: "Faltan especificar ID"
            });
        }
        await contenedorProductos.deleteById(id);
        return res.status(201).json({
            msg: `Producto ID ${id} eliminado`
        });
    } catch (e) {
        return res.status(400).json({
            error: 1,
            msj: "Ocurrio un error"
        });
    }
});

module.exports = routerProductos;