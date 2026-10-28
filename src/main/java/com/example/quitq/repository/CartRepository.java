package com.example.quitq.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.quitq.entity.Cart;

@Repository
public interface CartRepository extends JpaRepository<Cart, Long> {

    // 🔥 REQUIRED FOR CHECKOUT
    Cart findByUserUserId(Long userId);
}