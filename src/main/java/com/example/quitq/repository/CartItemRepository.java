package com.example.quitq.repository;

import com.example.quitq.entity.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CartItemRepository extends JpaRepository<CartItem, Long> {

    // ✅ FIXED METHOD
    List<CartItem> findByCart_User_UserId(Long userId);
}