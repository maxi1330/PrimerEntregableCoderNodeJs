class Carrito {

    constructor(id) {
        this.id = id;
        this.timestamp = new Date.now();
        this.products = [];
    }

    addProduct(product) {
        let newId = this.products.length === 0 ? 1 : this.products[this.products.length - 1].id + 1;
        const newProduct = {id: newId, ...product};
        this.products.push(newProduct);
    }

    getAllProduct(){
        return this.products;
    }

    deleteProductById(productId) {
        this.products = this.products.filter(element => element.id !== productId);
    }

    emptyCart () {
        this.products = [];
    }
}

module.exports = Carrito;