package com.Lostify.Lostify.dto;

import lombok.Data;
import lombok.Builder;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ConversationDTO {
    private Long id;
    private UserDTO otherUser;
    private ItemDTO item;
    private String lastMessage;
    private LocalDateTime lastMessageAt;
    private long unreadCount;
    private boolean isCurrentUserSender;
}