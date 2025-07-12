package com.Lostify.Lostify.service;

import com.Lostify.Lostify.model.Item;
import com.Lostify.Lostify.domain.ItemCategory;
import com.Lostify.Lostify.domain.ItemStatus;
import com.Lostify.Lostify.repository.ItemRepository;
import com.Lostify.Lostify.service.ItemService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

/**
 * This class implements the business logic for handling lost & found items.
 */
@Service
@RequiredArgsConstructor  // Lombok: generates constructor for final fields
public class ItemServiceImpl implements ItemService {

    private final ItemRepository itemRepository;

    /**
     * Saves a new lost item with LOST status.
     */
    @Override
    public Item reportLostItem(Item item) {
        item.setStatus(ItemStatus.LOST);
        item.setDateReported(LocalDate.now());
        return itemRepository.save(item);
    }

    /**
     * Saves a new found item with FOUND status.
     */
    @Override
    public Item reportFoundItem(Item item) {
        item.setStatus(ItemStatus.FOUND);
        item.setDateReported(LocalDate.now());
        return itemRepository.save(item);
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
        return itemRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Item not found with ID: " + id));
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
}
