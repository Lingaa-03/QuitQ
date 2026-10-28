import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NavigationBar from './components/Navbar';
import Footer from './components/Footer';
import PrivateRoute from './components/PrivateRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Orders from './pages/Orders';
import AdminDashboard from './pages/AdminDashboard';
import SellerDashboard from './pages/SellerDashboard';
import './styles/modern.css';

function App() {
    return (
        <Router>
            <div className="d-flex flex-column" style={{ minHeight: '100vh' }}>
                <NavigationBar />
                <main className="flex-grow-1">
                    <Routes>
                        {/* Public Routes */}
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/products" element={<Products />} />
                        <Route path="/products/:id" element={<ProductDetail />} />
                        
                        {/* User Routes */}
                        <Route path="/cart" element={
                            <PrivateRoute allowedRoles={['USER']}>
                                <Cart />
                            </PrivateRoute>
                        } />
                        <Route path="/orders" element={
                            <PrivateRoute allowedRoles={['USER']}>
                                <Orders />
                            </PrivateRoute>
                        } />
                        
                        {/* Seller Routes */}
                        <Route path="/seller/dashboard" element={
                            <PrivateRoute allowedRoles={['SELLER', 'ADMIN']}>
                                <SellerDashboard />
                            </PrivateRoute>
                        } />
                        
                        {/* Admin Routes */}
                        <Route path="/admin/dashboard" element={
                            <PrivateRoute allowedRoles={['ADMIN']}>
                                <AdminDashboard />
                            </PrivateRoute>
                        } />
                        
                        {/* Default Route */}
                        <Route path="/" element={<Products />} />
                    </Routes>
                </main>
                <Footer />
            </div>
        </Router>
    );
}

export default App;