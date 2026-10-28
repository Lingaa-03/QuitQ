package com.example.quitq.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import com.example.quitq.entity.Product;
import com.example.quitq.repository.ProductRepository;

class ProductServiceTest {

    @Mock
    private ProductRepository productRepo;

    @InjectMocks
    private ProductServiceImpl productService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testGetAllProducts() {
        Product p1 = new Product();
        p1.setProductId(1L);
        p1.setName("Laptop");
        
        Product p2 = new Product();
        p2.setProductId(2L);
        p2.setName("Phone");

        when(productRepo.findAll()).thenReturn(Arrays.asList(p1, p2));

        List<Product> products = productService.getAllProducts();

        assertEquals(2, products.size());
        verify(productRepo).findAll();
    }

    @Test
    void testGetProductById() {
        Product product = new Product();
        product.setProductId(1L);
        product.setName("Laptop");

        when(productRepo.findById(1L)).thenReturn(Optional.of(product));

        Product found = productService.getProductById(1L);

        assertNotNull(found);
        assertEquals("Laptop", found.getName());
        verify(productRepo).findById(1L);
    }

    @Test
    void testSaveProduct() {
        Product product = new Product();
        product.setName("New Product");

        when(productRepo.save(any(Product.class))).thenReturn(product);

        Product saved = productService.saveProduct(product);

        assertNotNull(saved);
        assertEquals("New Product", saved.getName());
        verify(productRepo).save(product);
    }
}
