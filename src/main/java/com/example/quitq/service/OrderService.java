package com.example.quitq.service;

import com.example.quitq.entity.Order;
import java.util.List;

public interface OrderService {

    Order checkout(Long userId);

    List<Order> getOrdersByUser(Long userId); // ✅ ADD THIS
}