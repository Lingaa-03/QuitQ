import api from '../api/api';

const CATEGORY_URL = '/categories';

const categoryService = {
    // Get all categories
    getAllCategories: async () => {
        try {
            console.log('Fetching categories from:', `${api.defaults.baseURL}${CATEGORY_URL}`);
            const response = await api.get(CATEGORY_URL);
            console.log('Categories response:', response.data);
            return response.data;
        } catch (error) {
            console.error('Error fetching categories:', error);
            throw error.response?.data || 'Failed to fetch categories';
        }
    },

    // Get category by ID
    getCategoryById: async (id) => {
        try {
            const response = await api.get(`${CATEGORY_URL}/${id}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || 'Failed to fetch category';
        }
    },

    // Create category (Admin only)
    createCategory: async (categoryData) => {
        try {
            const response = await api.post(CATEGORY_URL, categoryData);
            return response.data;
        } catch (error) {
            throw error.response?.data || 'Failed to create category';
        }
    },

    // Update category (Admin only)
    updateCategory: async (id, categoryData) => {
        try {
            const response = await api.put(`${CATEGORY_URL}/${id}`, categoryData);
            return response.data;
        } catch (error) {
            throw error.response?.data || 'Failed to update category';
        }
    },

    // Delete category (Admin only)
    deleteCategory: async (id) => {
        try {
            const response = await api.delete(`${CATEGORY_URL}/${id}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || 'Failed to delete category';
        }
    },

    // Get category with products
    getCategoryWithProducts: async (id) => {
        try {
            const response = await api.get(`${CATEGORY_URL}/${id}/products`);
            return response.data;
        } catch (error) {
            throw error.response?.data || 'Failed to fetch category products';
        }
    }
};

export default categoryService;