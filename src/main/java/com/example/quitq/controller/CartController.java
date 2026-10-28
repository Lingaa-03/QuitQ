package com.example.quitq.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

import com.example.quitq.entity.Cart;
import com.example.quitq.entity.CartItem;
import com.example.quitq.entity.Product;
import com.example.quitq.entity.User;

import com.example.quitq.repository.CartRepository;
import com.example.quitq.repository.CartItemRepository;
import com.example.quitq.repository.ProductRepository;
import com.example.quitq.repository.UserRepository;

import com.example.quitq.service.CartService;

@RestController
@RequestMapping("/api/cart")
@CrossOrigin(origins = "http://localhost:3000")
public class CartController {

    private final CartService service;
    private final CartItemRepository cartItemRepo;
    private final ProductRepository productRepo;
    private final CartRepository cartRepo;
    private final UserRepository userRepo;

    public CartController(CartService service,
                          CartItemRepository cartItemRepo,
                          ProductRepository productRepo,
                          CartRepository cartRepo,
                          UserRepository userRepo) {
        this.service = service;
        this.cartItemRepo = cartItemRepo;
        this.productRepo = productRepo;
        this.cartRepo = cartRepo;
        this.userRepo = userRepo;
    }

    // ✅ GET ALL CARTS
    @GetMapping
    public ResponseEntity<List<Cart>> getAll() {
        return ResponseEntity.ok(service.getAll());
    }

    // ✅ GET CART BY ID
    @GetMapping("/{id}")
    public ResponseEntity<Cart> getById(@PathVariable Long id) {
        return ResponseEntity.ok(service.getById(id));
    }

    // ✅ GET CART BY USER ID (Creates one if it doesn't exist)
    @GetMapping("/user/{userId}")
    public ResponseEntity<Cart> getByUserId(@PathVariable Long userId) {
        System.out.println("Fetching cart for userId: " + userId);
        Cart cart = cartRepo.findByUserUserId(userId);
        if (cart == null) {
            System.out.println("Cart not found for userId " + userId + ". Creating new cart.");
            User user = userRepo.findById(userId)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            cart = new Cart();
            cart.setUser(user);
            cart.setItems(new java.util.ArrayList<>());
            cart = cartRepo.save(cart);
        }
        return ResponseEntity.ok(cart);
    }

    // 🔥 FIXED ADD TO CART (uses logged-in user from JWT)
    @PostMapping
    public ResponseEntity<CartItem> addToCart(@RequestBody CartItem item,
                                              java.security.Principal principal) {

        // ✅ FETCH PRODUCT
    	Long productId = item.getProduct().getProductId();
        Product product = productRepo.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        // ✅ GET ACTUAL LOGGED-IN USER FROM JWT
        String email = principal.getName();
        User user = userRepo.findByEmail(email);
        if (user == null) {
            throw new RuntimeException("User not found");
        }

        // ✅ GET OR CREATE CART
        Cart cart = cartRepo.findByUserUserId(user.getUserId());
        if (cart == null) {
            cart = new Cart();
            cart.setUser(user);
            cart = cartRepo.save(cart);
        }

        // ✅ SET REQUIRED FIELDS
        item.setProduct(product);
        item.setCart(cart);

        if (item.getQuantity() <= 0) {
            item.setQuantity(1);
        }

        return ResponseEntity.ok(cartItemRepo.save(item));
    }

    // ✅ UPDATE CART
    @PutMapping("/{id}")
    public ResponseEntity<Cart> update(@PathVariable Long id,
                                       @RequestBody Cart cart) {
        return ResponseEntity.ok(service.update(id, cart));
    }

    // ✅ DELETE CART
    @DeleteMapping("/{id}")
    public ResponseEntity<String> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.ok("Deleted");
    }

    // ✅ DELETE A SINGLE CART ITEM
    @org.springframework.transaction.annotation.Transactional
    @DeleteMapping("/item/{itemId}")
    public ResponseEntity<String> deleteCartItem(@PathVariable Long itemId) {
        if (!cartItemRepo.existsById(itemId)) {
            return ResponseEntity.ok("Item already removed");
        }
        cartItemRepo.deleteById(itemId);
        return ResponseEntity.ok("Cart item deleted");
    }

    // ✅ UPDATE A SINGLE CART ITEM QUANTITY
    @org.springframework.transaction.annotation.Transactional
    @PutMapping("/item/{itemId}")
    public ResponseEntity<CartItem> updateCartItem(@PathVariable Long itemId,
                                                    @RequestBody CartItem updatedItem) {
        CartItem existing = cartItemRepo.findById(itemId)
                .orElseThrow(() -> new RuntimeException("Cart item not found"));
        existing.setQuantity(updatedItem.getQuantity());
        return ResponseEntity.ok(cartItemRepo.save(existing));
    }
}