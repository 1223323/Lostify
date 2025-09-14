import React, { useState, useRef, useEffect } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { FaPaperPlane, FaUser, FaComments } from 'react-icons/fa';
import { useMessaging } from '../../context/MessagingContext';
import { formatDistanceToNow } from 'date-fns';


// --- Animations ---
const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const slideIn = keyframes`
  from {
    transform: translateY(10px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
`;

// --- Styled Components ---
const ChatContainer = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  background: ${props => props.theme.background.default};
  animation: ${fadeIn} 0.5s ease-in-out;
`;

const ChatHeader = styled.div`
  padding: 12px 20px;
  border-bottom: 1px solid ${props => props.theme.border.default};
  background: ${props => props.theme.surface.elevated};
  z-index: 10;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const Avatar = styled.div`
  width: 42px;
  height: 42px;
  border-radius: 50%;
  background: linear-gradient(135deg, ${props => props.theme.primary.light} 0%, ${props => props.theme.primary.main} 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 18px;
  flex-shrink: 0;
`;

const UserDetails = styled.div`
  flex: 1;
`;

const UserName = styled.div`
  font-weight: 600;
  color: ${props => props.theme.text.primary};
`;

const ItemName = styled.div`
  font-size: 13px;
  color: ${props => props.theme.text.secondary};
`;

const MessagesContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 8px; // Reduced gap between individual messages in a group
`;

const MessageGroup = styled.div`
  display: flex;
  flex-direction: column;
  align-items: ${props => props.isOwn ? 'flex-end' : 'flex-start'};
  gap: 4px;
  animation: ${slideIn} 0.3s ease-out;
  animation-fill-mode: forwards;
`;

const Message = styled.div`
  max-width: 75%;
  padding: 12px 18px;
  word-wrap: break-word;
  position: relative;
  color: ${props => props.isOwn ? 'white' : props.theme.text.primary};
  background: ${props => props.isOwn 
    ? `linear-gradient(135deg, ${props.theme.primary.light} 0%, ${props.theme.primary.main} 100%)`
    : props.theme.surface.elevated};
  box-shadow: 0 2px 5px rgba(0,0,0,0.08);
  
  // Dynamic border-radius for message grouping
  border-radius: ${props => {
    if (props.isOwn) {
      return props.isFirstInGroup ? '20px 20px 4px 20px' : '20px 4px 4px 20px';
    } else {
      return props.isFirstInGroup ? '20px 20px 20px 4px' : '4px 20px 20px 4px';
    }
  }};

  ${props => !props.isLastInGroup && css`
    border-bottom-left-radius: ${props.isOwn ? '20px' : '4px'};
    border-bottom-right-radius: ${props.isOwn ? '4px' : '20px'};
  `}
`;

const MessageTime = styled.div`
  font-size: 11px;
  color: ${props => props.theme.text.secondary};
  margin-top: 4px;
  padding: 0 8px;
`;

const InputContainer = styled.div`
  padding: 12px 20px;
  border-top: 1px solid ${props => props.theme.border.default};
  background: ${props => props.theme.surface.elevated};
  box-shadow: 0 -1px 3px rgba(0, 0, 0, 0.05);
`;

const InputWrapper = styled.div`
  display: flex;
  gap: 12px;
  align-items: flex-end;
`;

const MessageInput = styled.textarea`
  flex: 1;
  padding: 12px 20px;
  border: none;
  border-radius: 22px;
  background: ${props => props.theme.background.default};
  color: ${props => props.theme.text.primary};
  resize: none;
  font-family: inherit;
  font-size: 15px;
  outline: none;
  transition: height 0.2s ease; // Smooth height transition
  max-height: 120px;

  &::placeholder {
    color: ${props => props.theme.text.secondary};
  }
`;

const SendButton = styled.button`
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: none;
  background: ${props => props.theme.primary.main};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  flex-shrink: 0;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    background: ${props => props.theme.primary.dark};
    transform: scale(1.1) rotate(15deg);
  }

  &:disabled {
    background: ${props => props.theme.border.default};
    cursor: not-allowed;
    transform: none;
  }
`;

const EmptyState = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: ${props => props.theme.text.secondary};
  text-align: center;
  padding: 20px;
  animation: ${fadeIn} 0.5s ease;
`;

const EmptyStateIcon = styled.div`
  margin-bottom: 24px;
  opacity: 0.3;
  color: ${props => props.theme.text.primary};
`;

// --- Custom Hook for auto-resizing textarea ---
const useAutosizeTextArea = (textAreaRef, value) => {
  useEffect(() => {
    if (textAreaRef.current) {
      textAreaRef.current.style.height = '0px';
      const scrollHeight = textAreaRef.current.scrollHeight;
      textAreaRef.current.style.height = scrollHeight + 'px';
    }
  }, [textAreaRef, value]);
};


// --- The Component ---
const ChatWindow = () => {
  const { currentConversation, messages, sendMessage, loading } = useMessaging();
  const [messageText, setMessageText] = useState('');
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);
  const textAreaRef = useRef(null);

  useAutosizeTextArea(textAreaRef, messageText);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!messageText.trim() || sending || !currentConversation) return;
    try {
      setSending(true);
      await sendMessage(
        messageText.trim(),
        currentConversation.item.id,
        currentConversation.otherUser.id
      );
      setMessageText('');
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setSending(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!currentConversation) {
    return (
      <ChatContainer>
        <EmptyState>
          <EmptyStateIcon><FaUser size={64} /></EmptyStateIcon>
          <h3>Select a conversation</h3>
          <p>Choose a chat from the list to start messaging.</p>
        </EmptyState>
      </ChatContainer>
    );
  }

  const renderMessages = () => {
    return messages.map((message, index) => {
      const prevMessage = messages[index - 1];
      const nextMessage = messages[index + 1];

      // Logic to determine if a message is the first or last in a group
      const isFirstInGroup = !prevMessage || prevMessage.isCurrentUserSender !== message.isCurrentUserSender;
      const isLastInGroup = !nextMessage || nextMessage.isCurrentUserSender !== message.isCurrentUserSender;

      return (
        <MessageGroup key={message.id} isOwn={message.isCurrentUserSender}>
          <Message 
            isOwn={message.isCurrentUserSender}
            isFirstInGroup={isFirstInGroup}
            isLastInGroup={isLastInGroup}
          >
            {message.content}
          </Message>
          {isLastInGroup && (
            <MessageTime>
              {formatDistanceToNow(new Date(message.sentAt), { addSuffix: true })}
            </MessageTime>
          )}
        </MessageGroup>
      );
    });
  };

  return (
    <ChatContainer>
      <ChatHeader>
        <UserInfo>
          <Avatar>
            {currentConversation.otherUser.username.charAt(0).toUpperCase()}
          </Avatar>
          <UserDetails>
            <UserName>{currentConversation.otherUser.username}</UserName>
            <ItemName>Replying about: {currentConversation.item.name}</ItemName>
          </UserDetails>
        </UserInfo>
        {/* The UserCard might be better suited for a modal/popover triggered by clicking the header */}
      </ChatHeader>

      <MessagesContainer>
        {loading && messages.length === 0 ? (
          <EmptyState>Loading messages...</EmptyState>
        ) : messages.length === 0 ? (
          <EmptyState>
            <EmptyStateIcon><FaComments size={56} /></EmptyStateIcon>
            <h3>No messages yet</h3>
            <p>Start the conversation about {currentConversation.item.name}</p>
          </EmptyState>
        ) : (
          renderMessages()
        )}
        <div ref={messagesEndRef} />
      </MessagesContainer>

      <InputContainer>
        <InputWrapper>
          <MessageInput
            ref={textAreaRef}
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            rows={1}
          />
          <SendButton
            onClick={handleSendMessage}
            disabled={!messageText.trim() || sending}
          >
            <FaPaperPlane size={16} />
          </SendButton>
        </InputWrapper>
      </InputContainer>
    </ChatContainer>
  );
};

export default ChatWindow;