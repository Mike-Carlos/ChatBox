package com.telco.telecom.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.telco.telecom.entity.Message;
import com.telco.telecom.entity.User;
import com.telco.telecom.service.MessageService;
import com.telco.telecom.service.UserService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;

import java.io.File;
import java.io.IOException;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.nio.file.Files;
import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "http://192.168.40.118:3000")
@RestController
@RequestMapping("/messages")
@Tag(name = "Nessage API", description = "Endpoints for managing messages")
public class MessageController {
    private final MessageService messageService;
    private final UserService userService;

    public MessageController(MessageService messageService, UserService userService) {
        this.messageService = messageService;
        this.userService = userService;
    }

    // ✅ Fetch all messages
    @Operation(summary = "Get all messages", description = "Retrieve a list of all messages", responses = {
        @ApiResponse(responseCode = "200", description = "List of messages", 
                     content = @Content(array = @ArraySchema(schema = @Schema(implementation = Message.class))))
    })
    @GetMapping
    public ResponseEntity<List<Message>> getAllMessages() {
        List<Message> messages = messageService.getAllMessages();
        return ResponseEntity.ok(messages);
    }

    @Operation(summary = "Send a message", description = "Send a new message with optional image", responses = {
        @ApiResponse(responseCode = "200", description = "Message sent successfully", 
                     content = @Content(schema = @Schema(implementation = Message.class))),
        @ApiResponse(responseCode = "401", description = "Unauthorized"),
        @ApiResponse(responseCode = "404", description = "User not found"),
        @ApiResponse(responseCode = "500", description = "Error saving image or message")
    })    
    @PostMapping(consumes = {"multipart/form-data"})
        public ResponseEntity<?> sendMessage(
                @AuthenticationPrincipal UserDetails userDetails,
                @RequestParam("content") String content,
                @RequestParam(value = "image", required = false) MultipartFile imageFile) {

            if (userDetails == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Unauthorized");
            }

            Optional<User> userOpt = userService.findByUsername(userDetails.getUsername());
            if (userOpt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
            }

            byte[] imageData = null;

            if (imageFile != null && !imageFile.isEmpty()) {
                try {
                    imageData = imageFile.getBytes(); // ✅ Store image as byte array
                } catch (IOException e) {
                    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                            .body("Error reading image: " + e.getMessage());
                }
            }

            Message savedMessage = messageService.saveMessage(userOpt.get(), content, imageData);
            return ResponseEntity.ok(savedMessage);
        }
}
