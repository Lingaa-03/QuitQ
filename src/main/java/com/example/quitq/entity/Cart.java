package com.example.quitq.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "cart")
public class Cart {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "cart_id")
    private Long id;

    // ✅ USER RELATION (VERY IMPORTANT)
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @OneToMany(mappedBy = "cart", cascade = CascadeType.ALL)
    private java.util.List<CartItem> items;

    // ================= GETTERS & SETTERS =================

    public Long getId() {
        return id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public java.util.List<CartItem> getItems() {
        return items;
    }

    public void setItems(java.util.List<CartItem> items) {
        this.items = items;
    }
}