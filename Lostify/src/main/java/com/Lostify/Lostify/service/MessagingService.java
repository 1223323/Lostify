package com.Lostify.Lostify.service;

import com.Lostify.Lostify.model.*;
import com.Lostify.Lostify.repository.*;
import com.Lostify.Lostify.dto.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class MessagingService {

    @Autowired
    private ConversationRepository conversationRepository;

    @Autowired
    private ConversationMessageRepository messageRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ItemRepository itemRepository;

    public ConversationDTO startOrGetConversation(Long currentUserId, Long otherUserId, Long itemId) {
        User currentUser = userRepository.findById(currentUserId)
                .orElseThrow(() -> new RuntimeException("Current user not found"));
        User otherUser = userRepository.findById(otherUserId)
                .orElseThrow(() -> new RuntimeException("Other user not found"));
        Item item = itemRepository.findById(itemId)
                .orElseThrow(() -> new RuntimeException("Item not found"));

        List<Conversation> existingConversations = conversationRepository
                .findByUsersAndItem(currentUser, otherUser, item);

        Conversation conversation;
        if (!existingConversations.isEmpty()) {
            // Use the first (oldest) conversation
            conversation = existingConversations.get(0);
            
            // Clean up duplicates if they exist
            if (existingConversations.size() > 1) {
                for (int i = 1; i < existingConversations.size(); i++) {
                    Conversation duplicate = existingConversations.get(i);
                    // Move messages from duplicate to main conversation if needed
                    List<ConversationMessage> duplicateMessages = messageRepository.findByConversationOrderBySentAtAsc(duplicate);
                    for (ConversationMessage msg : duplicateMessages) {
                        msg.setConversation(conversation);
                        messageRepository.save(msg);
                    }
                    // Delete the duplicate conversation
                    conversationRepository.delete(duplicate);
                }
            }
        } else {
            // Ensure consistent user ordering to prevent duplicates
            User user1, user2;
            if (currentUser.getId() < otherUser.getId()) {
                user1 = currentUser;
                user2 = otherUser;
            } else {
                user1 = otherUser;
                user2 = currentUser;
            }
            
            conversation = Conversation.builder()
                    .user1(user1)
                    .user2(user2)
                    .item(item)
                    .build();
            conversation = conversationRepository.save(conversation);
        }

        return convertToConversationDTO(conversation, currentUser);
    }

    public MessageDTO sendMessage(Long conversationId, Long senderId, String content) {
        Conversation conversation = conversationRepository.findById(conversationId)
                .orElseThrow(() -> new RuntimeException("Conversation not found"));
        User sender = userRepository.findById(senderId)
                .orElseThrow(() -> new RuntimeException("Sender not found"));

        ConversationMessage message = ConversationMessage.builder()
                .conversation(conversation)
                .sender(sender)
                .content(content)
                .build();

        message = messageRepository.save(message);
        conversationRepository.save(conversation); // This will update lastMessageAt

        return convertToMessageDTO(message, sender);
    }

    public List<MessageDTO> getConversationMessages(Long conversationId, Long currentUserId) {
        Conversation conversation = conversationRepository.findById(conversationId)
                .orElseThrow(() -> new RuntimeException("Conversation not found"));
        User currentUser = userRepository.findById(currentUserId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<ConversationMessage> messages = messageRepository
                .findByConversationOrderBySentAtAsc(conversation);

        return messages.stream()
                .map(message -> convertToMessageDTO(message, currentUser))
                .collect(Collectors.toList());
    }

    public List<ConversationDTO> getUserConversations(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<Conversation> conversations = conversationRepository
                .findByUserOrderByLastMessageAtDesc(user);

        return conversations.stream()
                .map(conversation -> convertToConversationDTO(conversation, user))
                .collect(Collectors.toList());
    }

    public void markMessagesAsRead(Long conversationId, Long userId) {
        Conversation conversation = conversationRepository.findById(conversationId)
                .orElseThrow(() -> new RuntimeException("Conversation not found"));
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<ConversationMessage> unreadMessages = messageRepository
                .findUnreadMessages(conversation, user);

        unreadMessages.forEach(message -> message.setRead(true));
        messageRepository.saveAll(unreadMessages);
    }

    private ConversationDTO convertToConversationDTO(Conversation conversation, User currentUser) {
        User otherUser = conversation.getUser1().equals(currentUser) 
                ? conversation.getUser2() 
                : conversation.getUser1();

        List<ConversationMessage> messages = messageRepository
                .findByConversationOrderBySentAtAsc(conversation);

        String lastMessage = messages.isEmpty() ? "" : messages.get(messages.size() - 1).getContent();
        long unreadCount = messageRepository.countUnreadMessages(conversation, currentUser);

        return ConversationDTO.builder()
                .id(conversation.getId())
                .otherUser(convertToUserDTO(otherUser))
                .item(convertToItemDTO(conversation.getItem()))
                .lastMessage(lastMessage)
                .lastMessageAt(conversation.getLastMessageAt())
                .unreadCount(unreadCount)
                .build();
    }

    private MessageDTO convertToMessageDTO(ConversationMessage message, User currentUser) {
        return MessageDTO.builder()
                .id(message.getId())
                .content(message.getContent())
                .sender(convertToUserDTO(message.getSender()))
                .sentAt(message.getSentAt())
                .isRead(message.isRead())
                .isCurrentUserSender(message.getSender().equals(currentUser))
                .build();
    }

    private UserDTO convertToUserDTO(User user) {
        return UserDTO.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .phoneNumber(user.getPhoneNumber())
                .build();
    }

    private ItemDTO convertToItemDTO(Item item) {
        return ItemDTO.builder()
                .id(item.getId())
                .name(item.getName())
                .description(item.getDescription())
                .category(item.getCategory())
                .status(item.getStatus())
                .dateReported(item.getDateReported())
                .location(item.getLocation())
                .imageUrl(item.getImageUrl())
                .photoUrls(item.getPhotoUrls())
                .contactPhone(item.getContactPhone())
                .contactEmail(item.getContactEmail())
                .user(convertToUserDTO(item.getUser()))
                .build();
    }
}