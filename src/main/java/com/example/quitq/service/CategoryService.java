package com.example.quitq.service;

import java.util.List;
import com.example.quitq.entity.Category;

public interface CategoryService {

    List<Category> getAllCategories();

    Category getCategoryById(Long id);

    Category saveCategory(Category category);

    Category updateCategory(Long id, Category category);

    void deleteCategory(Long id);
}