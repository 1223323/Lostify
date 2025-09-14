package com.Lostify.Lostify.repository;

import com.Lostify.Lostify.model.ConversationMessage;
import com.Lostify.Lostify.model.Conversation;
import com.Lostify.Lostify.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ConversationMessageRepository extends JpaRepository<ConversationMessage, Long> {

    List<ConversationMessage> findByConversationOrderBySentAtAsc(Conversation conversation);

    @Query("SELECT COUNT(m) FROM ConversationMessage m WHERE m.conversation = :conversation AND m.sender != :user AND m.isRead = false")
    long countUnreadMessages(@Param("conversation") Conversation conversation, @Param("user") User user);

    @Query("SELECT m FROM ConversationMessage m WHERE m.conversation = :conversation AND m.sender != :user AND m.isRead = false")
    List<ConversationMessage> findUnreadMessages(@Param("conversation") Conversation conversation, @Param("user") User user);
}