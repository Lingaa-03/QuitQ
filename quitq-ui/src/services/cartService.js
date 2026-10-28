import api from '../api/api';

const CART_URL = '/cart';

const cartService = {

    // ✅ GET CART for logged-in user
    getCart: async () => {
        const userId = localStorage.getItem('userId');
        if (!userId) throw new Error("User not logged in");
        const res = await api.get(`${CART_URL}/user/${userId}`);
        return res.data;
    },

    // ✅ ADD TO CART
    addToCart: async (productId, quantity = 1) => {
        const res = await api.post(CART_URL, {
            product: { productId: productId },
            quantity: quantity
        });
        return res.data;
    },

    // ✅ UPDATE CART ITEM QUANTITY
    updateCartItem: async (itemId, quantity) => {
        const res = await api.put(`${CART_URL}/item/${itemId}`, {
            quantity: quantity
        });
        return res.data;
    },

    // ✅ DELETE A SINGLE CART ITEM
    removeFromCart: async (itemId) => {
        await api.delete(`${CART_URL}/item/${itemId}`);
    }
};

export default cartService;
