package com.Lostify.Lostify.service;

import java.util.List;
import com.Lostify.Lostify.domain.ItemStatus;
import com.Lostify.Lostify.model.Item;


public interface ItemService {

    Item reportLostItem(Item item);

    Item reportFoundItem(Item item);

    List<Item> getAllItems();

    Item getItemById(Long id);

    Item updateItemStatus(Long id, ItemStatus status);

    void deleteItem(Long id);

    List<Item> getItemsByStatus(ItemStatus status);

    List<Item> getItemsByCategory(String category);

    List<Item> getItemsByLocation(String location);
}

