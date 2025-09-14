import React from 'react';
import styled from 'styled-components';
import { useMessaging } from '../../context/MessagingContext';

const Badge = styled.div`
  position: absolute;
  top: -8px;
  right: -8px;
  background: ${props => props.theme.error.main};
  color: white;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: bold;
  min-width: 20px;
  z-index: 1;
`;

const Container = styled.div`
  position: relative;
  display: inline-block;
`;

const MessagesBadge = ({ children }) => {
  const { unreadCount } = useMessaging();

  return (
    <Container>
      {children}
      {unreadCount > 0 && (
        <Badge>
          {unreadCount > 99 ? '99+' : unreadCount}
        </Badge>
      )}
    </Container>
  );
};

export default MessagesBadge;