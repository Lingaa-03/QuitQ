import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Table, Alert, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FaTrash, FaShoppingCart, FaArrowLeft, FaCreditCard, FaTruck, FaCalendarAlt } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import cartService from '../services/cartService';
import orderService from '../services/orderService';
import authService from '../services/authService';

const Cart = () => {
    const navigate = useNavigate();
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        fetchCart();
    }, []);

    const fetchCart = async () => {
        try {
            const data = await cartService.getCart();
            if (data && data.items) {
                setCartItems(data.items);
            } else {
                setCartItems([]);
            }
        } catch (err) {
            const msg = err.response?.data?.error || err.response?.data || err.message || 'Failed to load cart';
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    const updateQuantity = async (itemId, newQuantity) => {
        if (newQuantity < 1) return;
        try {
            await cartService.updateCartItem(itemId, newQuantity);
            fetchCart();
        } catch (err) {
            setError('Failed to update quantity');
        }
    };

    const removeItem = async (itemId) => {
        try {
            await cartService.removeFromCart(itemId);
            fetchCart();
            setSuccess('Item removed from cart');
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError('Failed to remove item');
        }
    };

    const handleCheckout = async () => {
        try {
            const userId = localStorage.getItem('userId');
            if (!userId) {
                setError('Please login to checkout');
                return;
            }
            await orderService.checkout(userId);
            setSuccess('Order placed successfully!');
            setTimeout(() => {
                navigate('/orders');
            }, 2000);
        } catch (err) {
            setError('Checkout failed. Please try again.');
        }
    };

    const calculateTotal = () => {
        return cartItems.reduce((total, item) => total + (item.product?.price * item.quantity), 0);
    };

    if (loading) {
        return (
            <div className="loading-spinner" style={{ minHeight: '80vh' }}>
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                    style={{ width: '50px', height: '50px', border: '4px solid var(--primary)', borderTopColor: 'transparent', borderRadius: '50%' }}
                />
            </div>
        );
    }

    return (
        <div className="cart-page py-5" style={{ minHeight: '100vh' }}>
            <Container>
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                >
                    <Button 
                        variant="link" 
                        onClick={() => navigate('/products')}
                        className="mb-4 text-decoration-none text-dark fw-bold d-flex align-items-center gap-2 ps-0"
                    >
                        <FaArrowLeft /> Continue Shopping
                    </Button>
                </motion.div>

                <h1 className="display-4 fw-bold mb-5">Shopping Bag</h1>

                <AnimatePresence>
                    {error && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                            <Alert variant="danger" className="border-0 rounded-4 shadow-sm mb-4">{error}</Alert>
                        </motion.div>
                    )}
                    {success && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                            <Alert variant="success" className="border-0 rounded-4 shadow-sm mb-4">{success}</Alert>
                        </motion.div>
                    )}
                </AnimatePresence>

                {cartItems.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center py-5 glass-card"
                    >
                        <div className="p-5">
                            <FaShoppingCart size={80} className="text-muted mb-4 opacity-25" />
                            <h2 className="fw-bold">Your bag is empty</h2>
                            <p className="text-muted mb-4">Seems like you haven't added anything to your bag yet.</p>
                            <Button className="btn-premium px-5" onClick={() => navigate('/products')}>
                                Explore Products
                            </Button>
                        </div>
                    </motion.div>
                ) : (
                    <Row className="g-4">
                        <Col lg={8}>
                            <div className="glass-card overflow-hidden" style={{ background: 'white' }}>
                                <div className="p-4 border-bottom d-none d-md-block">
                                    <Row className="fw-bold text-muted small">
                                        <Col md={6}>PRODUCT</Col>
                                        <Col md={2} className="text-center">PRICE</Col>
                                        <Col md={2} className="text-center">QUANTITY</Col>
                                        <Col md={2} className="text-end">TOTAL</Col>
                                    </Row>
                                </div>
                                <div className="cart-items">
                                    <AnimatePresence>
                                        {cartItems.map((item, index) => (
                                            <motion.div
                                                key={item.id}
                                                layout
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0, x: -100 }}
                                                className="p-4 border-bottom"
                                            >
                                                <Row className="align-items-center">
                                                    <Col md={6} className="mb-3 mb-md-0">
                                                        <div className="d-flex align-items-center gap-3">
                                                            <div className="rounded-3 overflow-hidden" style={{ width: '80px', height: '80px', background: '#f8fafc' }}>
                                                                <img 
                                                                    src={item.product?.imageUrl || 'https://via.placeholder.com/80'} 
                                                                    alt={item.product?.name} 
                                                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                                                                />
                                                            </div>
                                                            <div>
                                                                <h6 className="fw-bold mb-1">{item.product?.name}</h6>
                                                                <span className="badge bg-light text-muted fw-normal">{item.product?.category?.categoryName}</span>
                                                                <div className="mt-2 d-md-none d-flex align-items-center gap-3">
                                                                    <span className="fw-bold text-primary">₹{item.product?.price}</span>
                                                                    <Button variant="link" className="text-danger p-0" onClick={() => removeItem(item.id)}>
                                                                        <FaTrash size={14} />
                                                                    </Button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </Col>
                                                    <Col md={2} className="text-center d-none d-md-block">
                                                        <span className="fw-medium">₹{item.product?.price}</span>
                                                    </Col>
                                                    <Col md={2} className="text-center">
                                                        <div className="d-flex justify-content-center">
                                                            <Form.Control
                                                                type="number"
                                                                min="1"
                                                                max={item.product?.stock}
                                                                value={item.quantity}
                                                                onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
                                                                className="text-center border-0 bg-light rounded-3"
                                                                style={{ width: '70px', fontWeight: '600' }}
                                                            />
                                                        </div>
                                                    </Col>
                                                    <Col md={2} className="text-end d-flex d-md-block justify-content-between align-items-center mt-3 mt-md-0">
                                                        <span className="fw-bold text-primary d-md-block">₹{item.product?.price * item.quantity}</span>
                                                        <Button 
                                                            variant="link" 
                                                            className="text-danger p-0 ms-3 d-none d-md-inline-block"
                                                            onClick={() => removeItem(item.id)}
                                                        >
                                                            <FaTrash size={16} />
                                                        </Button>
                                                    </Col>
                                                </Row>
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>
                                </div>
                            </div>
                        </Col>

                        <Col lg={4}>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                            >
                                <Card className="border-0 shadow-sm rounded-4 p-3" style={{ background: 'white' }}>
                                    <Card.Body>
                                        <h4 className="fw-bold mb-4">Summary</h4>
                                        <div className="d-flex justify-content-between mb-3 text-muted">
                                            <span>Subtotal</span>
                                            <span>₹{calculateTotal()}</span>
                                        </div>
                                        <div className="d-flex justify-content-between mb-3 text-muted">
                                            <span>Shipping</span>
                                            <span className="text-success fw-bold">FREE</span>
                                        </div>
                                        <div className="d-flex justify-content-between mb-4 text-muted">
                                            <span>Estimated Tax</span>
                                            <span>₹0</span>
                                        </div>
                                        <hr />
                                        <div className="d-flex justify-content-between mb-4">
                                            <h5 className="fw-bold">Total</h5>
                                            <h5 className="fw-bold text-primary" style={{ fontSize: '1.5rem' }}>₹{calculateTotal()}</h5>
                                        </div>

                                        {/* Estimated Delivery Info */}
                                        <div className="p-3 rounded-4 bg-light mb-4 border-0 d-flex align-items-center gap-3">
                                            <div className="p-2 bg-white rounded-circle shadow-sm">
                                                <FaTruck className="text-success" size={14} />
                                            </div>
                                            <div className="flex-grow-1">
                                                <p className="mb-0 fw-bold small">Estimated Delivery</p>
                                                <p className="mb-0 text-muted small" style={{ fontSize: '0.75rem' }}>
                                                    Get it by <span className="text-success fw-bold">
                                                        {new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                                    </span>
                                                </p>
                                            </div>
                                        </div>

                                        <Button 
                                            className="btn-premium w-100 py-3 mb-3 d-flex align-items-center justify-content-center gap-2"
                                            onClick={handleCheckout}
                                        >
                                            <FaCreditCard /> Checkout Now
                                        </Button>
                                        <p className="text-center text-muted small">Secure checkout powered by QuitQ Pay</p>
                                    </Card.Body>
                                </Card>
                            </motion.div>
                        </Col>
                    </Row>
                )}
            </Container>
        </div>
    );
};

export default Cart;