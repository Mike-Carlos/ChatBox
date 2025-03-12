package com.telco.telecom.service;

import java.util.List;
import org.springframework.stereotype.Service;
import com.telco.telecom.entity.Message;
import com.telco.telecom.entity.User;
import com.telco.telecom.repository.MessageRepository;
import com.telco.telecom.repository.UserRepository;

@Service
public class MessageService {
    
    private final MessageRepository messageRepository;

    public MessageService(MessageRepository messageRepository, UserRepository userRepository) {
        this.messageRepository = messageRepository;
    }

    public List<Message> getAllMessages(){
        return messageRepository.findByOrderByTimestampAsc();
    }

    public Message saveMessage(User sender, String content) {
        return messageRepository.save(new Message(sender, content));
    }
    

}
