import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Card, Alert } from 'react-bootstrap';
import { FaUser, FaEnvelope, FaLock, FaStore } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import authService from '../services/authService';

const Register = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'USER'
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const [passwordStrength, setPasswordStrength] = useState('');
    const [formErrors, setFormErrors] = useState({});

    const calculateStrength = (password) => {
        if (!password) return '';
        if (password.length < 6) return 'Weak (Too short)';
        if (!/[A-Z]/.test(password) || !/[0-9]/.test(password)) return 'Fair (Add numbers/uppercase)';
        if (password.length >= 8 && /[A-Z]/.test(password) && /[0-9]/.test(password) && /[^A-Za-z0-9]/.test(password)) return 'Strong';
        return 'Good';
    };

    const getStrengthColor = (strength) => {
        if (strength.includes('Weak')) return 'text-danger';
        if (strength.includes('Fair')) return 'text-warning';
        if (strength.includes('Good')) return 'text-info';
        if (strength === 'Strong') return 'text-success';
        return 'text-muted';
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        
        // Clear specific error when typing
        if (formErrors[name]) {
            setFormErrors({ ...formErrors, [name]: '' });
        }
        
        if (name === 'password') {
            setPasswordStrength(calculateStrength(value));
        }
    };

    const validateForm = () => {
        const errors = {};
        if (formData.name.trim().length < 3) errors.name = 'Name must be at least 3 characters.';
        if (!/\S+@\S+\.\S+/.test(formData.email)) errors.email = 'Please enter a valid email.';
        if (formData.password.length < 6) errors.password = 'Password must be at least 6 characters.';
        
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) return;

        setLoading(true);
        setError('');
        try {
            await authService.register(formData);
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="register-wrapper d-flex align-items-center justify-content-center" style={{ minHeight: '100vh', background: '#0f172a', padding: '20px' }}>
            <div className="animated-bg">
                <div className="bg-circle" style={{ width: '500px', height: '500px', background: 'rgba(99, 102, 241, 0.1)', top: '-15%', right: '-10%' }}></div>
                <div className="bg-circle" style={{ width: '400px', height: '400px', background: 'rgba(236, 72, 153, 0.1)', bottom: '-10%', left: '-5%' }}></div>
            </div>

            <Container>
                <Row className="justify-content-center">
                    <Col lg={10}>
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <Card className="glass-card border-0 shadow-2xl overflow-hidden rounded-4">
                                <Row className="g-0">
                                    <Col md={5} className="d-none d-md-block" style={{ background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)' }}>
                                        <div className="h-100 d-flex flex-column justify-content-center p-5 text-white">
                                            <h2 className="display-6 fw-bold mb-4">Join QuitQ</h2>
                                            <p className="lead opacity-75">Create an account and start your premium shopping experience today.</p>
                                            <ul className="list-unstyled mt-5">
                                                <li className="mb-3 d-flex align-items-center gap-2">
                                                    <FaUser className="opacity-50" /> Personalized recommendations
                                                </li>
                                                <li className="mb-3 d-flex align-items-center gap-2">
                                                    <FaStore className="opacity-50" /> Sell your own products
                                                </li>
                                            </ul>
                                        </div>
                                    </Col>
                                    <Col md={7}>
                                        <Card.Body className="p-5 text-white">
                                            <div className="mb-4">
                                                <h2 className="fw-bold mb-1">Create Account</h2>
                                                <p className="text-muted">It's quick and easy.</p>
                                            </div>

                                            {error && <Alert variant="danger" className="border-0 bg-danger bg-opacity-25 text-white rounded-3 mb-4">{error}</Alert>}

                                            <Form onSubmit={handleSubmit}>
                                                <Form.Group className="mb-4">
                                                    <Form.Label className="small fw-bold text-muted mb-2">FULL NAME</Form.Label>
                                                    <div className="position-relative">
                                                        <FaUser className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" />
                                                        <Form.Control
                                                            type="text"
                                                            name="name"
                                                            placeholder="John Doe"
                                                            value={formData.name}
                                                            onChange={handleChange}
                                                            className={`premium-input ps-5 ${formErrors.name ? 'is-invalid' : ''}`}
                                                            style={{ background: 'rgba(255,255,255,0.05)', color: 'white', border: '1px solid rgba(255,255,255,0.1)' }}
                                                        />
                                                    </div>
                                                    {formErrors.name && <div className="text-danger small mt-1">{formErrors.name}</div>}
                                                </Form.Group>

                                                <Form.Group className="mb-4">
                                                    <Form.Label className="small fw-bold text-muted mb-2">EMAIL ADDRESS</Form.Label>
                                                    <div className="position-relative">
                                                        <FaEnvelope className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" />
                                                        <Form.Control
                                                            type="email"
                                                            name="email"
                                                            placeholder="name@example.com"
                                                            value={formData.email}
                                                            onChange={handleChange}
                                                            className={`premium-input ps-5 ${formErrors.email ? 'is-invalid' : ''}`}
                                                            style={{ background: 'rgba(255,255,255,0.05)', color: 'white', border: '1px solid rgba(255,255,255,0.1)' }}
                                                        />
                                                    </div>
                                                    {formErrors.email && <div className="text-danger small mt-1">{formErrors.email}</div>}
                                                </Form.Group>

                                                <Form.Group className="mb-4">
                                                    <Form.Label className="small fw-bold text-muted mb-2">PASSWORD</Form.Label>
                                                    <div className="position-relative">
                                                        <FaLock className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" />
                                                        <Form.Control
                                                            type="password"
                                                            name="password"
                                                            placeholder="••••••••"
                                                            value={formData.password}
                                                            onChange={handleChange}
                                                            className={`premium-input ps-5 ${formErrors.password ? 'is-invalid' : ''}`}
                                                            style={{ background: 'rgba(255,255,255,0.05)', color: 'white', border: '1px solid rgba(255,255,255,0.1)' }}
                                                        />
                                                    </div>
                                                    {passwordStrength && !formErrors.password && (
                                                        <div className={`small mt-1 fw-bold ${getStrengthColor(passwordStrength)}`}>
                                                            Strength: {passwordStrength}
                                                        </div>
                                                    )}
                                                    {formErrors.password && <div className="text-danger small mt-1">{formErrors.password}</div>}
                                                </Form.Group>

                                                <Form.Group className="mb-4">
                                                    <Form.Label className="small fw-bold text-muted mb-2">I AM A...</Form.Label>
                                                    <div className="d-flex gap-4">
                                                        <Form.Check type="radio" label="Customer" name="role" value="USER" checked={formData.role === 'USER'} onChange={handleChange} className="text-muted" />
                                                        <Form.Check type="radio" label="Seller" name="role" value="SELLER" checked={formData.role === 'SELLER'} onChange={handleChange} className="text-muted" />
                                                    </div>
                                                </Form.Group>

                                                <Button 
                                                    type="submit" 
                                                    className="btn-premium w-100 py-3 mt-3 rounded-3 fw-bold"
                                                    disabled={loading}
                                                >
                                                    {loading ? 'Creating Account...' : 'Get Started'}
                                                </Button>
                                            </Form>

                                            <div className="text-center mt-4">
                                                <p className="text-muted small">
                                                    Already have an account? <Link to="/login" className="text-primary text-decoration-none ms-1">Log in here</Link>
                                                </p>
                                            </div>
                                        </Card.Body>
                                    </Col>
                                </Row>
                            </Card>
                        </motion.div>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default Register;