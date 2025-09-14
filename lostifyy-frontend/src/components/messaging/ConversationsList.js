import React from 'react';
import styled from 'styled-components';
import { FaUser, FaImage, FaClock } from 'react-icons/fa';
import { useMessaging } from '../../context/MessagingContext';
import { formatDistanceToNow } from 'date-fns';
import UserProfile from '../UserProfile';

const ConversationsContainer = styled.div`
  height: 100%;
  overflow-y: auto;
  border-right: 1px solid ${props => props.theme.border.default};
`;

const ConversationItem = styled.div`
  padding: 16px;
  border-bottom: 1px solid ${props => props.theme.border.default};
  cursor: pointer;
  transition: all 0.2s ease;
  background: ${props => props.isActive ? props.theme.primary.main + '10' : 'transparent'};

  &:hover {
    background: ${props => props.theme.surface.hover};
  }
`;

const ConversationHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
`;

const UserProfileSection = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
`;

const UserAvatar = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: linear-gradient(135deg, ${props => props.theme.primary.main}, ${props => props.theme.accent.main});
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  font-size: 18px;
  flex-shrink: 0;
  box-shadow: 0 2px 8px rgba(99, 102, 241, 0.3);
`;

const UserDetails = styled.div`
  flex: 1;
  min-width: 0;
`;

const UserName = styled.div`
  font-weight: 600;
  color: ${props => props.theme.text.primary};
  font-size: 16px;
  margin-bottom: 2px;
`;

const UserStatus = styled.div`
  font-size: 12px;
  color: ${props => props.theme.text.secondary};
  font-weight: 500;
`;

const ConversationMeta = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4px;
`;

const TimeStamp = styled.div`
  font-size: 12px;
  color: ${props => props.theme.text.secondary};
  display: flex;
  align-items: center;
  gap: 4px;
`;

const ItemInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
  padding: 8px;
  background: ${props => props.theme.surface.elevated};
  border-radius: 8px;
`;

const ItemImage = styled.img`
  width: 32px;
  height: 32px;
  border-radius: 4px;
  object-fit: cover;
`;

const ItemName = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: ${props => props.theme.text.primary};
`;

const LastMessage = styled.div`
  font-size: 14px;
  color: ${props => props.theme.text.secondary};
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const UnreadBadge = styled.div`
  background: ${props => props.theme.primary.main};
  color: white;
  border-radius: 12px;
  padding: 2px 8px;
  font-size: 12px;
  font-weight: bold;
  min-width: 20px;
  text-align: center;
`;

const EmptyState = styled.div`
  padding: 32px;
  text-align: center;
  color: ${props => props.theme.text.secondary};
`;

const ConversationsList = () => {
  const { conversations, currentConversation, selectConversation, loading } = useMessaging();

  if (loading && conversations.length === 0) {
    return (
      <ConversationsContainer>
        <EmptyState>Loading conversations...</EmptyState>
      </ConversationsContainer>
    );
  }

  if (conversations.length === 0) {
    return (
      <ConversationsContainer>
        <EmptyState>
          <FaUser size={48} style={{ marginBottom: '16px', opacity: 0.3 }} />
          <div>No conversations yet</div>
          <div style={{ fontSize: '14px', marginTop: '8px' }}>
            Start messaging about items you're interested in
          </div>
        </EmptyState>
      </ConversationsContainer>
    );
  }

  return (
    <ConversationsContainer>
      {conversations.map(conversation => (
        <ConversationItem
          key={conversation.id}
          isActive={currentConversation?.id === conversation.id}
          onClick={() => selectConversation(conversation)}
        >
          <ConversationHeader>
            <UserProfileSection>
              <UserAvatar>
                {conversation.otherUser.username.charAt(0).toUpperCase()}
              </UserAvatar>
              <UserDetails>
                <UserName>{conversation.otherUser.username}</UserName>
                <UserStatus>
                  {conversation.item.status === 'LOST' ? 'Looking for item' : 'Found an item'}
                </UserStatus>
              </UserDetails>
            </UserProfileSection>
            <ConversationMeta>
              {conversation.unreadCount > 0 && (
                <UnreadBadge>{conversation.unreadCount}</UnreadBadge>
              )}
              <TimeStamp>
                <FaClock size={12} />
                {formatDistanceToNow(new Date(conversation.lastMessageAt), { addSuffix: true })}
              </TimeStamp>
            </ConversationMeta>
          </ConversationHeader>
          
          <ItemInfo>
            {conversation.item.photoUrls && conversation.item.photoUrls.length > 0 ? (
              <ItemImage src={conversation.item.photoUrls[0]} alt={conversation.item.name} />
            ) : (
              <div style={{ width: '32px', height: '32px', background: '#f0f0f0', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <FaImage size={16} color="#999" />
              </div>
            )}
            <ItemName>{conversation.item.name}</ItemName>
          </ItemInfo>
          
          {conversation.lastMessage && (
            <LastMessage>{conversation.lastMessage}</LastMessage>
          )}
        </ConversationItem>
      ))}
    </ConversationsContainer>
  );
};

export default ConversationsList;