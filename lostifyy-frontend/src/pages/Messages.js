import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { useMessaging } from '../context/MessagingContext';
import ConversationsList from '../components/messaging/ConversationsList';
import ChatWindow from '../components/messaging/ChatWindow';
import InstagramChat from '../components/messaging/InstagramChat';
import UsernameChatStarter from '../components/messaging/UsernameChatStarter';
import { FaUser, FaComments } from 'react-icons/fa';

const MessagesContainer = styled.div`
  height: calc(100vh - 80px);
  display: flex;
  background: ${props => props.theme.background.default};
`;

const Sidebar = styled.div`
  width: 350px;
  min-width: 350px;
  background: ${props => props.theme.background.default};
  border-right: 1px solid ${props => props.theme.border.default};

  @media (max-width: 768px) {
    width: 100%;
    min-width: 100%;
    ${props => props.showChat && 'display: none;'}
  }
`;

const ChatArea = styled.div`
  flex: 1;
  background: ${props => props.theme.background.default};

  @media (max-width: 768px) {
    ${props => !props.showChat && 'display: none;'}
  }
`;

const Header = styled.div`
  padding: 20px;
  border-bottom: 1px solid ${props => props.theme.border.default};
  background: ${props => props.theme.surface.elevated};
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Title = styled.h1`
  margin: 0;
  color: ${props => props.theme.text.primary};
  font-size: 24px;
  font-weight: 700;
`;

const Subtitle = styled.p`
  margin: 8px 0 0 0;
  color: ${props => props.theme.text.secondary};
  font-size: 14px;
`;

const HeaderActions = styled.div`
  display: flex;
  gap: 12px;
`;

const HeaderButton = styled.button`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: none;
  background: ${props => props.theme.primary.main};
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${props => props.theme.primary.dark};
    transform: scale(1.1);
  }
`;

const Messages = () => {
  const location = useLocation();
  const [showUserSearch, setShowUserSearch] = useState(false);
  const [chatMode, setChatMode] = useState('default'); // 'default' or 'instagram'
  const { 
    currentConversation, 
    conversations, 
    messages,
    selectConversation, 
    startConversation,
    sendMessage
  } = useMessaging();

  // Handle navigation from item detail page
  useEffect(() => {
    const state = location.state;
    if (state?.conversationId) {
      // Find and select the conversation
      const conversation = conversations.find(c => c.id === state.conversationId);
      if (conversation) {
        selectConversation(conversation);
      }
    } else if (state?.itemId && state?.otherUserId) {
      // Start a new conversation
      startConversation(state.otherUserId, state.itemId);
    }
  }, [location.state, conversations, selectConversation, startConversation]);

  return (
    <MessagesContainer>
      <Sidebar showChat={!!currentConversation}>
        <Header>
          <div>
            <Title>Messages</Title>
            <Subtitle>Connect with other users about lost and found items</Subtitle>
          </div>
          <HeaderActions>
            <HeaderButton 
              onClick={() => setShowUserSearch(true)}
              title="Start new chat"
            >
              <FaComments />
            </HeaderButton>
            <HeaderButton 
              onClick={() => setChatMode(chatMode === 'default' ? 'instagram' : 'default')}
              title={`Switch to ${chatMode === 'default' ? 'Instagram' : 'Default'} mode`}
            >
              <FaUser />
            </HeaderButton>
          </HeaderActions>
        </Header>
        <ConversationsList />
      </Sidebar>
      
      <ChatArea showChat={!!currentConversation}>
        {chatMode === 'instagram' && currentConversation ? (
          <InstagramChat
            otherUser={currentConversation.otherUser}
            messages={messages}
            onSendMessage={(content) => sendMessage(content, currentConversation.item?.id, currentConversation.otherUser.id)}
            currentUser={{ username: 'current_user' }} // Replace with actual current user
          />
        ) : (
          <ChatWindow />
        )}
      </ChatArea>
      
      {/* Username Chat Starter Modal */}
      <UsernameChatStarter 
        isOpen={showUserSearch}
        onClose={() => setShowUserSearch(false)}
      />
    </MessagesContainer>
  );
};

export default Messages;