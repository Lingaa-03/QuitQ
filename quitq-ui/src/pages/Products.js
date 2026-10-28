import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { FaSearch, FaFilter, FaShoppingBag } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import ProductCard from '../components/ProductCard';
import productService from '../services/productService';
import cartService from '../services/cartService';
import categoryService from '../services/categoryService';
import authService from '../services/authService';

const Products = () => {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [priceRange, setPriceRange] = useState(100000);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        fetchProducts();
        fetchCategories();
    }, []);

    useEffect(() => {
        filterProducts();
    }, [searchTerm, selectedCategory, priceRange, products]);

    const fetchProducts = async () => {
        try {
            const data = await productService.getAllProducts();
            setProducts(data);
            setFilteredProducts(data);
        } catch (err) {
            setError('Failed to load products');
        } finally {
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const data = await categoryService.getAllCategories();
            setCategories(data);
        } catch (err) {
            console.error('Failed to load categories');
        }
    };

    const filterProducts = () => {
        let filtered = [...products];
        
        if (searchTerm) {
            filtered = filtered.filter(p => 
                p.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        
        if (selectedCategory) {
            filtered = filtered.filter(p => 
                p.category?.categoryId === parseInt(selectedCategory)
            );
        }

        filtered = filtered.filter(p => p.price <= priceRange);
        
        setFilteredProducts(filtered);
    };

    const handleAddToCart = async (product) => {
        if (!authService.isLoggedIn()) {
            setError('Please login to add items to cart');
            setTimeout(() => setError(''), 3000);
            return;
        }

        try {
            const id = product.productId || product.id;
            await cartService.addToCart(id, 1);
            setSuccessMessage(`${product.name} added to cart!`);
            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (err) {
            console.error(err);
            setError('Failed to add to cart');
            setTimeout(() => setError(''), 3000);
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

    return (
        <div className="products-page">
            {/* Hero Section */}
            <div className="hero-section py-5 mb-5 text-white" style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', borderRadius: '0 0 50px 50px', position: 'relative', overflow: 'hidden' }}>
                <div className="bg-circle" style={{ width: '300px', height: '300px', background: 'var(--primary)', top: '-50px', right: '-50px', opacity: 0.2 }}></div>
                <Container className="text-center py-5 position-relative">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <h1 className="display-3 fw-bold mb-3">Elevate Your Lifestyle</h1>
                        <p className="lead mb-4 opacity-75 mx-auto" style={{ maxWidth: '700px' }}>
                            Discover our curated collection of premium products, designed to bring quality and sophistication to your everyday life.
                        </p>
                        <div className="d-flex justify-content-center gap-3">
                            <Button className="btn-premium px-4 py-2">
                                <FaShoppingBag className="me-2" /> Shop Now
                            </Button>
                            <Button variant="outline-light" className="rounded-3 px-4" onClick={() => document.getElementById('product-grid').scrollIntoView({ behavior: 'smooth' })}>
                                Explore All
                            </Button>
                        </div>
                    </motion.div>
                </Container>
            </div>

            <Container className="py-4">
                {/* Filters Row */}
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="glass-card p-4 mb-5 border-0 shadow-sm"
                    style={{ background: 'white', borderRadius: '24px' }}
                >
                    <Row className="align-items-center g-3">
                        <Col lg={4} className="position-relative">
                            <div className="position-relative">
                                <FaSearch className="position-absolute" style={{ left: '15px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                                <Form.Control
                                    type="text"
                                    placeholder="Search products..."
                                    value={searchTerm}
                                    onChange={(e) => {
                                        setSearchTerm(e.target.value);
                                        setShowSuggestions(true);
                                    }}
                                    onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                                    className="premium-input ps-5 py-2"
                                />
                            </div>
                            {/* Auto-suggestions dropdown */}
                            {showSuggestions && searchTerm && (
                                <div className="position-absolute w-100 bg-white shadow-lg rounded-3 mt-1 p-2" style={{ zIndex: 1000, maxHeight: '200px', overflowY: 'auto' }}>
                                    {filteredProducts.slice(0, 5).map(p => (
                                        <div 
                                            key={p.productId} 
                                            className="p-2 border-bottom cursor-pointer hover-bg-light"
                                            style={{ cursor: 'pointer' }}
                                            onClick={() => {
                                                setSearchTerm(p.name);
                                                setShowSuggestions(false);
                                            }}
                                        >
                                            <div className="fw-bold">{p.name}</div>
                                            <small className="text-muted">₹{p.price}</small>
                                        </div>
                                    ))}
                                    {filteredProducts.length === 0 && <div className="p-2 text-muted">No matches found</div>}
                                </div>
                            )}
                        </Col>
                        <Col lg={3}>
                            <div className="position-relative">
                                <FaFilter className="position-absolute" style={{ left: '15px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', zIndex: 5 }} />
                                <Form.Select
                                    value={selectedCategory}
                                    onChange={(e) => setSelectedCategory(e.target.value)}
                                    className="premium-input ps-5 py-2"
                                >
                                    <option value="">All Categories</option>
                                    {categories.map(cat => (
                                        <option key={cat.categoryId} value={cat.categoryId}>
                                            {cat.categoryName}
                                        </option>
                                    ))}
                                </Form.Select>
                            </div>
                        </Col>
                        <Col lg={3}>
                            <div className="px-2">
                                <Form.Label className="small text-muted mb-1 d-flex justify-content-between">
                                    <span>Max Price</span>
                                    <span className="fw-bold text-primary">₹{priceRange}</span>
                                </Form.Label>
                                <Form.Range 
                                    min={0} 
                                    max={100000} 
                                    step={500}
                                    value={priceRange}
                                    onChange={(e) => setPriceRange(e.target.value)}
                                    className="w-100"
                                />
                            </div>
                        </Col>
                        <Col lg={2}>
                            <Button variant="dark" className="w-100 py-2 rounded-3 fw-bold" onClick={() => {setSearchTerm(''); setSelectedCategory(''); setPriceRange(100000);}}>
                                Reset
                            </Button>
                        </Col>
                    </Row>
                </motion.div>

                {/* Messages */}
                <AnimatePresence>
                    {error && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                            <Alert variant="danger" className="border-0 rounded-4 shadow-sm mb-4">{error}</Alert>
                        </motion.div>
                    )}
                    {successMessage && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                            <Alert variant="success" className="border-0 rounded-4 shadow-sm mb-4">{successMessage}</Alert>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Products Grid */}
                <div id="product-grid">
                    {filteredProducts.length === 0 ? (
                        <div className="text-center py-5">
                            <img src="https://cdni.iconscout.com/illustration/premium/thumb/no-product-found-8266714-6650302.png" alt="No products" style={{ width: '250px', opacity: 0.6 }} />
                            <h3 className="mt-4 fw-bold">No products found</h3>
                            <p className="text-muted">We couldn't find what you're looking for. Try a different search.</p>
                        </div>
                    ) : (
                        <Row xs={1} md={2} lg={3} xl={4} className="g-4">
                            {filteredProducts.map((product, index) => (
                                <Col key={product.productId}>
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                    >
                                        <ProductCard 
                                            product={product} 
                                            onAddToCart={handleAddToCart}
                                        />
                                    </motion.div>
                                </Col>
                            ))}
                        </Row>
                    )}
                </div>
            </Container>
        </div>
    );
};

export default Products;