class Producto {

    constructor(id, nombre, descripcion, codigo, imagenUrl, precio, stock) {
        this.id = id;
        this.timestamp = new Date.now();
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.codigo = codigo;
        this.imagenUrl = imagenUrl;
        this.precio = precio;
        this.stock = stock;
    }

}

module.exports = Producto;