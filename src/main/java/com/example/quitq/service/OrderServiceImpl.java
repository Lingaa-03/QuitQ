package com.example.quitq.service;

import com.example.quitq.entity.CartItem;
import com.example.quitq.entity.Order;
import com.example.quitq.repository.CartItemRepository;
import com.example.quitq.repository.OrderRepository;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepo;
    private final CartItemRepository cartItemRepo;

    public OrderServiceImpl(OrderRepository orderRepo,
                            CartItemRepository cartItemRepo) {
        this.orderRepo = orderRepo;
        this.cartItemRepo = cartItemRepo;
    }

    @Override
    public Order checkout(Long userId) {

        // ✅ FIX: fetch cart items (NOT Cart)
    	List<CartItem> items = cartItemRepo.findByCart_User_UserId(userId);

        if (items.isEmpty()) {
            throw new RuntimeException("Cart is empty");
        }

        Order order = new Order();

        // ✅ set user
        order.setUser(items.get(0).getCart().getUser());
        order.setStatus("PLACED");
        order.setOrderDate(java.time.LocalDateTime.now());

        // ✅ calculate total
        double total = items.stream()
                .mapToDouble(i ->
                        i.getProduct().getPrice() * i.getQuantity()
                )
                .sum();

        order.setTotalAmount(total);

        Order savedOrder = orderRepo.save(order);

        // ✅ Clear cart items after checkout
        cartItemRepo.deleteAll(items);

        return savedOrder;
    }
    
    

    @Override
    public List<Order> getOrdersByUser(Long userId) {
        return orderRepo.findByUserUserId(userId);
    }
}