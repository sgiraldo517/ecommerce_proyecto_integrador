//! Import productsModel
import productsModel from '../database/models/products.model.js'

class Products {
    constructor() {

    }
    getProducts = async () => {
        const productos = await productsModel.find().lean()
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
        const deletedProduct = await productsModel.findByIdAndDelete(productId).select('owner'); 
        if (!deletedProduct) {
            return null;  
        }
        return deletedProduct.owner; 
    }    

    paginateProducts = async (query, options) => {
        let paginatedProductos = await productsModel.paginate(query, options);
        paginatedProductos.status = 'success',
        paginatedProductos.prevLink = paginatedProductos.hasPrevPage?`http://localhost:8080/products?page=${paginatedProductos.prevPage}&limit=${paginatedProductos.limit}`:null;
        paginatedProductos.nextLink = paginatedProductos.hasNextPage?`http://localhost:8080/products?page=${paginatedProductos.nextPage}&limit=${paginatedProductos.limit}`:null; 
        return paginatedProductos
    }

    getrecentlyadded = async () => {
        const recentProduct = await productsModel.findOne().sort({ _id: -1 }).lean();
        return recentProduct;
    }

    findProductsByOwnerId = async (userId) => {
            const products = await productsModel.find({ 'owner.user': userId }).lean();
            return products;
    };

}

export default Products