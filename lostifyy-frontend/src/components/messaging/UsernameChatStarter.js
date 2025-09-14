import React, { useState } from 'react';
import styled from 'styled-components';
import { FaSearch, FaComments, FaUser, FaTimes } from 'react-icons/fa';
import { useMessaging } from '../../context/MessagingContext';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';

const ChatStarterContainer = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: white;
  border-radius: 16px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
  width: 400px;
  max-width: 90vw;
  z-index: 1000;
  overflow: hidden;
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;
`;

const Header = styled.div`
  padding: 20px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Title = styled.h3`
  margin: 0;
  font-size: 18px;
  font-weight: 600;
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

const Content = styled.div`
  padding: 24px;
`;

const SearchContainer = styled.div`
  position: relative;
  margin-bottom: 20px;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 12px 16px 12px 44px;
  border: 2px solid #e1e8ed;
  border-radius: 12px;
  font-size: 16px;
  outline: none;
  transition: border-color 0.2s ease;
  
  &:focus {
    border-color: #667eea;
  }
  
  &::placeholder {
    color: #8e8e8e;
  }
`;

const SearchIcon = styled(FaSearch)`
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: #8e8e8e;
  font-size: 16px;
`;

const UserList = styled.div`
  max-height: 200px;
  overflow-y: auto;
  border: 1px solid #e1e8ed;
  border-radius: 12px;
  margin-bottom: 20px;
`;

const UserItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  cursor: pointer;
  transition: background 0.2s ease;
  border-bottom: 1px solid #f5f5f5;
  
  &:hover {
    background: #f8f9fa;
  }
  
  &:last-child {
    border-bottom: none;
  }
`;

const UserAvatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea, #764ba2);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  font-size: 16px;
`;

const UserInfo = styled.div`
  flex: 1;
`;

const Username = styled.div`
  font-weight: 600;
  color: #1a1a1a;
  font-size: 14px;
`;

const UserEmail = styled.div`
  font-size: 12px;
  color: #8e8e8e;
`;

const StartChatButton = styled.button`
  width: 100%;
  padding: 12px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: transform 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
  }
  
  &:disabled {
    background: #ccc;
    cursor: not-allowed;
    transform: none;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 40px 20px;
  color: #8e8e8e;
`;

const UsernameChatStarter = ({ isOpen, onClose }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const { startConversation } = useMessaging();
  const navigate = useNavigate();

  const searchUsers = async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      setIsSearching(true);
      // Mock API call - replace with actual user search endpoint
      const response = await api.get(`/api/users/search?q=${encodeURIComponent(query)}`);
      setSearchResults(response.data || []);
    } catch (error) {
      console.error('Error searching users:', error);
      // Mock data for demonstration
      setSearchResults([
        {
          id: 1,
          username: 'john_doe',
          email: 'john@example.com'
        },
        {
          id: 2,
          username: 'jane_smith',
          email: 'jane@example.com'
        }
      ].filter(user => 
        user.username.toLowerCase().includes(query.toLowerCase())
      ));
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    // Debounce search
    const timeoutId = setTimeout(() => {
      searchUsers(query);
    }, 300);

    return () => clearTimeout(timeoutId);
  };

  const handleUserSelect = (user) => {
    setSelectedUser(user);
  };

  const handleStartChat = async () => {
    if (!selectedUser) return;

    try {
      // Start conversation without item context (general chat)
      const conversation = await startConversation(selectedUser.id, null);
      
      // Navigate to messages with the new conversation
      navigate('/messages', {
        state: {
          conversationId: conversation.id,
          otherUserId: selectedUser.id,
          otherUsername: selectedUser.username
        }
      });
      
      onClose();
    } catch (error) {
      console.error('Error starting chat:', error);
      // For demo, just navigate to messages page
      navigate('/messages', {
        state: {
          otherUserId: selectedUser.id,
          otherUsername: selectedUser.username
        }
      });
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <Overlay onClick={onClose} />
      <ChatStarterContainer>
        <Header>
          <Title>Start a Chat</Title>
          <CloseButton onClick={onClose}>
            <FaTimes size={16} />
          </CloseButton>
        </Header>
        
        <Content>
          <SearchContainer>
            <SearchIcon />
            <SearchInput
              type="text"
              placeholder="Search by username..."
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </SearchContainer>
          
          {searchQuery && (
            <UserList>
              {isSearching ? (
                <div style={{ padding: '20px', textAlign: 'center', color: '#8e8e8e' }}>
                  Searching...
                </div>
              ) : searchResults.length > 0 ? (
                searchResults.map(user => (
                  <UserItem
                    key={user.id}
                    onClick={() => handleUserSelect(user)}
                    style={{
                      background: selectedUser?.id === user.id ? '#f0f4ff' : 'transparent'
                    }}
                  >
                    <UserAvatar>
                      {user.username.charAt(0).toUpperCase()}
                    </UserAvatar>
                    <UserInfo>
                      <Username>@{user.username}</Username>
                      <UserEmail>{user.email}</UserEmail>
                    </UserInfo>
                  </UserItem>
                ))
              ) : (
                <EmptyState>
                  <FaUser size={32} style={{ marginBottom: '12px', opacity: 0.3 }} />
                  <div>No users found</div>
                  <div style={{ fontSize: '12px', marginTop: '4px' }}>
                    Try searching for a different username
                  </div>
                </EmptyState>
              )}
            </UserList>
          )}
          
          <StartChatButton
            onClick={handleStartChat}
            disabled={!selectedUser}
          >
            <FaComments size={16} />
            {selectedUser ? `Chat with @${selectedUser.username}` : 'Select a user to chat'}
          </StartChatButton>
        </Content>
      </ChatStarterContainer>
    </>
  );
};

export default UsernameChatStarter;