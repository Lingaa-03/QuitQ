package com.example.quitq.service;

import java.util.List;
import com.example.quitq.entity.User;

public interface UserService {

    User saveUser(User user);

    User getUserById(Long id);

    List<User> getAllUsers();

    void deleteUser(Long id);

    User findByEmail(String email);
}