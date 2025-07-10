package com.Lostify.Lostify.controller;


import com.Lostify.Lostify.domain.ItemStatus;
import com.Lostify.Lostify.model.Item;
import com.Lostify.Lostify.service.ItemService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/items")  // All endpoints will start with /api/items
@RequiredArgsConstructor  // Injects ItemService via constructor
public class ItemController {

    private final ItemService itemService;


    @PostMapping("/lost")
    public ResponseEntity<Item> reportLostItem(@RequestBody Item item) {
        Item savedItem = itemService.reportLostItem(item);
        return ResponseEntity.ok(savedItem);
    }


    @PostMapping("/found")
    public ResponseEntity<Item> reportFoundItem(@RequestBody Item item) {
        Item savedItem = itemService.reportFoundItem(item);
        return ResponseEntity.ok(savedItem);
    }


    @GetMapping
    public ResponseEntity<List<Item>> getAllItems() {
        return ResponseEntity.ok(itemService.getAllItems());
    }


    @GetMapping("/{id}")
    public ResponseEntity<Item> getItemById(@PathVariable Long id) {
        return ResponseEntity.ok(itemService.getItemById(id));
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
