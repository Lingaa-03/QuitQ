import api from '../api/api';

const AUTH_URL = '/auth';
const USER_URL = '/users';

const authService = {
    // Login user
    login: async (email, password) => {
        try {
            const response = await api.post(`${AUTH_URL}/login`, { email, password });
            
            if (response.data.token) {
                // 1. Save the token first
                localStorage.setItem('token', response.data.token);
                
                // 2. Save User ID and Role from login response if available
                if (response.data.userId) {
                    localStorage.setItem('userId', response.data.userId);
                }
                localStorage.setItem('userRole', response.data.role || 'USER');
                
                // 3. Always fetch full user info from /me endpoint as fallback
                await authService.fetchUserRole();
            }
            
            return response.data;
        } catch (error) {
            throw error.response?.data || 'Login failed';
        }
    },


    // Register user
    register: async (userData) => {
        try {
            const response = await api.post(`${USER_URL}/register`, userData);
            return response.data;
        } catch (error) {
            throw error.response?.data || 'Registration failed';
        }
    },

    // Fetch user role
    fetchUserRole: async () => {
        try {
            // You might need to add an endpoint to get current user info
            // For now, we'll check if user is admin based on email or add a /me endpoint
            const response = await api.get(`${USER_URL}/me`);
            localStorage.setItem('userRole', response.data.role);
            localStorage.setItem('userId', response.data.userId);
            return response.data;
        } catch (error) {
            console.error('Failed to fetch user role:', error);
            return null;
        }
    },

    // Get current user
    getCurrentUser: () => {
        const token = localStorage.getItem('token');
        if (!token) return null;
        
        // Decode JWT token to get user info
        try {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));
            return JSON.parse(jsonPayload);
        } catch (error) {
            return null;
        }
    },

    // Get user role
    getUserRole: () => {
        return localStorage.getItem('userRole') || 'USER';
    },

    // Logout
    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userRole');
        localStorage.removeItem('userId');
        window.location.href = '/login';
    },

    // Check if logged in
    isLoggedIn: () => {
        return !!localStorage.getItem('token');
    },

    // Check if admin
    isAdmin: () => {
        return localStorage.getItem('userRole') === 'ADMIN';
    },

    // Check if seller
    isSeller: () => {
        return localStorage.getItem('userRole') === 'SELLER';
    },

    // Check if user
    isUser: () => {
        return localStorage.getItem('userRole') === 'USER';
    }
};

export default authService;