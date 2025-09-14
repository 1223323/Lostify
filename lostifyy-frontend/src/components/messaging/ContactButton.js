import React from 'react';
import styled from 'styled-components';
import { FaComments } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useMessaging } from '../../context/MessagingContext';

const ContactBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  background: ${props => props.$variant === 'outline' 
    ? 'transparent' 
    : props.theme.primary.main};
  color: ${props => props.$variant === 'outline' 
    ? props.theme.primary.main 
    : 'white'};
  border: ${props => props.$variant === 'outline' 
    ? `1px solid ${props.theme.primary.main}` 
    : 'none'};
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 14px;

  &:hover {
    background: ${props => props.$variant === 'outline' 
      ? props.theme.primary.main 
      : props.theme.primary.dark};
    color: white;
    transform: translateY(-2px);
  }

  &:disabled {
    background: ${props => props.theme.text.secondary};
    color: white;
    border: none;
    cursor: not-allowed;
    transform: none;
  }
`;

const ContactButton = ({ item, disabled = false, variant = "primary" }) => {
  const navigate = useNavigate();
  const { startConversation } = useMessaging();

  const handleContact = async () => {
    if (disabled || !item?.user?.id) return;

    try {
      // Start or get existing conversation
      const conversation = await startConversation(item.user.id, item.id);
      
      // Navigate to messages page with the conversation selected
      navigate('/messages', { 
        state: { 
          conversationId: conversation.id,
          itemId: item.id,
          otherUserId: item.user.id 
        } 
      });
    } catch (error) {
      console.error('Error starting conversation:', error);
    }
  };

  const buttonText = item?.status === 'LOST' ? 'Contact Reporter' : 'Contact Finder';

  return (
    <ContactBtn onClick={handleContact} disabled={disabled} $variant={variant}>
      <FaComments size={16} />
      {buttonText}
    </ContactBtn>
  );
};

export default ContactButton;