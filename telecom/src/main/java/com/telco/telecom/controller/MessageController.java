package com.telco.telecom.controller;

import org.springframework.web.bind.annotation.*;

import com.telco.telecom.entity.Message;
import com.telco.telecom.entity.User;
import com.telco.telecom.service.MessageService;
import com.telco.telecom.service.UserService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/messages")
public class MessageController {
    private final MessageService messageService;
    private final UserService userService;

    public MessageController(MessageService messageService, UserService userService) {
        this.messageService = messageService;
        this.userService = userService;
    }

    // ✅ Fetch all messages
    @GetMapping
    public ResponseEntity<List<Message>> getAllMessages() {
        List<Message> messages = messageService.getAllMessages();
        return ResponseEntity.ok(messages);
    }

    // ✅ Send a new message (Authenticated users only)
    @PostMapping
    public ResponseEntity<?> sendMessage(@AuthenticationPrincipal UserDetails userDetails, @RequestBody Map<String, String> request) {
        if (userDetails == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Unauthorized");
        }

        Optional<User> userOpt = userService.findByUsername(userDetails.getUsername());
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }

        String content = request.get("content");
        Message savedMessage = messageService.saveMessage(userOpt.get(), content);

        return ResponseEntity.ok(savedMessage);
    }
}
