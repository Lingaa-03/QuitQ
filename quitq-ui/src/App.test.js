import { render, screen } from '@testing-library/react';
import App from './App';

// Mock the API calls made by the default Products component
jest.mock('./services/productService', () => ({
  getAllProducts: jest.fn(() => Promise.resolve([]))
}));
jest.mock('./services/categoryService', () => ({
  getAllCategories: jest.fn(() => Promise.resolve([]))
}));

test('renders navbar with QuitQ brand', async () => {
  render(<App />);
  const brandElements = await screen.findAllByText(/QuitQ/i);
  expect(brandElements.length).toBeGreaterThan(0);
});
