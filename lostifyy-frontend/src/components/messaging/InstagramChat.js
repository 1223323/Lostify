import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { 
  FaPaperPlane, 
  FaUser, 
  FaImage, 
  FaSmile, 
  FaPhone,
  FaVideo,
  FaInfoCircle,
  FaTimes
} from 'react-icons/fa';
import { formatDistanceToNow } from 'date-fns';

const ChatContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  max-height: 600px;
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border: 1px solid #e1e8ed;
`;

const ChatHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  background: white;
  border-bottom: 1px solid #e1e8ed;
  position: sticky;
  top: 0;
  z-index: 10;
`;

const UserProfile = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
`;

const Avatar = styled.div`
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
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: 2px;
    right: 2px;
    width: 12px;
    height: 12px;
    background: #4ade80;
    border: 2px solid white;
    border-radius: 50%;
  }
`;

const UserInfo = styled.div`
  flex: 1;
`;

const Username = styled.div`
  font-weight: 600;
  color: #1a1a1a;
  font-size: 16px;
`;

const Status = styled.div`
  font-size: 12px;
  color: #8e8e8e;
`;

const HeaderActions = styled.div`
  display: flex;
  gap: 16px;
`;

const HeaderButton = styled.button`
  background: none;
  border: none;
  color: #1a1a1a;
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
  transition: background 0.2s ease;
  
  &:hover {
    background: #f5f5f5;
  }
`;

const MessagesContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 16px 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  background: #fafafa;
`;

const MessageGroup = styled.div`
  display: flex;
  flex-direction: column;
  align-items: ${props => props.isOwn ? 'flex-end' : 'flex-start'};
  gap: 4px;
  max-width: 70%;
  align-self: ${props => props.isOwn ? 'flex-end' : 'flex-start'};
`;

const Message = styled.div`
  padding: 12px 16px;
  border-radius: 18px;
  background: ${props => props.isOwn ? 
    'linear-gradient(135deg, #667eea, #764ba2)' : 
    '#e4e6ea'
  };
  color: ${props => props.isOwn ? 'white' : '#1a1a1a'};
  word-wrap: break-word;
  position: relative;
  max-width: 100%;
  font-size: 14px;
  line-height: 1.4;
  
  ${props => props.isOwn ? `
    border-bottom-right-radius: 4px;
  ` : `
    border-bottom-left-radius: 4px;
  `}
`;

const MessageTime = styled.div`
  font-size: 11px;
  color: #8e8e8e;
  margin-top: 4px;
  text-align: ${props => props.isOwn ? 'right' : 'left'};
`;

const MessageReactions = styled.div`
  display: flex;
  gap: 4px;
  margin-top: 4px;
  justify-content: ${props => props.isOwn ? 'flex-end' : 'flex-start'};
`;

const Reaction = styled.button`
  background: white;
  border: 1px solid #e1e8ed;
  border-radius: 12px;
  padding: 2px 6px;
  font-size: 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 2px;
  
  &:hover {
    background: #f5f5f5;
  }
`;

const InputContainer = styled.div`
  padding: 16px 20px;
  background: white;
  border-top: 1px solid #e1e8ed;
`;

const InputWrapper = styled.div`
  display: flex;
  align-items: flex-end;
  gap: 12px;
  background: #f5f5f5;
  border-radius: 24px;
  padding: 8px 16px;
`;

const MessageInput = styled.textarea`
  flex: 1;
  border: none;
  background: none;
  resize: none;
  outline: none;
  font-family: inherit;
  font-size: 14px;
  line-height: 1.4;
  min-height: 20px;
  max-height: 100px;
  padding: 8px 0;
  
  &::placeholder {
    color: #8e8e8e;
  }
`;

const InputActions = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`;

const InputButton = styled.button`
  background: none;
  border: none;
  color: #667eea;
  cursor: pointer;
  padding: 4px;
  border-radius: 50%;
  transition: all 0.2s ease;
  
  &:hover {
    background: #667eea20;
    transform: scale(1.1);
  }
  
  &:disabled {
    color: #ccc;
    cursor: not-allowed;
  }
`;

const SendButton = styled.button`
  background: ${props => props.disabled ? '#ccc' : 'linear-gradient(135deg, #667eea, #764ba2)'};
  border: none;
  color: white;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  transition: all 0.2s ease;
  
  &:hover:not(:disabled) {
    transform: scale(1.1);
  }
`;

const TypingIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  color: #8e8e8e;
  font-size: 12px;
  font-style: italic;
`;

const TypingDots = styled.div`
  display: flex;
  gap: 2px;
  
  span {
    width: 4px;
    height: 4px;
    background: #8e8e8e;
    border-radius: 50%;
    animation: typing 1.4s infinite ease-in-out;
    
    &:nth-child(1) { animation-delay: -0.32s; }
    &:nth-child(2) { animation-delay: -0.16s; }
  }
  
  @keyframes typing {
    0%, 80%, 100% { transform: scale(0); }
    40% { transform: scale(1); }
  }
`;

const InstagramChat = ({ 
  otherUser, 
  messages = [], 
  onSendMessage, 
  currentUser,
  isTyping = false,
  onClose 
}) => {
  const [messageText, setMessageText] = useState('');
  const [isEmojiOpen, setIsEmojiOpen] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (!messageText.trim()) return;
    
    onSendMessage(messageText.trim());
    setMessageText('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleReaction = (messageId, emoji) => {
    // Handle message reactions
    // TODO: Implement reaction functionality
  };

  const emojis = ['❤️', '😂', '😮', '😢', '😡', '👍'];

  return (
    <ChatContainer>
      <ChatHeader>
        <UserProfile>
          <Avatar>
            {otherUser?.username?.charAt(0)?.toUpperCase() || '?'}
          </Avatar>
          <UserInfo>
            <Username>@{otherUser?.username || 'Unknown'}</Username>
            <Status>Active now</Status>
          </UserInfo>
        </UserProfile>
        
        <HeaderActions>
          <HeaderButton title="Voice call">
            <FaPhone size={16} />
          </HeaderButton>
          <HeaderButton title="Video call">
            <FaVideo size={16} />
          </HeaderButton>
          <HeaderButton title="User info">
            <FaInfoCircle size={16} />
          </HeaderButton>
          {onClose && (
            <HeaderButton onClick={onClose} title="Close">
              <FaTimes size={16} />
            </HeaderButton>
          )}
        </HeaderActions>
      </ChatHeader>

      <MessagesContainer>
        {messages.length === 0 ? (
          <div style={{ 
            textAlign: 'center', 
            color: '#8e8e8e', 
            padding: '40px 20px',
            fontSize: '14px'
          }}>
            <FaUser size={48} style={{ marginBottom: '16px', opacity: 0.3 }} />
            <div>Start a conversation with @{otherUser?.username}</div>
            <div style={{ fontSize: '12px', marginTop: '8px' }}>
              Say hello and introduce yourself!
            </div>
          </div>
        ) : (
          messages.map((message, index) => (
            <MessageGroup key={message.id || index} isOwn={message.isCurrentUserSender}>
              <Message isOwn={message.isCurrentUserSender}>
                {message.content}
              </Message>
              <MessageTime isOwn={message.isCurrentUserSender}>
                {formatDistanceToNow(new Date(message.sentAt || Date.now()), { addSuffix: true })}
              </MessageTime>
              <MessageReactions isOwn={message.isCurrentUserSender}>
                {emojis.slice(0, 2).map(emoji => (
                  <Reaction 
                    key={emoji}
                    onClick={() => handleReaction(message.id, emoji)}
                  >
                    {emoji} 1
                  </Reaction>
                ))}
              </MessageReactions>
            </MessageGroup>
          ))
        )}
        
        {isTyping && (
          <TypingIndicator>
            @{otherUser?.username} is typing
            <TypingDots>
              <span></span>
              <span></span>
              <span></span>
            </TypingDots>
          </TypingIndicator>
        )}
        
        <div ref={messagesEndRef} />
      </MessagesContainer>

      <InputContainer>
        <InputWrapper>
          <InputActions>
            <InputButton title="Add photo">
              <FaImage size={16} />
            </InputButton>
            <InputButton 
              title="Add emoji"
              onClick={() => setIsEmojiOpen(!isEmojiOpen)}
            >
              <FaSmile size={16} />
            </InputButton>
          </InputActions>
          
          <MessageInput
            ref={inputRef}
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={`Message @${otherUser?.username || 'user'}...`}
            rows={1}
          />
          
          <SendButton
            onClick={handleSendMessage}
            disabled={!messageText.trim()}
          >
            <FaPaperPlane size={12} />
          </SendButton>
        </InputWrapper>
        
        {isEmojiOpen && (
          <div style={{ 
            display: 'flex', 
            gap: '8px', 
            marginTop: '8px',
            padding: '8px',
            background: '#f5f5f5',
            borderRadius: '12px'
          }}>
            {emojis.map(emoji => (
              <button
                key={emoji}
                onClick={() => {
                  setMessageText(prev => prev + emoji);
                  setIsEmojiOpen(false);
                  inputRef.current?.focus();
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '20px',
                  cursor: 'pointer',
                  padding: '4px',
                  borderRadius: '4px'
                }}
              >
                {emoji}
              </button>
            ))}
          </div>
        )}
      </InputContainer>
    </ChatContainer>
  );
};

export default InstagramChat;