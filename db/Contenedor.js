const fs = require('fs');

class Contenedor {

    constructor(nombreArchivo) {
        this.nombreArchivo = "./archivos/" + nombreArchivo;
    }

    async save(objectToSave) {
        let objects = await this.getAll();
        let newId = objects.length === 0 ? 1 : objects[objects.length - 1].id + 1;
        const objectToSaveNew = {id: newId, ...objectToSave};
        objects.push(objectToSaveNew);
        try {
            await fs.promises.writeFile(this.nombreArchivo, JSON.stringify(objects,null,2));
            return newId;
        } catch (e) {
            throw new Error(`Error al guardar`)
        }
    }

    async getById(objectId){
        const objects = await this.getAll();
        return objects.filter(element => element.id == objectId)[0];
    }

    async getAll(){
        try {
            return JSON.parse(await fs.promises.readFile(this.nombreArchivo, 'utf-8'));
        } catch (e) {
            return [];
        }
    }

    async deleteById(objectId){
        const objects = await this.getAll();
        const objectsFiltered = objects.filter(element => element.id != objectId);
        if(objectsFiltered.length == objects.length){
            throw new Error(`Objeto no encontrado para eliminar`)
        }
        try {
            await fs.promises.writeFile(this.nombreArchivo, JSON.stringify(objectsFiltered));
        } catch (e) {
            throw new Error(`Error al borrar`)
        }
    }

    async deleteAll(){
        try {
            await fs.promises.writeFile(this.nombreArchivo, JSON.stringify([]));
        } catch (e) {
            throw new Error(`Error al borrar todo`)
        }
    }

    async modify(objectModify){
        try {
            const objects = await this.getAll();
            const indexProducto = objects.findIndex((producto => producto.id == objectModify.id));
            if(indexProducto == null) {
                throw new Error(`Item no encontrado`);
            }
            objects[indexProducto] = objectModify;
            await fs.promises.writeFile(this.nombreArchivo, JSON.stringify(objects));
        } catch (e) {
            throw new Error(`Error al modificar`)
        }
    }
}

module.exports = Contenedor;