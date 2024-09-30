function deleteProduct(productId) {
    if (!confirm('¿Esta seguro que quiere eliminar el producto?')) {
        return; 
    }

    fetch(`/api/products/${productId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
    })
    .then(response => {
        if (response.ok) {
            alert('Producto eliminado exitosamente.');
            window.location.reload();
        } else {
            return response.json().then(data => {
                throw new Error(data.message || 'Error eliminando el producto');
            });
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert(error.message);
    });
}


function addProductToCart(cartId, productId, title) {
    if (!confirm(`¿Está seguro que quiere agregar el producto ${title} al carrito?`)) {
        return; 
    }

    fetch(`/api/carts/${cartId}/product/${productId}`, {
        method: 'POST',
    })
    .then(response => {
        if (response.ok) {
            if (confirm('Producto añadido al carrito exitosamente. ¿Desea seguir comprando o ir al carrito?')) {
                location.reload();
            } else {
                window.location.href = '/carts';
            }
        } else {
            alert('Error al añadir el producto al carrito');
        }
    })
    .catch(error => {
        console.error('Error adding product to cart:', error);
        alert('Error al añadir el producto al carrito');
    });
}


function deleteUsers() {
    if (!confirm('¿Esta seguro que quiere eliminar a los usuarios Inactivos?')) {
        return; 
    }

    fetch(`/api/users/`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error al eliminar usuarios inactivos');
        }
        return response.json(); 
    })
    .then(data => {
        alert(data.message);
        location.reload();
    })
    .catch(error => {
        console.error('Error:', error);
        alert(error.message);
    });
}