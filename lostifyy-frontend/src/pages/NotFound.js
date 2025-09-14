import React from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaSearch } from 'react-icons/fa';
import styled, { keyframes } from 'styled-components';

const NotFound = () => {
  return (
    <Container>
      <Content>
        <ErrorCode>404</ErrorCode>
        <Title>Page Not Found</Title>
        <Message>Oops! The page you're looking for doesn't exist or has been moved.</Message>
        
        <Actions>
          <PrimaryButton to="/">
            <FaHome />
            <span>Go to Home</span>
          </PrimaryButton>
          
          <SecondaryButton to="/items">
            <FaSearch />
            <span>Browse Items</span>
          </SecondaryButton>
        </Actions>
      </Content>
    </Container>
  );
};

// Animations
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 80vh;
  text-align: center;
  padding: 2rem;
  background: ${({ theme }) => theme.background.default};
`;

const Content = styled.div`
  max-width: 600px;
  padding: 3rem 2.5rem;
  background: ${({ theme }) => theme.surface.default};
  border-radius: ${({ theme }) => theme.radius['2xl']};
  box-shadow: ${({ theme }) => theme.shadow.xl};
  border: 1px solid ${({ theme }) => theme.border.light};
  animation: ${fadeIn} 0.5s ease-out;
`;

const ErrorCode = styled.h1`
  font-size: 8rem;
  font-weight: ${({ theme }) => theme.typography.fontWeight.black};
  line-height: 1;
  margin: 0;
  background: linear-gradient(135deg, ${({ theme }) => theme.primary.main}, ${({ theme }) => theme.secondary.main});
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  
  @media (max-width: 480px) {
    font-size: 6rem;
  }
`;

const Title = styled.h2`
  font-size: ${({ theme }) => theme.typography.fontSize['2xl']};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.text.primary};
  margin: 1rem 0 0.5rem;
  
  @media (max-width: 480px) {
    font-size: ${({ theme }) => theme.typography.fontSize.xl};
  }
`;

const Message = styled.p`
  color: ${({ theme }) => theme.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  margin-bottom: 2rem;
  line-height: ${({ theme }) => theme.typography.lineHeight.relaxed};
  max-width: 32rem;
  margin-left: auto;
  margin-right: auto;
`;

const Actions = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
  margin-top: 2rem;
`;

const ButtonBase = styled(Link)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.2s ease-in-out;
  font-size: 1rem;
  gap: 0.5rem;
  
  svg {
    font-size: 0.9em;
  }
  
  @media (max-width: 480px) {
    width: 100%;
    justify-content: center;
  }
`;

const PrimaryButton = styled(ButtonBase)`
  background-color: #4F46E5;
  color: white;
  border: 2px solid transparent;
  
  &:hover {
    background-color: #4338CA;
    transform: translateY(-1px);
    box-shadow: 0 4px 6px -1px rgba(79, 70, 229, 0.3), 0 2px 4px -1px rgba(79, 70, 229, 0.2);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

const SecondaryButton = styled(ButtonBase)`
  background-color: white;
  color: #4F46E5;
  border: 2px solid #e2e8f0;
  
  &:hover {
    background-color: #f8fafc;
    border-color: #cbd5e1;
    transform: translateY(-1px);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

export default NotFound;
