import api from '../api/api';

const ORDER_URL = '/orders';

const orderService = {
    // Checkout
    checkout: async (userId) => {
        try {
            const response = await api.post(`${ORDER_URL}/checkout/${userId}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || 'Checkout failed';
        }
    },

    // Get user orders
    getUserOrders: async (userId) => {
        try {
            const response = await api.get(`${ORDER_URL}/user/${userId}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || 'Failed to fetch orders';
        }
    }
};

export default orderService;