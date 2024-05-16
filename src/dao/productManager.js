import { promises as fs } from 'fs';

class ProductManager {
    constructor(path) {
        this.path = path
    }

    async addProduct(title, description, code, price, status = true, stock, category, thumbnail = null) {
        try {
            let products = await this.traerProductos() 
            const producto_id = products.length + 1
            const producto = {
                id: producto_id,
                title,
                description,
                code, 
                price, 
                status,
                stock,
                category,
                thumbnail
            }
            products.push(producto)
            await fs.writeFile(this.path, JSON.stringify(products, null, 2))
        } catch (e) {
            throw e
        }
    }  

    async getProducts() {
        try {
            return await this.traerProductos()
        } catch (e) {
            throw e
        }
    }

    async getProductById(id) {
        try {
            let products = await this.traerProductos()
            const producto_buscado = products.find((prod) => prod.id === id)
            return producto_buscado;
        } catch (e) {
            throw e
        }
    }

    async deleteProduct(id) {
        try {
            let products = await this.traerProductos();
            const index = products.findIndex(product => product.id === id);
            if (index !== -1) {
                products.splice(index, 1);
                await fs.writeFile(this.path, JSON.stringify(products, null, 2));
                return `El producto con el id ${id} fue eliminado exitosamente`;
            } else {
                return `Error: No se encontró un producto con id ${id}`;
            }
        } catch (e) {
            throw e
        }
    }

    async updateProduct(id, newData) {
        try {
            let products = await this.traerProductos();
            const index = products.findIndex(product => product.id === id);
            if (index !== -1) {
                products[index] = { ...products[index], ...newData };
                await fs.writeFile(this.path, JSON.stringify(products, null, 2));
                return `El Producto con id ${id} fue actualizado exitosamente`;
            } else {
                return `Error: No se encontró un producto con id ${id}`;
            }
        } catch (e) {
            throw e
        }
    }

    async traerProductos() {
            try {
                const datos = await fs.readFile(this.path, 'utf8')
                return JSON.parse(datos)
            } catch (e) {
                if (e.code === 'ENOENT') {
                    return []
                } else {
                    throw e
                }
            }
    }

}

export default ProductManager

