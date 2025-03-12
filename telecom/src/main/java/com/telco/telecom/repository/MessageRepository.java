package com.telco.telecom.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.telco.telecom.entity.Message;

public interface MessageRepository extends JpaRepository<Message, Long> {
    List<Message> findByOrderByTimestampAsc(); // Fetch messages in order
}
