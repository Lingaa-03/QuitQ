package com.example.quitq.service;

import java.util.List;
import org.springframework.stereotype.Service;

import com.example.quitq.entity.Cart;
import com.example.quitq.repository.CartRepository;

@Service
public class CartServiceImpl implements CartService {

    private final CartRepository repo;

    public CartServiceImpl(CartRepository repo) {
        this.repo = repo;
    }

    public List<Cart> getAll() {
        return repo.findAll();
    }

    public Cart getById(Long id) {
        return repo.findById(id).orElse(null);
    }

    public Cart save(Cart cart) {
        return repo.save(cart);
    }

    public Cart update(Long id, Cart cart) {
        Cart existing = repo.findById(id).orElse(null);
        if (existing != null) {
            return repo.save(cart);
        }
        return null;
    }

    public void delete(Long id) {
        repo.deleteById(id);
    }
}