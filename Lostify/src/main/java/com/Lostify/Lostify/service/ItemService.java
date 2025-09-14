package com.Lostify.Lostify.service;

import java.util.List;
import com.Lostify.Lostify.domain.ItemStatus;
import com.Lostify.Lostify.model.Item;


public interface ItemService {

    Item reportLostItem(Item item, Long universityId);

    Item reportFoundItem(Item item, Long universityId);

    List<Item> getAllItems();

    Item getItemById(Long id);

    Item updateItemStatus(Long id, ItemStatus status);

    void deleteItem(Long id);

    List<Item> getItemsByStatus(ItemStatus status);

    List<Item> getItemsByCategory(String category);
    
    List<Item> getItemsByCategoryAndStatus(String category, ItemStatus status);

    List<Item> getItemsByLocation(String location);

    List<Item> getFoundItemSuggestions(String description);

    List<Item> getLostItemSuggestions(String description);
    
    // University-based methods
    List<Item> getItemsByUniversityId(Long universityId);
    
    List<Item> getItemsByUniversityIdAndCategory(Long universityId, String category);
    
    List<Item> getItemsByUniversityIdAndStatus(Long universityId, ItemStatus status);
    
    List<Item> getItemsByUniversityIdAndCategoryAndStatus(Long universityId, String category, ItemStatus status);
}

