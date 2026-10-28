import React from 'react';
import { Card, Button, Badge } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FaShoppingCart, FaEye } from 'react-icons/fa';
import { motion } from 'framer-motion';

const ProductCard = ({ product, onAddToCart }) => {
    const navigate = useNavigate();

    const getCategoryColor = (name) => {
        const colors = {
            'Fashion': '#6366f1',
            'Electronics': '#f59e0b',
            'Home & Kitchen': '#10b981',
            'Beauty & Health': '#f43f5e',
            'Books & Stationery': '#06b6d4',
            'Sports': '#ef4444',
            'Toys': '#ec4899',
            'Furniture': '#64748b',
            'Groceries': '#22c55e'
        };
        return colors[name] || '#6366f1';
    };

    const categoryColor = getCategoryColor(product.category?.categoryName);

    return (
        <motion.div
            whileHover={{ y: -10 }}
            transition={{ type: "spring", stiffness: 300 }}
        >
            <Card className="h-100 modern-card border-0">
                <div className="card-img-container" style={{ height: '240px', position: 'relative' }}>
                    <Card.Img
                        variant="top"
                        src={product.imageUrl || product.image_url || 'https://via.placeholder.com/300x200?text=No+Image'}
                        style={{ objectFit: 'cover', height: '100%', width: '100%' }}
                        className="product-img"
                        onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/300x200?text=Product+Coming+Soon';
                            e.target.onerror = null;
                        }}
                    />
                    <div className="position-absolute top-0 start-0 m-3">
                        <Badge 
                            style={{ 
                                backgroundColor: categoryColor, 
                                color: 'white',
                                padding: '8px 12px',
                                borderRadius: '10px',
                                fontWeight: '600',
                                boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                            }}
                        >
                            {product.category?.categoryName || 'General'}
                        </Badge>
                    </div>
                </div>
                <Card.Body className="d-flex flex-column p-4">
                    <Card.Title className="fw-bold h5 mb-2 text-truncate" title={product.name}>
                        {product.name}
                    </Card.Title>
                    <Card.Text className="text-muted small flex-grow-1 mb-3">
                        {product.description ? (product.description.substring(0, 70) + '...') : 'Discover the premium quality and exceptional value of this product.'}
                    </Card.Text>
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <div>
                            <span className="text-muted small d-block">Price</span>
                            <h4 className="fw-bold mb-0" style={{ color: 'var(--primary)' }}>₹{product.price.toLocaleString()}</h4>
                        </div>
                        <div className="text-end">
                            <span className="text-muted small d-block">Availability</span>
                            <span className={`fw-bold small ${product.stock > 0 ? 'text-success' : 'text-danger'}`}>
                                {product.stock > 0 ? `${product.stock} In Stock` : 'Out of Stock'}
                            </span>
                        </div>
                    </div>
                    <div className="d-grid gap-2">
                        <Button
                            variant="light"
                            onClick={() => navigate(`/products/${product.productId}`)}
                            className="rounded-3 fw-bold py-2 border"
                            style={{ transition: 'all 0.3s' }}
                        >
                            <FaEye className="me-2" /> Details
                        </Button>
                        <Button
                            className="btn-premium py-2"
                            onClick={() => onAddToCart(product)}
                            disabled={product.stock === 0}
                        >
                            <FaShoppingCart className="me-2" /> Add to Cart
                        </Button>
                    </div>
                </Card.Body>
            </Card>
        </motion.div>
    );
};

export default ProductCard;