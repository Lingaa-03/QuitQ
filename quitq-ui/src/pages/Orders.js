import React, { useState, useEffect } from 'react';
import { Container, Card, Badge, Alert } from 'react-bootstrap';
import { FaBox, FaRupeeSign, FaCalendarAlt, FaChevronRight, FaShoppingBag, FaTruck } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import orderService from '../services/orderService';

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const userId = localStorage.getItem('userId');
            if (!userId) {
                setError('Please login to view orders');
                return;
            }
            const data = await orderService.getUserOrders(userId);
            setOrders(data);
        } catch (err) {
            setError('Failed to load orders');
        } finally {
            setLoading(false);
        }
    };

    const getStatusBadge = (status) => {
        const colors = {
            'PLACED': { bg: 'bg-warning bg-opacity-10', color: 'text-warning' },
            'CONFIRMED': { bg: 'bg-info bg-opacity-10', color: 'text-info' },
            'SHIPPED': { bg: 'bg-primary bg-opacity-10', color: 'text-primary' },
            'DELIVERED': { bg: 'bg-success bg-opacity-10', color: 'text-success' },
            'CANCELLED': { bg: 'bg-danger bg-opacity-10', color: 'text-danger' }
        };
        const style = colors[status] || { bg: 'bg-secondary bg-opacity-10', color: 'text-secondary' };
        return <span className={`badge rounded-pill px-3 py-2 ${style.bg} ${style.color}`}>{status}</span>;
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
        <div className="orders-page py-5" style={{ minHeight: '100vh', background: '#f8fafc' }}>
            <Container>
                <div className="mb-5">
                    <h1 className="display-4 fw-bold mb-1">Your Orders</h1>
                    <p className="text-muted">Track and manage your recent purchases</p>
                </div>

                <AnimatePresence>
                    {error && (
                        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                            <Alert variant="danger" className="border-0 rounded-4 shadow-sm mb-4">{error}</Alert>
                        </motion.div>
                    )}
                </AnimatePresence>

                {orders.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center py-5 glass-card"
                    >
                        <div className="p-5">
                            <FaShoppingBag size={80} className="text-muted mb-4 opacity-25" />
                            <h2 className="fw-bold">No orders found</h2>
                            <p className="text-muted mb-4">You haven't placed any orders yet. Start exploring our products!</p>
                            <button className="btn-premium px-5 py-3" onClick={() => window.location.href='/products'}>
                                Shop Now
                            </button>
                        </div>
                    </motion.div>
                ) : (
                    <div className="orders-list">
                        <AnimatePresence>
                            {orders.map((order, index) => (
                                <motion.div
                                    key={order.orderId}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <Card className="border-0 shadow-sm rounded-4 overflow-hidden mb-4 hover-lift" style={{ background: 'white' }}>
                                        <Card.Body className="p-4">
                                            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
                                                <div className="d-flex align-items-center gap-4">
                                                    <div className="p-3 bg-light rounded-4 d-none d-sm-block">
                                                        <FaBox size={24} className="text-primary" />
                                                    </div>
                                                    <div>
                                                        <div className="d-flex align-items-center gap-2 mb-1">
                                                            <h5 className="fw-bold mb-0">Order #{order.orderId}</h5>
                                                            {getStatusBadge(order.status)}
                                                        </div>
                                                        <div className="text-muted small d-flex align-items-center gap-2">
                                                            <FaCalendarAlt />
                                                            <span>Placed on {new Date(order.orderDate).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                                                        </div>
                                                        <div className="mt-2 d-flex align-items-center gap-2 small">
                                                            <FaTruck className="text-success" />
                                                            <span className="text-success fw-bold">
                                                                {order.status === 'DELIVERED' ? 'Delivered' : `Estimated delivery: ${new Date(new Date(order.orderDate).getTime() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString()}`}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                                
                                                <div className="d-flex align-items-center justify-content-between gap-md-5 border-top border-md-0 pt-3 pt-md-0 mt-3 mt-md-0">
                                                    <div className="text-md-center">
                                                        <div className="text-muted small mb-1">Total Amount</div>
                                                        <div className="fw-bold text-primary fs-5">
                                                            <FaRupeeSign size={16} className="me-1" />
                                                            {order.totalAmount}
                                                        </div>
                                                    </div>
                                                    <div className="text-md-center">
                                                        <div className="text-muted small mb-1">Items</div>
                                                        <div className="fw-bold">{order.items?.length || 0} Products</div>
                                                    </div>
                                                    <div className="ps-md-4">
                                                        <button className="btn btn-light rounded-circle p-3 d-flex align-items-center justify-content-center">
                                                            <FaChevronRight size={14} className="text-muted" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </Card.Body>
                                    </Card>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </Container>
        </div>
    );
};

export default Orders;