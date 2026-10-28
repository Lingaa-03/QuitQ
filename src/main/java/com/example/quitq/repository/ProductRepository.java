package com.example.quitq.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.quitq.entity.Product;

public interface ProductRepository extends JpaRepository<Product, Long> {
}