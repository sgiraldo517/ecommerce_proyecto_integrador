//! Import productsModel
import productsModel from '../database/models/products.model.js'

class Products {
    constructor() {

    }
    getProducts = async () => {
        const productos = await productsModel.find()
        return productos
    }

    getProductById = async (id) => {
        const productoBuscado = await productsModel.findById(id);
        return productoBuscado
    }

    addProduct = async (product) => {
        const productoCreado = await productsModel.create(product)
        return productoCreado
    }

    updateProduct = async (productId, newData) => {
        await productsModel.findByIdAndUpdate(productId, newData)
        return 
    }

    deleteProduct = async (productId) => {
        await productsModel.findByIdAndDelete(productId)
        return 
    }    

    paginateProducts = async (query, options) => {
        let paginatedProductos = await productsModel.paginate(query, options);
        paginatedProductos.status = 'success',
        paginatedProductos.prevLink = paginatedProductos.hasPrevPage?`http://localhost:8080/products?page=${paginatedProductos.prevPage}&limit=${paginatedProductos.limit}`:null;
        paginatedProductos.nextLink = paginatedProductos.hasNextPage?`http://localhost:8080/products?page=${paginatedProductos.nextPage}&limit=${paginatedProductos.limit}`:null; 
        return paginatedProductos
    }

}

export default Products