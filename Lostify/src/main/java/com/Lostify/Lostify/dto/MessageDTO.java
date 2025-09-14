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
public class MessageDTO {
    private Long id;
    private String content;
    private UserDTO sender;
    private LocalDateTime sentAt;
    private boolean isRead;
    private boolean isCurrentUserSender;
}