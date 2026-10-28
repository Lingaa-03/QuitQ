import api from '../api/api';

const PRODUCT_URL = '/products';

const productService = {
    // Get all products
    getAllProducts: async () => {
        try {
            console.log('Fetching products from:', `${api.defaults.baseURL}${PRODUCT_URL}`);
            const response = await api.get(PRODUCT_URL);
            console.log('Products response:', response.data);
            return response.data;
        } catch (error) {
            console.error('Error details:', error);
            console.error('Error response:', error.response);
            throw error.response?.data || 'Failed to fetch products';
        }
    },

    // Get product by ID
    getProductById: async (id) => {
        try {
            const response = await api.get(`${PRODUCT_URL}/${id}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || 'Failed to fetch product';
        }
    },

    // Create product (Seller/Admin)
    createProduct: async (productData) => {
        try {
            const response = await api.post(PRODUCT_URL, productData);
            return response.data;
        } catch (error) {
            throw error.response?.data || 'Failed to create product';
        }
    },

    // Update product (Seller/Admin)
    updateProduct: async (id, productData) => {
        try {
            const response = await api.put(`${PRODUCT_URL}/${id}`, productData);
            return response.data;
        } catch (error) {
            throw error.response?.data || 'Failed to update product';
        }
    },

    // Delete product (Seller/Admin)
    deleteProduct: async (id) => {
        try {
            const response = await api.delete(`${PRODUCT_URL}/${id}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || 'Failed to delete product';
        }
    },

    // Get products by category
    getProductsByCategory: async (categoryId) => {
        try {
            const response = await api.get(`${PRODUCT_URL}/category/${categoryId}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || 'Failed to fetch products by category';
        }
    },

    // Search products
    searchProducts: async (keyword) => {
        try {
            const response = await api.get(`${PRODUCT_URL}/search?keyword=${keyword}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || 'Failed to search products';
        }
    },

    // Update stock
    updateStock: async (id, stock) => {
        try {
            const response = await api.patch(`${PRODUCT_URL}/${id}/stock`, { stock });
            return response.data;
        } catch (error) {
            throw error.response?.data || 'Failed to update stock';
        }
    }
};

export default productService;