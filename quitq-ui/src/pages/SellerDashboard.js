import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Button, Modal, Form, Alert } from 'react-bootstrap';
import { FaPlus, FaEdit, FaTrash, FaBox, FaChartPie, FaStore } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import productService from '../services/productService';
import categoryService from '../services/categoryService';

const SellerDashboard = () => {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [showProductModal, setShowProductModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        stock: '',
        category: null
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            await Promise.all([fetchProducts(), fetchCategories()]);
            setLoading(false);
        };
        loadData();
    }, []);

    const fetchProducts = async () => {
        try {
            const data = await productService.getAllProducts();
            setProducts(data);
        } catch (err) {
            setError('Failed to load products');
        }
    };

    const fetchCategories = async () => {
        try {
            const data = await categoryService.getAllCategories();
            setCategories(data);
        } catch (err) {
            setError('Failed to load categories');
        }
    };

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSaveProduct = async () => {
        try {
            const productData = {
                ...formData,
                price: parseFloat(formData.price),
                stock: parseInt(formData.stock)
            };
            
            if (selectedProduct) {
                await productService.updateProduct(selectedProduct.productId, productData);
                setSuccess('Product updated successfully');
            } else {
                await productService.createProduct(productData);
                setSuccess('Product added successfully');
            }
            
            fetchProducts();
            setShowProductModal(false);
            resetForm();
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError('Failed to save product');
        }
    };

    const handleEditProduct = (product) => {
        setSelectedProduct(product);
        setFormData({
            name: product.name,
            price: product.price,
            stock: product.stock,
            category: product.category
        });
        setShowProductModal(true);
    };

    const handleDeleteProduct = async (productId) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                await productService.deleteProduct(productId);
                fetchProducts();
                setSuccess('Product deleted successfully');
                setTimeout(() => setSuccess(''), 3000);
            } catch (err) {
                setError('Failed to delete product');
            }
        }
    };

    const resetForm = () => {
        setSelectedProduct(null);
        setFormData({
            name: '',
            price: '',
            stock: '',
            category: null
        });
    };

    const getStockStatus = (stock) => {
        if (stock === 0) return { color: 'text-danger', bg: 'bg-danger bg-opacity-10', label: 'Out of Stock' };
        if (stock < 10) return { color: 'text-warning', bg: 'bg-warning bg-opacity-10', label: 'Low Stock' };
        return { color: 'text-success', bg: 'bg-success bg-opacity-10', label: 'In Stock' };
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
        <div className="seller-dashboard py-5" style={{ minHeight: '100vh', background: '#f8fafc' }}>
            <Container>
                <div className="d-flex justify-content-between align-items-center mb-5">
                    <div>
                        <h1 className="display-5 fw-bold mb-1">Seller Central</h1>
                        <p className="text-muted">Manage your inventory and track performance</p>
                    </div>
                    <Button 
                        className="btn-premium py-2 px-4 rounded-3 d-flex align-items-center gap-2"
                        onClick={() => {
                            resetForm();
                            setShowProductModal(true);
                        }}
                    >
                        <FaPlus /> Add New Product
                    </Button>
                </div>

                <AnimatePresence>
                    {error && (
                        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                            <Alert variant="danger" className="border-0 rounded-4 shadow-sm mb-4">{error}</Alert>
                        </motion.div>
                    )}
                    {success && (
                        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                            <Alert variant="success" className="border-0 rounded-4 shadow-sm mb-4">{success}</Alert>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Stats */}
                <Row className="mb-5 g-4">
                    <Col md={6}>
                        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                            <Card className="border-0 shadow-sm rounded-4 overflow-hidden">
                                <Card.Body className="p-4 d-flex align-items-center">
                                    <div className="p-3 bg-primary bg-opacity-10 rounded-4 me-4">
                                        <FaBox size={30} className="text-primary" />
                                    </div>
                                    <div>
                                        <h2 className="fw-bold mb-0">{products.length}</h2>
                                        <p className="text-muted mb-0">Total Products</p>
                                    </div>
                                </Card.Body>
                            </Card>
                        </motion.div>
                    </Col>
                    <Col md={6}>
                        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                            <Card className="border-0 shadow-sm rounded-4 overflow-hidden">
                                <Card.Body className="p-4 d-flex align-items-center">
                                    <div className="p-3 bg-success bg-opacity-10 rounded-4 me-4">
                                        <FaChartPie size={30} className="text-success" />
                                    </div>
                                    <div>
                                        <h2 className="fw-bold mb-0">{products.filter(p => p.stock > 0).length}</h2>
                                        <p className="text-muted mb-0">In Stock</p>
                                    </div>
                                </Card.Body>
                            </Card>
                        </motion.div>
                    </Col>
                </Row>

                {/* Products Table */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                    <Card className="border-0 shadow-sm rounded-4 overflow-hidden">
                        <Card.Header className="bg-white py-4 border-bottom d-flex align-items-center gap-2">
                            <FaStore className="text-primary" />
                            <h4 className="fw-bold mb-0">Product Inventory</h4>
                        </Card.Header>
                        <Card.Body className="p-0">
                            <Table responsive hover className="mb-0">
                                <thead className="bg-light">
                                    <tr>
                                        <th className="px-4 py-3">PRODUCT</th>
                                        <th className="py-3">CATEGORY</th>
                                        <th className="py-3">PRICE</th>
                                        <th className="py-3">STOCK</th>
                                        <th className="py-3">STATUS</th>
                                        <th className="text-end px-4 py-3">ACTIONS</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {products.map(product => {
                                        const status = getStockStatus(product.stock);
                                        return (
                                            <tr key={product.productId}>
                                                <td className="px-4 py-3">
                                                    <div className="d-flex align-items-center gap-3">
                                                        <div className="rounded-3 bg-light overflow-hidden" style={{ width: '40px', height: '40px' }}>
                                                            <img src={product.imageUrl || 'https://via.placeholder.com/40'} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                        </div>
                                                        <span className="fw-bold">{product.name}</span>
                                                    </div>
                                                </td>
                                                <td className="py-3 text-muted">{product.category?.categoryName || 'N/A'}</td>
                                                <td className="py-3 fw-bold text-primary">₹{product.price}</td>
                                                <td className="py-3 fw-bold">{product.stock}</td>
                                                <td className="py-3">
                                                    <span className={`badge ${status.bg} ${status.color} rounded-pill px-3 py-2`}>
                                                        {status.label}
                                                    </span>
                                                </td>
                                                <td className="text-end px-4 py-3">
                                                    <Button variant="light" className="rounded-circle p-2 text-warning me-2" onClick={() => handleEditProduct(product)}>
                                                        <FaEdit size={16} />
                                                    </Button>
                                                    <Button variant="light" className="rounded-circle p-2 text-danger" onClick={() => handleDeleteProduct(product.productId)}>
                                                        <FaTrash size={16} />
                                                    </Button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                    {products.length === 0 && (
                                        <tr>
                                            <td colSpan="6" className="text-center py-5 text-muted">
                                                <FaBox size={40} className="mb-3 opacity-25 d-block mx-auto" />
                                                No products found. Add your first product to start selling.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </Table>
                        </Card.Body>
                    </Card>
                </motion.div>
            </Container>

            {/* Product Modal */}
            <Modal show={showProductModal} onHide={() => setShowProductModal(false)} size="lg" centered>
                <div className="glass-card overflow-hidden" style={{ background: 'white' }}>
                    <Modal.Header closeButton className="border-0 p-4">
                        <Modal.Title className="fw-bold">
                            {selectedProduct ? 'Edit Product' : 'Add New Product'}
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body className="p-4 pt-0">
                        <Form>
                            <Form.Group className="mb-4">
                                <Form.Label className="small fw-bold text-muted mb-2">PRODUCT NAME</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    placeholder="Enter product name"
                                    className="premium-input py-3"
                                    required
                                />
                            </Form.Group>

                            <Row className="mb-4">
                                <Col md={6}>
                                    <Form.Group>
                                        <Form.Label className="small fw-bold text-muted mb-2">PRICE (₹)</Form.Label>
                                        <Form.Control
                                            type="number"
                                            name="price"
                                            value={formData.price}
                                            onChange={handleInputChange}
                                            placeholder="0.00"
                                            className="premium-input py-3"
                                            min="0"
                                            step="0.01"
                                            required
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group>
                                        <Form.Label className="small fw-bold text-muted mb-2">STOCK QUANTITY</Form.Label>
                                        <Form.Control
                                            type="number"
                                            name="stock"
                                            value={formData.stock}
                                            onChange={handleInputChange}
                                            placeholder="0"
                                            className="premium-input py-3"
                                            min="0"
                                            required
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Form.Group className="mb-2">
                                <Form.Label className="small fw-bold text-muted mb-2">CATEGORY</Form.Label>
                                <Form.Select
                                    name="category"
                                    value={formData.category?.categoryId || ''}
                                    onChange={(e) => {
                                        const selectedCat = categories.find(c => c.categoryId === parseInt(e.target.value));
                                        setFormData({ ...formData, category: selectedCat });
                                    }}
                                    className="premium-input py-3"
                                    required
                                >
                                    <option value="">Select a category</option>
                                    {categories.map(cat => (
                                        <option key={cat.categoryId} value={cat.categoryId}>
                                            {cat.categoryName}
                                        </option>
                                    ))}
                                </Form.Select>
                            </Form.Group>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer className="border-0 p-4 pt-0">
                        <Button variant="light" className="px-4 py-2 rounded-3 fw-bold" onClick={() => setShowProductModal(false)}>
                            Cancel
                        </Button>
                        <Button className="btn-premium px-4 py-2 rounded-3" onClick={handleSaveProduct}>
                            {selectedProduct ? 'Save Changes' : 'Add Product'}
                        </Button>
                    </Modal.Footer>
                </div>
            </Modal>
        </div>
    );
};

export default SellerDashboard;