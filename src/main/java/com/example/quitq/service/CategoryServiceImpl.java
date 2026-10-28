package com.example.quitq.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.example.quitq.entity.Category;
import com.example.quitq.repository.CategoryRepository;

@Service
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepo;

    public CategoryServiceImpl(CategoryRepository categoryRepo) {
        this.categoryRepo = categoryRepo;
    }

    public List<Category> getAllCategories() {
        return categoryRepo.findAll();
    }

    public Category getCategoryById(Long id) {
        return categoryRepo.findById(id).orElse(null);
    }

    public Category saveCategory(Category category) {
        return categoryRepo.save(category);
    }

    public Category updateCategory(Long id, Category category) {
        Category existing = categoryRepo.findById(id).orElse(null);
        if (existing != null) {
            existing.setCategoryName(category.getCategoryName());
            return categoryRepo.save(existing);
        }
        return null;
    }

    public void deleteCategory(Long id) {
        categoryRepo.deleteById(id);
    }
}