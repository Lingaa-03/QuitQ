import api from '../api/api';

const USER_URL = '/users';

const userService = {
    // Get all users (Admin only)
    getAllUsers: async () => {
        try {
            const response = await api.get(USER_URL);
            return response.data;
        } catch (error) {
            throw error.response?.data || 'Failed to fetch users';
        }
    },

    // Get user by ID
    getUserById: async (id) => {
        try {
            const response = await api.get(`${USER_URL}/${id}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || 'Failed to fetch user';
        }
    },

    // Delete user (Admin only)
    deleteUser: async (id) => {
        try {
            const response = await api.delete(`${USER_URL}/${id}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || 'Failed to delete user';
        }
    },

    // Update user
    updateUser: async (id, userData) => {
        try {
            const response = await api.put(`${USER_URL}/${id}`, userData);
            return response.data;
        } catch (error) {
            throw error.response?.data || 'Failed to update user';
        }
    }
};

export default userService;