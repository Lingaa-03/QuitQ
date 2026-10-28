package com.example.quitq.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.quitq.entity.Category;

public interface CategoryRepository extends JpaRepository<Category, Long> {
}