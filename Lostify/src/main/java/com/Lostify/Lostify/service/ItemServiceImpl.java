package com.Lostify.Lostify.service;

import com.Lostify.Lostify.model.Item;
import com.Lostify.Lostify.model.User;
import com.Lostify.Lostify.model.University;
import com.Lostify.Lostify.domain.ItemCategory;
import com.Lostify.Lostify.domain.ItemStatus;
import com.Lostify.Lostify.repository.ItemRepository;
import com.Lostify.Lostify.repository.UserRepository;
import com.Lostify.Lostify.repository.UniversityRepository;
import com.Lostify.Lostify.service.ItemService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.time.LocalDate;
import java.util.List;
import org.apache.commons.text.similarity.JaroWinklerSimilarity;
import java.util.stream.Collectors;

/**
 * This class implements the business logic for handling lost & found items.
 */
@Service
@RequiredArgsConstructor  // Lombok: generates constructor for final fields
public class ItemServiceImpl implements ItemService {

    private static final Logger logger = LoggerFactory.getLogger(ItemServiceImpl.class);
    
    private final ItemRepository itemRepository;
    private final UserRepository userRepository;
    private final UniversityRepository universityRepository;

    /**
     * Saves a new lost item with LOST status.
     */
    @Override
    public Item reportLostItem(Item item, Long universityId) {
        logger.info("Reporting lost item: {} for universityId: {}", item.getName(), universityId);
        
        item.setStatus(ItemStatus.LOST);
        item.setDateReported(LocalDate.now());
        
        // Set the current user
        User currentUser = getCurrentUser();
        logger.info("Current user: {}", currentUser.getUsername());
        item.setUser(currentUser);
        
        // Set the university
        if (universityId != null) {
            University university = universityRepository.findById(universityId)
                    .orElseThrow(() -> new EntityNotFoundException("University not found with ID: " + universityId));
            logger.info("Found university: {}", university.getName());
            item.setUniversity(university);
        } else {
            logger.error("University ID is null");
            throw new IllegalArgumentException("University ID is required");
        }
        
        // Set contact info from user if not provided
        if (item.getContactEmail() == null || item.getContactEmail().isEmpty()) {
            item.setContactEmail(currentUser.getEmail());
        }
        
        logger.info("Saving item to database...");
        Item savedItem = itemRepository.save(item);
        logger.info("Successfully saved item with ID: {}", savedItem.getId());
        return savedItem;
    }

    /**
     * Saves a new found item with FOUND status.
     */
    @Override
    public Item reportFoundItem(Item item, Long universityId) {
        logger.info("Reporting found item: {} for universityId: {}", item.getName(), universityId);
        
        item.setStatus(ItemStatus.FOUND);
        item.setDateReported(LocalDate.now());
        
        // Set the current user
        User currentUser = getCurrentUser();
        logger.info("Current user: {}", currentUser.getUsername());
        item.setUser(currentUser);
        
        // Set the university
        if (universityId != null) {
            University university = universityRepository.findById(universityId)
                    .orElseThrow(() -> new EntityNotFoundException("University not found with ID: " + universityId));
            logger.info("Found university: {}", university.getName());
            item.setUniversity(university);
        } else {
            logger.error("University ID is null");
            throw new IllegalArgumentException("University ID is required");
        }
        
        // Set contact info from user if not provided
        if (item.getContactEmail() == null || item.getContactEmail().isEmpty()) {
            item.setContactEmail(currentUser.getEmail());
        }
        
        logger.info("Saving item to database...");
        Item savedItem = itemRepository.save(item);
        logger.info("Successfully saved item with ID: {}", savedItem.getId());
        return savedItem;
    }

    /**
     * Get the currently authenticated user.
     */
    private User getCurrentUser() {
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext()
                .getAuthentication().getPrincipal();
        return userRepository.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new EntityNotFoundException("Current user not found"));
    }

    /**
     * Returns all items from the DB.
     */
    @Override
    public List<Item> getAllItems() {
        return itemRepository.findAll();
    }

    /**
     * Retrieves a specific item by ID.
     */
    @Override
    public Item getItemById(Long id) {
        Item item = itemRepository.findByIdWithUser(id)
                .orElseThrow(() -> new EntityNotFoundException("Item not found with ID: " + id));
        
        return item;
    }

    /**
     * Updates the status of an existing item.
     */
    @Override
    public Item updateItemStatus(Long id, ItemStatus newStatus) {
        Item item = getItemById(id);
        item.setStatus(newStatus);
        return itemRepository.save(item);
    }

    /**
     * Deletes the item by ID.
     */
    @Override
    public void deleteItem(Long id) {
        Item item = getItemById(id);
        User currentUser = getCurrentUser();
        
        // Check if the current user owns this item
        if (!item.getUser().getId().equals(currentUser.getId())) {
            throw new SecurityException("You can only delete your own items");
        }
        
        // Delete associated photos
        if (item.getPhotoUrls() != null) {
            item.getPhotoUrls().forEach(photoUrl -> {
                // Delete photo files (implement this in FileUploadService if needed)
            });
        }
        
        itemRepository.deleteById(id);
    }

    /**
     * Get all items by status (LOST or FOUND).
     */
    @Override
    public List<Item> getItemsByStatus(ItemStatus status) {
        return itemRepository.findByStatus(status);
    }

    /**
     * Get all items by category.
     */
    @Override
    public List<Item> getItemsByCategory(String category) {
        ItemCategory catEnum = ItemCategory.valueOf(category.toUpperCase());
        return itemRepository.findByCategory(catEnum);
    }
    
    /**
     * Get all items by category and status.
     */
    @Override
    public List<Item> getItemsByCategoryAndStatus(String category, ItemStatus status) {
        try {
            ItemCategory itemCategory = ItemCategory.valueOf(category.toUpperCase());
            return itemRepository.findByCategoryAndStatus(itemCategory, status);
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid category: " + category);
        }
    }

    /**
     * Get all items from a particular location.
     */
    @Override
    public List<Item> getItemsByLocation(String location) {
        // You can define this method in ItemRepository as:
        // List<Item> findByLocationIgnoreCase(String location);
        return itemRepository.findAll().stream()
                .filter(item -> item.getLocation().equalsIgnoreCase(location))
                .toList();
    }

    @Override
    public List<Item> getFoundItemSuggestions(String description) {
        JaroWinklerSimilarity similarity = new JaroWinklerSimilarity();
        List<Item> foundItems = itemRepository.findByStatus(ItemStatus.FOUND);
        return foundItems.stream()
                .filter(item -> similarity.apply(description.toLowerCase(), item.getDescription().toLowerCase()) >= 0.5)
                .collect(Collectors.toList());
    }

    @Override
    public List<Item> getLostItemSuggestions(String description) {
        // Implementation for lost item suggestions
        return null;
    }
    
    @Override
    public List<Item> getItemsByUniversityId(Long universityId) {
        return itemRepository.findByUniversityId(universityId);
    }
    
    @Override
    public List<Item> getItemsByUniversityIdAndCategory(Long universityId, String category) {
        try {
            ItemCategory itemCategory = ItemCategory.valueOf(category.toUpperCase());
            return itemRepository.findByUniversityIdAndCategory(universityId, itemCategory);
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid category: " + category);
        }
    }
    
    @Override
    public List<Item> getItemsByUniversityIdAndStatus(Long universityId, ItemStatus status) {
        return itemRepository.findByUniversityIdAndStatus(universityId, status);
    }
    
    @Override
    public List<Item> getItemsByUniversityIdAndCategoryAndStatus(Long universityId, String category, ItemStatus status) {
        try {
            ItemCategory itemCategory = ItemCategory.valueOf(category.toUpperCase());
            return itemRepository.findByUniversityIdAndCategoryAndStatus(universityId, itemCategory, status);
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid category: " + category);
        }
    }
}
