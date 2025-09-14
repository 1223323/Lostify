package com.Lostify.Lostify.dto;

import lombok.Data;
import lombok.Builder;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import com.Lostify.Lostify.domain.ItemStatus;
import com.Lostify.Lostify.domain.ItemCategory;
import java.time.LocalDate;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ItemDTO {
    private Long id;
    private String name;
    private String description;
    private ItemCategory category;
    private ItemStatus status;
    private LocalDate dateReported;
    private String location;
    private String imageUrl;
    private List<String> photoUrls;
    private String contactPhone;
    private String contactEmail;
    private UserDTO user;
}