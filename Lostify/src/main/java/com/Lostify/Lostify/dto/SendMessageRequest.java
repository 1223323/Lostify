package com.Lostify.Lostify.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SendMessageRequest {
    private String content;
    private Long itemId;
    private Long receiverId;
}