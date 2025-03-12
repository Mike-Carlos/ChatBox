package com.telco.telecom.service;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import com.telco.telecom.entity.User;
import com.telco.telecom.repository.UserRepository;
import com.telco.telecom.security.JwtUtil;

@Service
public class AuthService {
    
    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;
    private final BCryptPasswordEncoder passwordEncoder;
    

    public AuthService(UserRepository userRepository, JwtUtil jwtUtil){
        this.userRepository = userRepository;
        this.jwtUtil = jwtUtil;
        this.passwordEncoder = new BCryptPasswordEncoder();
    }

    public String register(User user){
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        userRepository.save(user);
        return "User registered successfully";
    }

    public String login(User user){
        User dbUser = userRepository.findByUsername(user.getUsername()).orElseThrow(() -> new RuntimeException("User not found"));

        if(passwordEncoder.matches(user.getPassword(), dbUser.getPassword())){
            return jwtUtil.generateToken(user.getUsername());
        }

        throw new RuntimeException("Invalid credentials");
    }

}
