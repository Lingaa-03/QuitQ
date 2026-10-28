package com.example.quitq.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.quitq.entity.User;

public interface UserRepository extends JpaRepository<User, Long> {

    User findByEmail(String email);
}