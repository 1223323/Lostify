package com.Lostify.Lostify.controller;

import com.Lostify.Lostify.dto.*;
import com.Lostify.Lostify.service.MessagingService;
import com.Lostify.Lostify.repository.UserRepository;
import com.Lostify.Lostify.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/messages")
@CrossOrigin(origins = "http://localhost:3000")
public class MessagingController {

    @Autowired
    private MessagingService messagingService;

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/conversation")
    public ResponseEntity<ConversationDTO> startConversation(@RequestBody StartConversationRequest request) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = auth.getName();
        
        // You'll need to get user ID from username - this depends on your UserService
        Long currentUserId = getCurrentUserId(username);
        
        ConversationDTO conversation = messagingService.startOrGetConversation(
                currentUserId, request.getOtherUserId(), request.getItemId());
        
        return ResponseEntity.ok(conversation);
    }

    @PostMapping("/send")
    public ResponseEntity<MessageDTO> sendMessage(@RequestBody SendMessageRequest request) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = auth.getName();
        Long currentUserId = getCurrentUserId(username);

        // First get or create conversation
        ConversationDTO conversation = messagingService.startOrGetConversation(
                currentUserId, request.getReceiverId(), request.getItemId());

        MessageDTO message = messagingService.sendMessage(
                conversation.getId(), currentUserId, request.getContent());
        
        return ResponseEntity.ok(message);
    }

    @GetMapping("/conversations")
    public ResponseEntity<List<ConversationDTO>> getUserConversations() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = auth.getName();
        Long currentUserId = getCurrentUserId(username);

        List<ConversationDTO> conversations = messagingService.getUserConversations(currentUserId);
        return ResponseEntity.ok(conversations);
    }

    @GetMapping("/conversation/{conversationId}/messages")
    public ResponseEntity<List<MessageDTO>> getConversationMessages(@PathVariable Long conversationId) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = auth.getName();
        Long currentUserId = getCurrentUserId(username);

        List<MessageDTO> messages = messagingService.getConversationMessages(conversationId, currentUserId);
        return ResponseEntity.ok(messages);
    }

    @PostMapping("/conversation/{conversationId}/read")
    public ResponseEntity<Void> markAsRead(@PathVariable Long conversationId) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = auth.getName();
        Long currentUserId = getCurrentUserId(username);

        messagingService.markMessagesAsRead(conversationId, currentUserId);
        return ResponseEntity.ok().build();
    }

    private Long getCurrentUserId(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return user.getId();
    }
}