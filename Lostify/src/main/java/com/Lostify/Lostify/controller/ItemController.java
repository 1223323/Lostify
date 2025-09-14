package com.Lostify.Lostify.controller;


import com.Lostify.Lostify.domain.ItemStatus;
import com.Lostify.Lostify.model.Item;
import com.Lostify.Lostify.service.ItemService;
import com.Lostify.Lostify.service.FileUploadService;
import com.Lostify.Lostify.dto.ItemCreateRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import jakarta.persistence.EntityNotFoundException;

import java.util.List;
import java.io.IOException;

@RestController
@RequestMapping("/api/items")  // All endpoints will start with /api/items
@RequiredArgsConstructor  // Injects ItemService via constructor
public class ItemController {

    private static final Logger logger = LoggerFactory.getLogger(ItemController.class);
    
    private final ItemService itemService;
    private final FileUploadService fileUploadService;
    private final ObjectMapper objectMapper;


    @PostMapping("/lost")
    public ResponseEntity<Item> reportLostItem(
            @RequestParam("item") String itemJson,
            @RequestParam(value = "photos", required = false) List<MultipartFile> photos) throws IOException {
        
        logger.info("Received lost item report request. Item JSON: {}", itemJson);
        
        try {
            // Parse the JSON to ItemCreateRequest DTO
            ItemCreateRequest itemRequest = objectMapper.readValue(itemJson, ItemCreateRequest.class);
            
            // Create Item entity from DTO
            Item item = new Item();
            item.setName(itemRequest.getName());
            item.setDescription(itemRequest.getDescription());
            item.setCategory(itemRequest.getCategory());
            item.setLocation(itemRequest.getLocation());
            item.setContactPhone(itemRequest.getContactPhone());
            item.setContactEmail(itemRequest.getContactEmail());
            
            logger.info("Created item object: {}", item);
            
            // Upload photos if provided
            if (photos != null && !photos.isEmpty()) {
                logger.info("Uploading {} photos", photos.size());
                List<String> photoUrls = fileUploadService.uploadMultipleFiles(photos);
                item.setPhotoUrls(photoUrls);
            }
            
            Item savedItem = itemService.reportLostItem(item, itemRequest.getUniversityId());
            logger.info("Successfully saved lost item with ID: {}", savedItem.getId());
            return ResponseEntity.ok(savedItem);
            
        } catch (EntityNotFoundException e) {
            logger.error("Entity not found: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        } catch (IllegalArgumentException e) {
            logger.error("Invalid argument: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            logger.error("Unexpected error while saving lost item", e);
            return ResponseEntity.internalServerError().build();
        }
    }

    @PostMapping("/found")
    public ResponseEntity<Item> reportFoundItem(
            @RequestParam("item") String itemJson,
            @RequestParam(value = "photos", required = false) List<MultipartFile> photos) throws IOException {
        
        logger.info("Received found item report request. Item JSON: {}", itemJson);
        
        try {
            // Parse the JSON to ItemCreateRequest DTO
            ItemCreateRequest itemRequest = objectMapper.readValue(itemJson, ItemCreateRequest.class);
            
            // Create Item entity from DTO
            Item item = new Item();
            item.setName(itemRequest.getName());
            item.setDescription(itemRequest.getDescription());
            item.setCategory(itemRequest.getCategory());
            item.setLocation(itemRequest.getLocation());
            item.setContactPhone(itemRequest.getContactPhone());
            item.setContactEmail(itemRequest.getContactEmail());
            
            // Upload photos if provided
            if (photos != null && !photos.isEmpty()) {
                List<String> photoUrls = fileUploadService.uploadMultipleFiles(photos);
                item.setPhotoUrls(photoUrls);
            }
            
            Item savedItem = itemService.reportFoundItem(item, itemRequest.getUniversityId());
            logger.info("Successfully saved found item with ID: {}", savedItem.getId());
            return ResponseEntity.ok(savedItem);
            
        } catch (EntityNotFoundException e) {
            logger.error("Entity not found: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        } catch (IllegalArgumentException e) {
            logger.error("Invalid argument: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            logger.error("Unexpected error while saving found item", e);
            return ResponseEntity.internalServerError().build();
        }
    }


    @GetMapping
    public ResponseEntity<List<Item>> getAllItems(
            @RequestParam(required = false) Long universityId,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) ItemStatus status) {
        
        if (universityId != null) {
            if (category != null && status != null) {
                return ResponseEntity.ok(itemService.getItemsByUniversityIdAndCategoryAndStatus(universityId, category, status));
            } else if (category != null) {
                return ResponseEntity.ok(itemService.getItemsByUniversityIdAndCategory(universityId, category));
            } else if (status != null) {
                return ResponseEntity.ok(itemService.getItemsByUniversityIdAndStatus(universityId, status));
            } else {
                return ResponseEntity.ok(itemService.getItemsByUniversityId(universityId));
            }
        } else if (category != null || status != null) {
            // For backward compatibility, handle non-university specific filters
            if (category != null && status != null) {
                return ResponseEntity.ok(itemService.getItemsByCategoryAndStatus(category, status));
            } else if (category != null) {
                return ResponseEntity.ok(itemService.getItemsByCategory(category));
            } else {
                return ResponseEntity.ok(itemService.getItemsByStatus(status));
            }
        }
        return ResponseEntity.ok(itemService.getAllItems());
    }


    @GetMapping("/{id}")
    public ResponseEntity<Item> getItemById(@PathVariable Long id) {
        return ResponseEntity.ok(itemService.getItemById(id));
    }


    @GetMapping("/found/suggestions")
    public ResponseEntity<List<Item>> getFoundItemSuggestions(@RequestParam String description) {
        return ResponseEntity.ok(itemService.getFoundItemSuggestions(description));
    }


    @GetMapping("/lost/suggestions")
    public ResponseEntity<List<Item>> getLostItemSuggestions(@RequestParam String description) {
        return ResponseEntity.ok(itemService.getLostItemSuggestions(description));
    }


    @PutMapping("/{id}/status")
    public ResponseEntity<Item> updateItemStatus(
            @PathVariable Long id,
            @RequestParam("status") String status
    ) {
        ItemStatus newStatus = ItemStatus.valueOf(status.toUpperCase());
        Item updatedItem = itemService.updateItemStatus(id, newStatus);
        return ResponseEntity.ok(updatedItem);
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteItem(@PathVariable Long id) {
        itemService.deleteItem(id);
        return ResponseEntity.noContent().build();  // HTTP 204
    }
}
