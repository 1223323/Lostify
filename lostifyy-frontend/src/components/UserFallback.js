import React from 'react';
import styled from 'styled-components';
import { FaExclamationTriangle } from 'react-icons/fa';

const FallbackContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  background: #fef3c7;
  border: 1px solid #fbbf24;
  border-radius: 8px;
  color: #92400e;
  font-size: 14px;
`;

const FallbackIcon = styled.div`
  color: #d97706;
  font-size: 1.125rem;
`;

const UserFallback = ({ message = "User information not available" }) => {
  return (
    <FallbackContainer>
      <FallbackIcon>
        <FaExclamationTriangle />
      </FallbackIcon>
      <span>{message}</span>
    </FallbackContainer>
  );
};

export default UserFallback;