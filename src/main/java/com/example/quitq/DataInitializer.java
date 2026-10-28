package com.example.quitq;

import com.example.quitq.entity.Category;
import com.example.quitq.entity.Product;
import com.example.quitq.repository.CategoryRepository;
import com.example.quitq.repository.ProductRepository;
import com.example.quitq.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.ArrayList;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(DataInitializer.class);
    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;

    public DataInitializer(ProductRepository productRepository, CategoryRepository categoryRepository, UserRepository userRepository) {
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
        this.userRepository = userRepository;
    }

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        seedData();
    }

    @Transactional
    public void seedData() {
        logger.info("Initializing data seeding process...");

        // Initialize Categories
        Category electronics = getOrCreateCategory("Electronics");
        Category fashion = getOrCreateCategory("Fashion");
        Category home = getOrCreateCategory("Home & Kitchen");
        Category beauty = getOrCreateCategory("Beauty & Health");
        Category books = getOrCreateCategory("Books & Stationery");

        List<Product> productsToSeed = new ArrayList<>();

        // Electronics
        productsToSeed.add(createProduct("iPhone 15 Pro", "Latest Apple smartphone with Titanium design and A17 Pro chip.", 134900.00, 25, "https://images.unsplash.com/photo-1695048133142-1a20484d2569", electronics));
        productsToSeed.add(createProduct("Sony WH-1000XM5", "Noise canceling headphones with exceptional sound.", 29990.00, 40, "https://images.unsplash.com/photo-1618366712277-7070265118a5", electronics));
        productsToSeed.add(createProduct("Samsung Galaxy S24 Ultra", "Premium Android with AI features and S-Pen.", 129999.00, 15, "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf", electronics));
        productsToSeed.add(createProduct("MacBook Air M2", "Thinnest Apple laptop with the powerful M2 chip.", 99900.00, 20, "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9", electronics));
        productsToSeed.add(createProduct("Apple Watch Series 9", "The ultimate companion for a healthy life.", 41900.00, 30, "https://images.unsplash.com/photo-1546868871-70ca48370afd", electronics));

        // Fashion
        productsToSeed.add(createProduct("Nike Air Jordan 1", "Classic high-top sneakers with iconic design.", 15995.00, 10, "https://images.unsplash.com/photo-1584908114066-6b2512f71887", fashion));
        productsToSeed.add(createProduct("Levi's 501 Original Jeans", "The original straight fit jeans since 1873.", 4599.00, 50, "https://images.unsplash.com/photo-1542272604-787c3835535d", fashion));
        productsToSeed.add(createProduct("Ray-Ban Aviator Classic", "Iconic sunglasses providing superior protection.", 10990.00, 25, "https://images.unsplash.com/photo-1572635196237-14b3f281503f", fashion));
        productsToSeed.add(createProduct("Ralph Lauren Polo Shirt", "Classic fit polo shirt with signature pony.", 6999.00, 35, "https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99", fashion));

        // Home & Kitchen
        productsToSeed.add(createProduct("Nespresso Vertuo Next", "Premium coffee and espresso maker.", 18999.00, 15, "https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6", home));
        productsToSeed.add(createProduct("Dyson V15 Detect", "Powerful, intelligent cordless vacuum.", 65900.00, 12, "https://images.unsplash.com/photo-1558317374-067df5f15430", home));
        productsToSeed.add(createProduct("Instant Pot Duo 7-in-1", "Versatile multi-cooker replaces 7 appliances.", 12500.00, 45, "https://images.unsplash.com/photo-1585515320310-259814833e62", home));
        productsToSeed.add(createProduct("Air Purifier Pro", "Advanced filtration for clean home air.", 24999.00, 20, "https://images.unsplash.com/photo-1585771724684-2e26f148383f", home));

        // Beauty & Health
        productsToSeed.add(createProduct("Dior Sauvage Elixir", "Extraordinarily concentrated fragrance.", 14500.00, 18, "https://images.unsplash.com/photo-1523293182086-7651a899d37f", beauty));
        productsToSeed.add(createProduct("The Ordinary Serum Set", "Skincare set for hydrated and clear skin.", 2500.00, 100, "https://images.unsplash.com/photo-1556228720-195a672e8a03", beauty));
        productsToSeed.add(createProduct("Philips Sonicare DiamondClean", "Electric toothbrush for superior plaque removal.", 15999.00, 25, "https://images.unsplash.com/photo-1559591937-e6b76a3f1350", beauty));
        productsToSeed.add(createProduct("Yoga Mat Premium", "Eco-friendly non-slip yoga mat.", 3500.00, 60, "https://images.unsplash.com/photo-1592419044706-39796d40f98c", beauty));

        // Books & Stationery
        productsToSeed.add(createProduct("Atomic Habits", "Transform your life with tiny behavior changes.", 599.00, 150, "https://images.unsplash.com/photo-1544947950-fa07a98d237f", books));
        productsToSeed.add(createProduct("Kindle Paperwhite", "Thinnest, lightest Kindle Paperwhite.", 13999.00, 30, "https://images.unsplash.com/photo-1592434134753-a70baf7979d7", books));
        productsToSeed.add(createProduct("Moleskine Classic Notebook", "Legendary notebook used by thinkers.", 1899.00, 80, "https://images.unsplash.com/photo-1531346878377-a5be20888e57", books));

        int addedCount = 0;
        for (Product p : productsToSeed) {
            if (!productExists(p.getName())) {
                productRepository.save(p);
                addedCount++;
            }
        }
        
        logger.info("Successfully added {} new products to the database.", addedCount);

        // One-time patch for user #186 (Sekar)
        userRepository.findById(186L).ifPresent(user -> {
            if (user.getName() == null || user.getName().isEmpty()) {
                user.setName("Sekar");
                userRepository.save(user);
                logger.info("Patched missing name for user #186 (Sekar)");
            }
        });
    }

    private boolean productExists(String name) {
        return productRepository.findAll().stream()
                .anyMatch(p -> name.equalsIgnoreCase(p.getName()));
    }

    private Category getOrCreateCategory(String name) {
        return categoryRepository.findAll().stream()
                .filter(c -> c.getCategoryName().equalsIgnoreCase(name))
                .findFirst()
                .orElseGet(() -> {
                    Category cat = new Category();
                    cat.setCategoryName(name);
                    return categoryRepository.save(cat);
                });
    }

    private Product createProduct(String name, String desc, double price, int stock, String img, Category cat) {
        Product p = new Product();
        p.setName(name);
        p.setDescription(desc);
        p.setPrice(price);
        p.setStock(stock);
        p.setImageUrl(img);
        p.setCategory(cat);
        return p;
    }
}
