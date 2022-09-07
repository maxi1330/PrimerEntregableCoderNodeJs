const express = require('express');
const routerProductos = express.Router();
const Contenedor = require("../db/Contenedor");
let { verificaAdmin } = require ('../middlewares/verificaAdmin');

const contenedorProductos = new Contenedor("productos.txt");

//Lista un producto por ID o todos  OK
routerProductos.get('/:id?', async (req, res) => {
    try {
        const {id} = req.params;
        let productos = id !== undefined ?
            await contenedorProductos.getById(id) :
            await contenedorProductos.getAll();
        if(!productos) {
            return res.status(400).json({
                error: 4,
                msj: "Producto no encontrado"
            });
        }
        return res.status(200).json(productos);
    } catch (e) {
        return res.status(400).json({
            error: 1,
            msj: "Ocurrio un error"
        });
    }
});

//Agrega un producto nuevo *ADMIN  OK
routerProductos.post('/', verificaAdmin, async (req, res) => {
    try {
        let {nombre, descripcion, codigo, imagenUrl, precio, stock} = req.body;
        if (!nombre || !descripcion || !codigo || !imagenUrl || !precio || !stock) {
            return res.status(400).json({
                error: 2,
                msj: "Faltan items"
            });
        }

        let nuevoProducto = {
            nombre: nombre,
            descripcion: descripcion,
            codigo: codigo,
            imagenUrl: imagenUrl,
            precio: precio,
            stock: stock,
            timestamp: new Date().getTime()
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

//Actualiza un producto por ID *ADMIN  OK
routerProductos.put('/:id', verificaAdmin, async (req, res) => {
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

//Borra un producto *ADMIN  OK
routerProductos.delete('/:id', verificaAdmin, async (req, res) => {
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
            msj: e.message
        });
    }
});

module.exports = routerProductos;