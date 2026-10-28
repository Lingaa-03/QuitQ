import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaShoppingBag } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="bg-white border-top py-5 mt-5">
            <Container>
                <Row className="g-4">
                    <Col lg={4} md={6}>
                        <div className="d-flex align-items-center gap-2 mb-4">
                            <div className="p-2 rounded-3 bg-primary bg-opacity-10">
                                <FaShoppingBag className="text-primary" />
                            </div>
                            <h4 className="fw-bold mb-0" style={{ color: 'var(--primary)', letterSpacing: '-0.5px' }}>QuitQ</h4>
                        </div>
                        <p className="text-muted mb-4 pe-lg-5">
                            QuitQ is your premier destination for modern lifestyle essentials. We curate the best products to ensure quality and style in every purchase.
                        </p>
                        <div className="d-flex gap-3">
                            {[FaFacebook, FaTwitter, FaInstagram, FaLinkedin].map((Icon, i) => (
                                <a key={i} href="#" className="text-muted hover-primary transition">
                                    <Icon size={20} />
                                </a>
                            ))}
                        </div>
                    </Col>
                    <Col lg={2} md={6}>
                        <h6 className="fw-bold mb-4">Shop</h6>
                        <ul className="list-unstyled d-flex flex-column gap-2">
                            <li><Link to="/products" className="text-muted text-decoration-none hover-primary">All Products</Link></li>
                            <li><Link to="/products?category=Electronics" className="text-muted text-decoration-none hover-primary">Electronics</Link></li>
                            <li><Link to="/products?category=Fashion" className="text-muted text-decoration-none hover-primary">Fashion</Link></li>
                            <li><Link to="/products?category=Home" className="text-muted text-decoration-none hover-primary">Home & Living</Link></li>
                        </ul>
                    </Col>
                    <Col lg={2} md={6}>
                        <h6 className="fw-bold mb-4">Company</h6>
                        <ul className="list-unstyled d-flex flex-column gap-2">
                            <li><Link to="#" className="text-muted text-decoration-none hover-primary">About Us</Link></li>
                            <li><Link to="#" className="text-muted text-decoration-none hover-primary">Sustainability</Link></li>
                            <li><Link to="#" className="text-muted text-decoration-none hover-primary">Terms of Service</Link></li>
                            <li><Link to="#" className="text-muted text-decoration-none hover-primary">Privacy Policy</Link></li>
                        </ul>
                    </Col>
                    <Col lg={4} md={6}>
                        <h6 className="fw-bold mb-4">Join Our Newsletter</h6>
                        <p className="text-muted small mb-4">Get the latest updates on new arrivals and exclusive offers.</p>
                        <div className="d-flex gap-2">
                            <input type="email" className="premium-input flex-grow-1" placeholder="Your email address" />
                            <button className="btn-premium px-4">Join</button>
                        </div>
                    </Col>
                </Row>
                <hr className="my-5 opacity-10" />
                <div className="d-flex flex-column flex-md-row justify-content-between align-items-center gap-3">
                    <p className="text-muted small mb-0">© 2026 QuitQ E-commerce. All rights reserved.</p>
                    <div className="d-flex gap-4">
                        <Link to="#" className="text-muted small text-decoration-none">Privacy</Link>
                        <Link to="#" className="text-muted small text-decoration-none">Terms</Link>
                        <Link to="#" className="text-muted small text-decoration-none">Cookies</Link>
                    </div>
                </div>
            </Container>
        </footer>
    );
};

export default Footer;
