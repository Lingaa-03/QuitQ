import React from 'react';
import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { FaShoppingCart, FaUser, FaSignOutAlt, FaTachometerAlt, FaShoppingBag } from 'react-icons/fa';
import authService from '../services/authService';

const NavigationBar = () => {
    const navigate = useNavigate();
    const isLoggedIn = authService.isLoggedIn();
    const userRole = authService.getUserRole();

    const handleLogout = () => {
        authService.logout();
        navigate('/login');
    };

    return (
        <Navbar expand="lg" sticky="top" className="premium-navbar">
            <Container>
                <Navbar.Brand as={Link} to="/" className="fw-bold d-flex align-items-center gap-2" style={{ color: 'var(--primary)', fontSize: '1.5rem' }}>
                    <div className="p-2 rounded-3 bg-primary bg-opacity-10">
                        <FaShoppingBag style={{ fontSize: '1.2rem' }} />
                    </div>
                    <span style={{ letterSpacing: '-0.5px' }}>QuitQ</span>
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" className="border-0 shadow-none" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="ms-auto align-items-center gap-2">
                        <Nav.Link as={Link} to="/products" className="nav-link-premium px-3">Products</Nav.Link>
                        
                        {isLoggedIn && userRole === 'USER' && (
                            <>
                                <Nav.Link as={Link} to="/cart" className="nav-link-premium px-3">
                                    <FaShoppingCart className="me-1" /> Cart
                                </Nav.Link>
                                <Nav.Link as={Link} to="/orders" className="nav-link-premium px-3">My Orders</Nav.Link>
                            </>
                        )}
                        
                        {(userRole === 'SELLER' || userRole === 'ADMIN') && (
                            <Nav.Link as={Link} to="/seller/dashboard" className="nav-link-premium px-3">
                                <FaTachometerAlt className="me-1" /> Dashboard
                            </Nav.Link>
                        )}
                        
                        {userRole === 'ADMIN' && (
                            <Nav.Link as={Link} to="/admin/dashboard" className="nav-link-premium px-3">
                                Admin Panel
                            </Nav.Link>
                        )}
                        
                        {!isLoggedIn ? (
                            <div className="d-flex gap-2 ms-lg-3">
                                <Nav.Link as={Link} to="/login" className="nav-link-premium px-3">Login</Nav.Link>
                                <Nav.Link as={Link} to="/register" className="btn-premium py-2 px-4 text-white">Sign Up</Nav.Link>
                            </div>
                        ) : (
                            <NavDropdown 
                                title={
                                    <div className="d-inline-flex align-items-center justify-content-center bg-light rounded-circle" style={{ width: '40px', height: '40px' }}>
                                        <FaUser className="text-primary" />
                                    </div>
                                } 
                                id="basic-nav-dropdown"
                                align="end"
                                className="ms-lg-3"
                            >
                                <NavDropdown.Item onClick={handleLogout} className="py-2">
                                    <FaSignOutAlt className="me-2 text-danger" /> Logout
                                </NavDropdown.Item>
                            </NavDropdown>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default NavigationBar;