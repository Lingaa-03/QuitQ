package com.example.quitq.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.quitq.entity.Order;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {

    // 🔥 REQUIRED FOR ORDER HISTORY
    List<Order> findByUserUserId(Long userId);
}