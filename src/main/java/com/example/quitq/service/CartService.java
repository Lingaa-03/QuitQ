package com.example.quitq.service;

import java.util.List;
import com.example.quitq.entity.Cart;

public interface CartService {

    List<Cart> getAll();

    Cart getById(Long id);

    Cart save(Cart cart);

    Cart update(Long id, Cart cart);

    void delete(Long id);
}