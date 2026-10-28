package com.example.quitq.service;

import java.util.List;
import org.springframework.stereotype.Service;

import com.example.quitq.entity.CartItem;
import com.example.quitq.repository.CartItemRepository;

@Service
public class CartItemServiceImpl implements CartItemService {

    private final CartItemRepository repo;

    public CartItemServiceImpl(CartItemRepository repo) {
        this.repo = repo;
    }

    public List<CartItem> getAll() {
        return repo.findAll();
    }

    public CartItem getById(Long id) {
        return repo.findById(id).orElse(null);
    }

    public CartItem save(CartItem item) {
        return repo.save(item);
    }

    public CartItem update(Long id, CartItem item) {
        CartItem existing = repo.findById(id).orElse(null);
        if (existing != null) {
            return repo.save(item);
        }
        return null;
    }

    public void delete(Long id) {
        repo.deleteById(id);
    }
}