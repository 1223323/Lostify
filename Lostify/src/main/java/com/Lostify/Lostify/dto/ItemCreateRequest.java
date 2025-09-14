package com.Lostify.Lostify.dto;

import com.Lostify.Lostify.domain.ItemCategory;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ItemCreateRequest {
    private String name;
    private String description;
    private ItemCategory category;
    private String location;
    private LocalDate dateReported;
    private Long universityId;
    private String contactPhone;
    private String contactEmail;
}