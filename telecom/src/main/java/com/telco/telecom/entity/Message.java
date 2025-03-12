package com.telco.telecom.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "messages")
public class Message {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name= "user_id", nullable = false)
    private User sender;
    @Column(length = 2000, nullable = false)
    private String content;
    private LocalDateTime timestamp = LocalDateTime.now();

    public Message() {}

    public Message(User sender, String content) {
        this.sender = sender;
        this.content = content;
    }

    public Long getId() { return id; }
    public User getSender() { return sender; }
    public String getContent() { return content; }
    public LocalDateTime getTimestamp() { return timestamp; }
}

