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
    private LocalDateTime timestamp;

    @Lob
    @Column(columnDefinition = "LONGBLOB")
    private byte[] imageData;

    public Message() {}

    public Message(User sender, String content, byte[] imageData) {
        this.sender = sender;
        this.content = content;
        this.imageData = imageData;
    }

    @PrePersist
    protected void onCreate(){
        this.timestamp = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public User getSender() { return sender; }
    public String getContent() { return content; }
    public LocalDateTime getTimestamp() { return timestamp; }
    public byte[] getImagePath() { return imageData; }
}

