import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Badge, Button, Alert } from 'react-bootstrap';
import { FaArrowLeft, FaShoppingCart, FaShieldAlt, FaTruck, FaUndo } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import productService from '../services/productService';
import cartService from '../services/cartService';

const ProductDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [adding, setAdding] = useState(false);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const data = await productService.getProductById(id);
                setProduct(data);
            } catch (err) {
                setError('Failed to load product');
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    const handleAddToCart = async () => {
        setAdding(true);
        try {
            await cartService.addToCart(product.productId, 1);
            setSuccess("Added to cart successfully! ✅");
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError("Failed to add to cart ❌");
            setTimeout(() => setError(''), 3000);
        } finally {
            setAdding(false);
        }
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

    if (error && !product) {
        return (
            <Container className="py-5 text-center">
                <Alert variant="danger" className="rounded-4">{error}</Alert>
                <Button variant="link" onClick={() => navigate('/products')}><FaArrowLeft /> Back to Shop</Button>
            </Container>
        );
    }

    return (
        <div className="product-detail-page py-5" style={{ minHeight: '100vh', background: '#f8fafc' }}>
            <Container>
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                >
                    <Button
                        variant="link"
                        onClick={() => navigate('/products')}
                        className="mb-5 text-decoration-none text-dark fw-bold d-flex align-items-center gap-2 ps-0"
                    >
                        <FaArrowLeft /> Back to Explore
                    </Button>
                </motion.div>

                <Row className="g-5">
                    {/* IMAGE COLUMN */}
                    <Col lg={7}>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5 }}
                        >
                            <Card className="border-0 shadow-sm overflow-hidden rounded-4 glass-card p-2" style={{ background: 'white' }}>
                                <div className="rounded-4 overflow-hidden" style={{ aspectRatio: '1/1', background: '#f1f5f9' }}>
                                    <img
                                        src={product.imageUrl || 'https://via.placeholder.com/800x800?text=Premium+Product'}
                                        alt={product.name}
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    />
                                </div>
                            </Card>
                        </motion.div>
                    </Col>

                    {/* DETAILS COLUMN */}
                    <Col lg={5}>
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            <div className="ps-lg-3">
                                <Badge className="mb-3 px-3 py-2 rounded-pill bg-primary bg-opacity-10 text-primary border-0 fw-bold">
                                    {product.category?.categoryName || 'Exclusive Collection'}
                                </Badge>
                                <h1 className="display-4 fw-bold mb-3" style={{ letterSpacing: '-1px' }}>{product.name}</h1>

                                <div className="d-flex align-items-center gap-3 mb-4">
                                    <h2 className="text-primary fw-bold mb-0" style={{ fontSize: '2.5rem' }}>₹{product.price}</h2>
                                    <span className={`badge rounded-pill px-3 py-2 ${product.stock > 0 ? 'bg-success bg-opacity-10 text-success' : 'bg-danger bg-opacity-10 text-danger'}`}>
                                        {product.stock > 0 ? `In Stock (${product.stock} left)` : 'Currently Out of Stock'}
                                    </span>
                                </div>

                                <p className="text-muted mb-5 leading-relaxed fs-5">
                                    {product.description || 'Elevate your lifestyle with this exceptional product. Designed for those who appreciate quality and attention to detail, it combines innovative features with timeless aesthetics.'}
                                </p>

                                <div className="d-grid gap-3 mb-5">
                                    <Button
                                        className="btn-premium py-3 px-5 rounded-3 fw-bold shadow-lg d-flex align-items-center justify-content-center gap-2"
                                        onClick={handleAddToCart}
                                        disabled={product.stock === 0 || adding}
                                        style={{ fontSize: '1.1rem' }}
                                    >
                                        <FaShoppingCart /> {adding ? 'Adding...' : 'Add to Bag'}
                                    </Button>
                                </div>

                                <Row className="g-4 py-4 border-top">
                                    <Col xs={6} md={4}>
                                        <div className="d-flex align-items-center gap-2 text-muted small">
                                            <FaTruck className="text-primary" />
                                            <span>Free Delivery</span>
                                        </div>
                                    </Col>
                                    <Col xs={6} md={4}>
                                        <div className="d-flex align-items-center gap-2 text-muted small">
                                            <FaShieldAlt className="text-primary" />
                                            <span>Secure Payment</span>
                                        </div>
                                    </Col>
                                    <Col xs={6} md={4}>
                                        <div className="d-flex align-items-center gap-2 text-muted small">
                                            <FaUndo className="text-primary" />
                                            <span>14 Day Returns</span>
                                        </div>
                                    </Col>
                                </Row>

                                {/* Estimated Delivery */}
                                <motion.div 
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.4 }}
                                    className="p-3 rounded-4 bg-light mb-4 border d-flex align-items-center gap-3"
                                >
                                    <div className="p-2 bg-white rounded-circle shadow-sm">
                                        <FaTruck className="text-success" />
                                    </div>
                                    <div>
                                        <p className="mb-0 fw-bold small">Estimated Delivery</p>
                                        <p className="mb-0 text-muted small">
                                            Get it by <span className="text-success fw-bold">
                                                {new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                            </span> (3 days from today)
                                        </p>
                                    </div>
                                </motion.div>

                                <AnimatePresence>
                                    {success && (
                                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-4">
                                            <Alert variant="success" className="border-0 rounded-3 shadow-sm">{success}</Alert>
                                        </motion.div>
                                    )}
                                    {error && (
                                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-4">
                                            <Alert variant="danger" className="border-0 rounded-3 shadow-sm">{error}</Alert>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </motion.div>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default ProductDetail;