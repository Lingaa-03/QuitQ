package com.example.quitq.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

import com.example.quitq.entity.Product;
import com.example.quitq.service.ProductService;
import com.example.quitq.DataInitializer;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "http://localhost:3000")
public class ProductController {

    private static final Logger logger = LoggerFactory.getLogger(ProductController.class);
    
    private final ProductService service;
    private final DataInitializer dataInitializer;

    public ProductController(ProductService service, DataInitializer dataInitializer) {
        this.service = service;
        this.dataInitializer = dataInitializer;
    }

    @GetMapping("/force-seed")
    public ResponseEntity<String> forceSeed() {
        try {
            dataInitializer.seedData();
            return ResponseEntity.ok("Premium inventory seeded successfully! Please refresh your products page.");
        } catch (Exception e) {
            logger.error("Error manual seeding: ", e);
            return ResponseEntity.status(500).body("Seeding failed: " + e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<List<Product>> getAll() {
        try {
            logger.info("Fetching all products");
            List<Product> products = service.getAllProducts();
            logger.info("Found {} products", products.size());
            return ResponseEntity.ok(products);
        } catch (Exception e) {
            logger.error("Error fetching products: ", e);
            return ResponseEntity.status(500).body(null);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Product> getById(@PathVariable Long id) {
        try {
            Product product = service.getProductById(id);
            if (product == null) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.ok(product);
        } catch (Exception e) {
            logger.error("Error fetching product {}: ", id, e);
            return ResponseEntity.status(500).body(null);
        }
    }

    @PostMapping
    public ResponseEntity<Product> add(@RequestBody Product product) {
        try {
            return ResponseEntity.status(201).body(service.saveProduct(product));
        } catch (Exception e) {
            logger.error("Error creating product: ", e);
            return ResponseEntity.status(500).body(null);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Product> update(@PathVariable Long id, @RequestBody Product product) {
        try {
            Product updated = service.updateProduct(id, product);
            if (updated == null) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            logger.error("Error updating product {}: ", id, e);
            return ResponseEntity.status(500).body(null);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> delete(@PathVariable Long id) {
        try {
            service.deleteProduct(id);
            return ResponseEntity.ok("Product deleted");
        } catch (Exception e) {
            logger.error("Error deleting product {}: ", id, e);
            return ResponseEntity.status(500).body("Error deleting product");
        }
    }
}