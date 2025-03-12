package com.telco.telecom.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.telco.telecom.entity.User;


public interface UserRepository extends JpaRepository<User, Long>{
    Optional<User> findByUsername(String username);
}
