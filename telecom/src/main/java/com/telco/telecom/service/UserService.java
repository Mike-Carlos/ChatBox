package com.telco.telecom.service;

import java.util.Optional;

import org.springframework.stereotype.Service;

import com.telco.telecom.entity.User;
import com.telco.telecom.repository.UserRepository;

@Service
public class UserService {
    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public Optional<User> findByUsername(String username) {
        return userRepository.findByUsername(username);
    }
}
