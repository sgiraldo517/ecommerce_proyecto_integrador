function deleteProduct(productId) {
    if (!confirm('Are you sure you want to delete this product?')) {
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
            alert('Product deleted successfully.');
            window.location.reload();
        } else {
            return response.json().then(data => {
                throw new Error(data.message || 'Error deleting product');
            });
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert(error.message);
    });
}
