package com.Lostify.Lostify.repository;

import com.Lostify.Lostify.domain.ItemCategory;
import com.Lostify.Lostify.domain.ItemStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import com.Lostify.Lostify.model.Item;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ItemRepository extends JpaRepository<Item, Long> {

    List<Item> findByCategory(ItemCategory category);

    List<Item> findByStatus(ItemStatus status);


    List<Item> findByCategoryAndStatus(ItemCategory category, ItemStatus status);
}
