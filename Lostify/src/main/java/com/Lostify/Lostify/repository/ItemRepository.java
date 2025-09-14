package com.Lostify.Lostify.repository;

import com.Lostify.Lostify.domain.ItemCategory;
import com.Lostify.Lostify.domain.ItemStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import com.Lostify.Lostify.model.Item;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ItemRepository extends JpaRepository<Item, Long> {

    List<Item> findByCategory(ItemCategory category);

    List<Item> findByStatus(ItemStatus status);


    List<Item> findByCategoryAndStatus(ItemCategory category, ItemStatus status);
    
    List<Item> findByUniversityId(Long universityId);
    
    List<Item> findByUniversityIdAndCategory(Long universityId, ItemCategory category);
    
    List<Item> findByUniversityIdAndStatus(Long universityId, ItemStatus status);
    
    List<Item> findByUniversityIdAndCategoryAndStatus(Long universityId, ItemCategory category, ItemStatus status);
    
    @Query("SELECT i FROM Item i LEFT JOIN FETCH i.user LEFT JOIN FETCH i.university WHERE i.id = :id")
    Optional<Item> findByIdWithUser(@Param("id") Long id);
}
