package com.Lostify.Lostify.repository;

import com.Lostify.Lostify.model.Conversation;
import com.Lostify.Lostify.model.User;
import com.Lostify.Lostify.model.Item;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ConversationRepository extends JpaRepository<Conversation, Long> {

    @Query("SELECT c FROM Conversation c WHERE (c.user1 = :user1 AND c.user2 = :user2 AND c.item = :item) OR (c.user1 = :user2 AND c.user2 = :user1 AND c.item = :item) ORDER BY c.createdAt ASC")
    List<Conversation> findByUsersAndItem(@Param("user1") User user1, @Param("user2") User user2, @Param("item") Item item);

    @Query("SELECT c FROM Conversation c WHERE (c.user1 = :user OR c.user2 = :user) ORDER BY c.lastMessageAt DESC")
    List<Conversation> findByUserOrderByLastMessageAtDesc(@Param("user") User user);

    @Query("SELECT c FROM Conversation c WHERE c.item = :item ORDER BY c.lastMessageAt DESC")
    List<Conversation> findByItemOrderByLastMessageAtDesc(@Param("item") Item item);
}