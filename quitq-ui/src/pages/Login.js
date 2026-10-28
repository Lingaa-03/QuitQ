import React, { useState } from 'react';
import { Container, Form, Button, Card, Alert } from 'react-bootstrap';
import { FaEnvelope, FaLock, FaUserCircle } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import authService from '../services/authService';

const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await authService.login(email, password);
            const role = authService.getUserRole();
            if (role === 'ADMIN') navigate('/admin/dashboard');
            else if (role === 'SELLER') navigate('/seller/dashboard');
            else navigate('/products');
        } catch (err) {
            setError(typeof err === 'string' ? err : 'Invalid email or password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-wrapper d-flex align-items-center justify-content-center" style={{ minHeight: '100vh', background: '#0f172a' }}>
            <div className="animated-bg">
                <div className="bg-circle" style={{ width: '400px', height: '400px', background: 'rgba(99, 102, 241, 0.1)', top: '-10%', left: '-10%' }}></div>
                <div className="bg-circle" style={{ width: '300px', height: '300px', background: 'rgba(236, 72, 153, 0.1)', bottom: '10%', right: '10%' }}></div>
            </div>

            <Container>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="mx-auto"
                    style={{ maxWidth: '400px' }}
                >
                    <Card className="glass-card border-0 shadow-xl overflow-hidden rounded-4">
                        <Card.Body className="p-5 text-white">
                            <div className="text-center mb-4">
                                <FaUserCircle size={60} className="text-primary mb-3 opacity-75" />
                                <h2 className="fw-bold mb-1">Welcome Back</h2>
                                <p className="text-muted">Enter your credentials to access your account</p>
                            </div>

                            {error && <Alert variant="danger" className="border-0 bg-danger bg-opacity-25 text-white rounded-3 mb-4">{error}</Alert>}

                            <Form onSubmit={handleSubmit}>
                                <Form.Group className="mb-4">
                                    <Form.Label className="small fw-bold text-muted mb-2">EMAIL ADDRESS</Form.Label>
                                    <div className="position-relative">
                                        <FaEnvelope className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" />
                                        <Form.Control
                                            type="email"
                                            placeholder="name@example.com"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                            className="premium-input ps-5"
                                            style={{ background: 'rgba(255,255,255,0.05)', color: 'white', border: '1px solid rgba(255,255,255,0.1)' }}
                                        />
                                    </div>
                                </Form.Group>

                                <Form.Group className="mb-4">
                                    <Form.Label className="small fw-bold text-muted mb-2">PASSWORD</Form.Label>
                                    <div className="position-relative">
                                        <FaLock className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" />
                                        <Form.Control
                                            type="password"
                                            placeholder="••••••••"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                            className="premium-input ps-5"
                                            style={{ background: 'rgba(255,255,255,0.05)', color: 'white', border: '1px solid rgba(255,255,255,0.1)' }}
                                        />
                                    </div>
                                </Form.Group>

                                <Button 
                                    type="submit" 
                                    className="btn-premium w-100 py-3 rounded-3 fw-bold"
                                    disabled={loading}
                                >
                                    {loading ? 'Sign In...' : 'Sign In'} →
                                </Button>
                            </Form>

                            <div className="text-center mt-4">
                                <p className="text-muted small">
                                    Don't have an account? <Link to="/register" className="text-primary text-decoration-none ms-1">Register here</Link>
                                </p>
                            </div>
                        </Card.Body>
                    </Card>
                </motion.div>
            </Container>
        </div>
    );
};

export default Login;