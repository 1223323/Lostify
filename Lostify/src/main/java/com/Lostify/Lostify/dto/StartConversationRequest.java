package com.Lostify.Lostify.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class StartConversationRequest {
    private Long otherUserId;
    private Long itemId;
}