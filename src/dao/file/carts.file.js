import { promises as fs } from 'fs';

class CartManager {
    constructor(path) {
        this.path = path
    }

    async addCarrito( products = [] ) {
        try {
            let carritos = await this.traerCarritos()
            const carrito_id = carritos.length + 1
            const carrito = {
                id: carrito_id,
                products
            }
            carritos.push(carrito)
            await fs.writeFile(this.path, JSON.stringify(carritos, null, 2))
        } catch (e) {
            throw e
        } 
    }

    async getCartById( id ) {
        try {
            let carritos = await this.traerCarritos()
            const carrito_buscado = carritos.find((cart) => cart.id === id)
            return carrito_buscado;
        } catch (e) {
            throw e
        }
    }

    async addAlCarrito( product_id, cart_id ) {
        try {
            let carritos = await this.traerCarritos()
            const index = carritos.findIndex(cart => cart.id === cart_id);
            if (index !== -1) {
                let productIndex = carritos[index].products.findIndex(product => product.product === product_id);
                if (productIndex === -1) {
                    carritos[index].products.push({
                        product: product_id,
                        quantity: 1
                    });
                } else {
                    carritos[index].products[productIndex].quantity++;
                }
                await fs.writeFile(this.path, JSON.stringify(carritos, null, 2));
                return `El Carrito con id ${cart_id} fue actualizado exitosamente`;
            } else {
                return `Error: No se encontró un carrito con id ${cart_id}`;
            }
        } catch (e) {
            throw e
        }
    }

    async traerCarritos() {
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

export default CartManager