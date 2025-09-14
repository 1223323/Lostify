import React, { useState } from 'react';
import styled from 'styled-components';
import { FaComments, FaUser, FaImage, FaTimes } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useMessaging } from '../../context/MessagingContext';
import { formatDistanceToNow } from 'date-fns';

const PreviewContainer = styled.div`
  position: fixed;
  bottom: 100px;
  right: 24px;
  width: 320px;
  max-height: 400px;
  background: ${props => props.theme.surface.default};
  border-radius: ${props => props.theme.radius.xl};
  box-shadow: ${props => props.theme.shadow.xl};
  border: 1px solid ${props => props.theme.border.light};
  z-index: ${props => props.theme.zIndex.dropdown};
  overflow: hidden;
  
  @media (max-width: 768px) {
    right: 20px;
    width: calc(100vw - 40px);
    max-width: 320px;
  }
`;

const PreviewHeader = styled.div`
  padding: 16px;
  background: ${props => props.theme.primary.main};
  color: white;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const HeaderTitle = styled.div`
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  
  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }
`;

const ConversationsList = styled.div`
  max-height: 300px;
  overflow-y: auto;
`;

const ConversationItem = styled.div`
  padding: 12px 16px;
  border-bottom: 1px solid ${props => props.theme.border.light};
  cursor: pointer;
  transition: background 0.2s ease;
  
  &:hover {
    background: ${props => props.theme.surface.hover};
  }
  
  &:last-child {
    border-bottom: none;
  }
`;

const ConversationHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
`;

const UserName = styled.div`
  font-weight: 600;
  color: ${props => props.theme.text.primary};
  font-size: 14px;
`;

const TimeStamp = styled.div`
  font-size: 12px;
  color: ${props => props.theme.text.secondary};
`;

const ItemInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
`;

const ItemName = styled.div`
  font-size: 12px;
  color: ${props => props.theme.text.secondary};
  font-weight: 500;
`;

const LastMessage = styled.div`
  font-size: 13px;
  color: ${props => props.theme.text.secondary};
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const EmptyState = styled.div`
  padding: 32px 16px;
  text-align: center;
  color: ${props => props.theme.text.secondary};
`;

const ViewAllButton = styled.button`
  width: 100%;
  padding: 12px;
  background: ${props => props.theme.surface.elevated};
  border: none;
  border-top: 1px solid ${props => props.theme.border.light};
  color: ${props => props.theme.primary.main};
  font-weight: 600;
  cursor: pointer;
  
  &:hover {
    background: ${props => props.theme.surface.hover};
  }
`;

const QuickChatPreview = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { conversations } = useMessaging();

  const handleConversationClick = (conversation) => {
    navigate('/messages', { 
      state: { 
        conversationId: conversation.id 
      } 
    });
    onClose();
  };

  const handleViewAll = () => {
    navigate('/messages');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <PreviewContainer>
      <PreviewHeader>
        <HeaderTitle>
          <FaComments size={16} />
          Recent Chats
        </HeaderTitle>
        <CloseButton onClick={onClose}>
          <FaTimes size={14} />
        </CloseButton>
      </PreviewHeader>
      
      <ConversationsList>
        {conversations.length === 0 ? (
          <EmptyState>
            <FaUser size={32} style={{ marginBottom: '8px', opacity: 0.3 }} />
            <div>No conversations yet</div>
          </EmptyState>
        ) : (
          conversations.slice(0, 4).map(conversation => (
            <ConversationItem
              key={conversation.id}
              onClick={() => handleConversationClick(conversation)}
            >
              <ConversationHeader>
                <UserName>{conversation.otherUser.username}</UserName>
                <TimeStamp>
                  {formatDistanceToNow(new Date(conversation.lastMessageAt), { addSuffix: true })}
                </TimeStamp>
              </ConversationHeader>
              
              <ItemInfo>
                <FaImage size={12} />
                <ItemName>{conversation.item.name}</ItemName>
              </ItemInfo>
              
              {conversation.lastMessage && (
                <LastMessage>{conversation.lastMessage}</LastMessage>
              )}
            </ConversationItem>
          ))
        )}
      </ConversationsList>
      
      {conversations.length > 0 && (
        <ViewAllButton onClick={handleViewAll}>
          View All Messages
        </ViewAllButton>
      )}
    </PreviewContainer>
  );
};

export default QuickChatPreview;