import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthContext } from './AuthContext';
import api from '../utils/api';

const MessagingContext = createContext();

export const useMessaging = () => {
  const context = useContext(MessagingContext);
  if (!context) {
    throw new Error('useMessaging must be used within a MessagingProvider');
  }
  return context;
};

export const MessagingProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [conversations, setConversations] = useState([]);
  const [currentConversation, setCurrentConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchConversations = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/messages/conversations');
      setConversations(response.data);
      
      // Calculate total unread count
      const totalUnread = response.data.reduce((sum, conv) => sum + conv.unreadCount, 0);
      setUnreadCount(totalUnread);
    } catch (error) {
      console.error('Error fetching conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  const startConversation = async (otherUserId, itemId) => {
    try {
      const response = await api.post('/api/messages/conversation', {
        otherUserId,
        itemId
      });
      setCurrentConversation(response.data);
      return response.data;
    } catch (error) {
      console.error('Error starting conversation:', error);
      throw error;
    }
  };

  const sendMessage = async (content, itemId, receiverId) => {
    try {
      const response = await api.post('/api/messages/send', {
        content,
        itemId,
        receiverId
      });
      
      // Add message to current messages
      setMessages(prev => [...prev, response.data]);
      
      // Refresh conversations to update last message
      fetchConversations();
      
      return response.data;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  };

  const fetchMessages = async (conversationId) => {
    try {
      setLoading(true);
      const response = await api.get(`/api/messages/conversation/${conversationId}/messages`);
      setMessages(response.data);
      
      // Mark messages as read
      await api.post(`/api/messages/conversation/${conversationId}/read`);
      
      // Update conversations to reflect read status
      fetchConversations();
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const selectConversation = (conversation) => {
    setCurrentConversation(conversation);
    fetchMessages(conversation.id);
  };

  useEffect(() => {
    if (user) {
      fetchConversations();
    }
  }, [user]);

  const value = {
    conversations,
    currentConversation,
    messages,
    loading,
    unreadCount,
    fetchConversations,
    startConversation,
    sendMessage,
    fetchMessages,
    selectConversation,
    setCurrentConversation
  };

  return (
    <MessagingContext.Provider value={value}>
      {children}
    </MessagingContext.Provider>
  );
};