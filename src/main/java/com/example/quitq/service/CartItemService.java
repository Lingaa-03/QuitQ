package com.example.quitq.service;

import java.util.List;
import com.example.quitq.entity.CartItem;

public interface CartItemService {

    List<CartItem> getAll();
    CartItem getById(Long id);
    CartItem save(CartItem item);
    CartItem update(Long id, CartItem item);
    void delete(Long id);
}