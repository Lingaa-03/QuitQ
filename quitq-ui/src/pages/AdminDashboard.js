import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Button, Modal, Form, Alert } from 'react-bootstrap';
import { FaUsers, FaBox, FaTag, FaPlus, FaEdit, FaTrash, FaChartLine } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import userService from '../services/userService';
import productService from '../services/productService';
import categoryService from '../services/categoryService';

const AdminDashboard = () => {
    const [users, setUsers] = useState([]);
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [showCategoryModal, setShowCategoryModal] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [categoryName, setCategoryName] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            await Promise.all([fetchUsers(), fetchProducts(), fetchCategories()]);
            setLoading(false);
        };
        loadData();
    }, []);

    const fetchUsers = async () => {
        try {
            const data = await userService.getAllUsers();
            setUsers(data);
        } catch (err) {
            setError('Failed to load users');
        }
    };

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

    const handleDeleteUser = async (userId) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                await userService.deleteUser(userId);
                fetchUsers();
                setSuccess('User deleted successfully');
                setTimeout(() => setSuccess(''), 3000);
            } catch (err) {
                setError('Failed to delete user');
            }
        }
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

    const handleSaveCategory = async () => {
        try {
            if (selectedCategory) {
                await categoryService.updateCategory(selectedCategory.categoryId, { categoryName });
                setSuccess('Category updated successfully');
            } else {
                await categoryService.createCategory({ categoryName });
                setSuccess('Category created successfully');
            }
            fetchCategories();
            setShowCategoryModal(false);
            setCategoryName('');
            setSelectedCategory(null);
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError('Failed to save category');
        }
    };

    const handleEditCategory = (category) => {
        setSelectedCategory(category);
        setCategoryName(category.categoryName);
        setShowCategoryModal(true);
    };

    const handleDeleteCategory = async (categoryId) => {
        if (window.confirm('Are you sure you want to delete this category?')) {
            try {
                await categoryService.deleteCategory(categoryId);
                fetchCategories();
                setSuccess('Category deleted successfully');
                setTimeout(() => setSuccess(''), 3000);
            } catch (err) {
                setError('Failed to delete category');
            }
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
        <div className="admin-dashboard py-5" style={{ minHeight: '100vh', background: '#f8fafc' }}>
            <Container>
                <div className="d-flex justify-content-between align-items-center mb-5">
                    <div>
                        <h1 className="display-5 fw-bold mb-1">System Overview</h1>
                        <p className="text-muted">Manage users, products, and categories</p>
                    </div>
                    <div className="p-3 bg-white rounded-4 shadow-sm">
                        <FaChartLine className="text-primary me-2" />
                        <span className="fw-bold">Admin Portal Active</span>
                    </div>
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

                {/* Stats Cards */}
                <Row className="mb-5 g-4">
                    {[
                        { title: 'Total Users', value: users.length, icon: FaUsers, color: '#6366f1', bg: 'rgba(99, 102, 241, 0.1)' },
                        { title: 'Total Products', value: products.length, icon: FaBox, color: '#10b981', bg: 'rgba(16, 185, 129, 0.1)' },
                        { title: 'Total Categories', value: categories.length, icon: FaTag, color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.1)' }
                    ].map((stat, i) => (
                        <Col md={4} key={i}>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                            >
                                <Card className="border-0 shadow-sm rounded-4 h-100 overflow-hidden">
                                    <Card.Body className="d-flex align-items-center p-4">
                                        <div className="p-3 rounded-4 me-4" style={{ backgroundColor: stat.bg }}>
                                            <stat.icon size={30} style={{ color: stat.color }} />
                                        </div>
                                        <div>
                                            <h2 className="fw-bold mb-0">{stat.value}</h2>
                                            <p className="text-muted mb-0">{stat.title}</p>
                                        </div>
                                    </Card.Body>
                                </Card>
                            </motion.div>
                        </Col>
                    ))}
                </Row>

                <Row className="g-4">
                    {/* Users Management */}
                    <Col lg={12}>
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
                            <Card className="border-0 shadow-sm rounded-4 overflow-hidden mb-4">
                                <Card.Header className="bg-white py-4 border-bottom">
                                    <h4 className="fw-bold mb-0">User Management</h4>
                                </Card.Header>
                                <Card.Body className="p-0">
                                    <Table responsive hover className="mb-0">
                                        <thead className="bg-light">
                                            <tr>
                                                <th className="px-4 py-3">ID</th>
                                                <th className="py-3">NAME</th>
                                                <th className="py-3">EMAIL</th>
                                                <th className="py-3">ROLE</th>
                                                <th className="text-end px-4 py-3">ACTIONS</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {users.map(user => (
                                                <tr key={user.userId}>
                                                    <td className="px-4 py-3 text-muted">#{user.userId}</td>
                                                    <td className="py-3 fw-bold">{user.name}</td>
                                                    <td className="py-3">{user.email}</td>
                                                    <td className="py-3">
                                                        <span className={`badge rounded-pill px-3 py-2 ${user.role === 'ADMIN' ? 'bg-primary bg-opacity-10 text-primary' : 'bg-info bg-opacity-10 text-info'}`}>
                                                            {user.role}
                                                        </span>
                                                    </td>
                                                    <td className="text-end px-4 py-3">
                                                        <Button 
                                                            variant="light" 
                                                            className="rounded-circle p-2 text-danger"
                                                            onClick={() => handleDeleteUser(user.userId)}
                                                        >
                                                            <FaTrash size={16} />
                                                        </Button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </Table>
                                </Card.Body>
                            </Card>
                        </motion.div>
                    </Col>

                    {/* Category Management */}
                    <Col lg={6}>
                        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
                            <Card className="border-0 shadow-sm rounded-4 overflow-hidden h-100">
                                <Card.Header className="bg-white py-4 border-bottom d-flex justify-content-between align-items-center">
                                    <h4 className="fw-bold mb-0">Categories</h4>
                                    <Button className="btn-premium py-2 px-3 rounded-3" onClick={() => { setSelectedCategory(null); setCategoryName(''); setShowCategoryModal(true); }}>
                                        <FaPlus className="me-2" /> Add New
                                    </Button>
                                </Card.Header>
                                <Card.Body className="p-0">
                                    <Table responsive hover className="mb-0">
                                        <thead className="bg-light">
                                            <tr>
                                                <th className="px-4 py-3">ID</th>
                                                <th className="py-3">CATEGORY NAME</th>
                                                <th className="text-end px-4 py-3">ACTIONS</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {categories.map(category => (
                                                <tr key={category.categoryId}>
                                                    <td className="px-4 py-3 text-muted">#{category.categoryId}</td>
                                                    <td className="py-3 fw-bold">{category.categoryName}</td>
                                                    <td className="text-end px-4 py-3">
                                                        <Button variant="light" className="rounded-circle p-2 text-warning me-2" onClick={() => handleEditCategory(category)}>
                                                            <FaEdit size={16} />
                                                        </Button>
                                                        <Button variant="light" className="rounded-circle p-2 text-danger" onClick={() => handleDeleteCategory(category.categoryId)}>
                                                            <FaTrash size={16} />
                                                        </Button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </Table>
                                </Card.Body>
                            </Card>
                        </motion.div>
                    </Col>

                    {/* Product Management Overview */}
                    <Col lg={6}>
                        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}>
                            <Card className="border-0 shadow-sm rounded-4 overflow-hidden h-100">
                                <Card.Header className="bg-white py-4 border-bottom">
                                    <h4 className="fw-bold mb-0">Products Overview</h4>
                                </Card.Header>
                                <Card.Body className="p-0">
                                    <Table responsive hover className="mb-0">
                                        <thead className="bg-light">
                                            <tr>
                                                <th className="px-4 py-3">NAME</th>
                                                <th className="py-3">PRICE</th>
                                                <th className="text-end px-4 py-3">STOCK</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {products.slice(0, 8).map(product => (
                                                <tr key={product.productId}>
                                                    <td className="px-4 py-3 fw-bold">{product.name}</td>
                                                    <td className="py-3 text-primary">₹{product.price}</td>
                                                    <td className="text-end px-4 py-3">
                                                        <span className={`badge ${product.stock < 10 ? 'bg-danger' : 'bg-success'} bg-opacity-10 ${product.stock < 10 ? 'text-danger' : 'text-success'} rounded-pill px-3`}>
                                                            {product.stock}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </Table>
                                </Card.Body>
                            </Card>
                        </motion.div>
                    </Col>
                </Row>
            </Container>

            {/* Category Modal */}
            <Modal show={showCategoryModal} onHide={() => setShowCategoryModal(false)} centered>
                <div className="glass-card overflow-hidden" style={{ background: 'white' }}>
                    <Modal.Header closeButton className="border-0 p-4">
                        <Modal.Title className="fw-bold">
                            {selectedCategory ? 'Edit Category' : 'Add New Category'}
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body className="p-4 pt-0">
                        <Form>
                            <Form.Group>
                                <Form.Label className="small fw-bold text-muted mb-2">CATEGORY NAME</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={categoryName}
                                    onChange={(e) => setCategoryName(e.target.value)}
                                    placeholder="e.g. Electronics"
                                    className="premium-input py-3"
                                />
                            </Form.Group>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer className="border-0 p-4 pt-0">
                        <Button variant="light" className="px-4 py-2 rounded-3 fw-bold" onClick={() => setShowCategoryModal(false)}>
                            Cancel
                        </Button>
                        <Button className="btn-premium px-4 py-2 rounded-3" onClick={handleSaveCategory}>
                            Save Changes
                        </Button>
                    </Modal.Footer>
                </div>
            </Modal>
        </div>
    );
};

export default AdminDashboard;