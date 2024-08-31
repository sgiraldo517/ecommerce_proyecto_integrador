export const generateProductErrorMessage = (product) => {
    return `
        Una o mas propiedades estas incompletas o no son validas.
        Lista de propiedades requeridas:
        - title: Debe ser un String, se recibio ${product.title},
        - description: Debe ser un String, se recibio ${product.description},
        - code: Debe ser un Alphanumerico de 6 digitos, se recibio ${product.code},
        - price: Debe ser un numero mayor a 0, se recibio ${product.price},
        - stock: Debe ser un numero mayor a 0, se recibio ${product.stock},
        - category: Debe ser un String, se recibio ${product.category}
    `;
};
