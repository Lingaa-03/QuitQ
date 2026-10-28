import { render, screen, waitFor } from '@testing-library/react';
import Orders from './Orders';
import orderService from '../services/orderService';
import { BrowserRouter } from 'react-router-dom';

// Mock the orderService
jest.mock('../services/orderService');

describe('Orders Page', () => {
    beforeEach(() => {
        // Clear all mocks before each test
        jest.clearAllMocks();
        // Mock localStorage
        Storage.prototype.getItem = jest.fn((key) => {
            if (key === 'userId') return '1';
            return null;
        });
    });

    test('renders orders title', async () => {
        orderService.getUserOrders.mockResolvedValue([]);
        
        render(
            <BrowserRouter>
                <Orders />
            </BrowserRouter>
        );
        
        // Use findByText to wait for the loading spinner to disappear
        const titleElement = await screen.findByText(/Your Orders/i);
        expect(titleElement).toBeInTheDocument();
    });

    test('shows empty state when no orders found', async () => {
        orderService.getUserOrders.mockResolvedValue([]);
        
        render(
            <BrowserRouter>
                <Orders />
            </BrowserRouter>
        );
        
        const emptyStateText = await screen.findByText(/No orders found/i);
        expect(emptyStateText).toBeInTheDocument();
    });

    test('renders list of orders', async () => {
        const mockOrders = [
            {
                orderId: 101,
                status: 'DELIVERED',
                orderDate: new Date().toISOString(),
                totalAmount: 1500,
                items: [{ id: 1 }]
            }
        ];
        
        orderService.getUserOrders.mockResolvedValue(mockOrders);
        
        render(
            <BrowserRouter>
                <Orders />
            </BrowserRouter>
        );
        
        const orderIdElement = await screen.findByText(/Order #101/i);
        expect(orderIdElement).toBeInTheDocument();
        const amountElement = await screen.findByText(/1500/i);
        expect(amountElement).toBeInTheDocument();
    });
});
