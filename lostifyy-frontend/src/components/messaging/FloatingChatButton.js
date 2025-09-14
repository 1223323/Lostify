import React, { useState } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { FaComments } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useMessaging } from '../../context/MessagingContext';
import QuickChatPreview from './QuickChatPreview';

const pulse = keyframes`
  0% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(99, 102, 241, 0.7);
  }
  70% {
    transform: scale(1.05);
    box-shadow: 0 0 0 10px rgba(99, 102, 241, 0);
  }
  100% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(99, 102, 241, 0);
  }
`;

const FloatingButton = styled.button`
  position: fixed;
  bottom: 24px;
  right: 24px;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  color: white;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  box-shadow: 0 8px 25px rgba(99, 102, 241, 0.4);
  transition: all 0.3s ease;
  z-index: ${props => props.theme.zIndex.toast};
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 12px 35px rgba(99, 102, 241, 0.5);
  }
  
  ${props => props.$hasUnread && css`
    animation: ${pulse} 2s infinite;
  `}
  
  @media (max-width: 768px) {
    bottom: 20px;
    right: 20px;
    width: 56px;
    height: 56px;
    font-size: 20px;
  }
`;

const UnreadBadge = styled.div`
  position: absolute;
  top: -4px;
  right: -4px;
  background: ${props => props.theme.error.main};
  color: white;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: bold;
  border: 2px solid white;
  min-width: 24px;
`;

const FloatingChatButton = () => {
  const navigate = useNavigate();
  const { unreadCount, conversations } = useMessaging();
  const [showPreview, setShowPreview] = useState(false);

  const handleClick = () => {
    if (conversations.length > 0) {
      setShowPreview(!showPreview);
    } else {
      navigate('/messages');
    }
  };

  const handleClosePreview = () => {
    setShowPreview(false);
  };

  return (
    <>
      <FloatingButton 
        onClick={handleClick}
        $hasUnread={unreadCount > 0}
        title={`Messages${unreadCount > 0 ? ` (${unreadCount} unread)` : ''}`}
      >
        <FaComments />
        {unreadCount > 0 && (
          <UnreadBadge>
            {unreadCount > 99 ? '99+' : unreadCount}
          </UnreadBadge>
        )}
      </FloatingButton>
      
      <QuickChatPreview 
        isOpen={showPreview} 
        onClose={handleClosePreview} 
      />
    </>
  );
};

export default FloatingChatButton;