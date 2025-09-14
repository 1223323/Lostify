import React from 'react';
import styled, { keyframes } from 'styled-components';

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
`;

const SpinnerContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  
  ${props => props.$fullPage && `
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: ${props.theme.background.overlay};
    backdrop-filter: blur(4px);
    z-index: ${props.theme.zIndex.modal};
  `}
  
  ${props => !props.$fullPage && `
    padding: 2rem;
  `}
`;

const Spinner = styled.div`
  width: ${props => {
    switch(props.$size) {
      case 'sm': return '1.5rem';
      case 'lg': return '4rem';
      case 'xl': return '5rem';
      default: return '2.5rem';
    }
  }};
  height: ${props => {
    switch(props.$size) {
      case 'sm': return '1.5rem';
      case 'lg': return '4rem';
      case 'xl': return '5rem';
      default: return '2.5rem';
    }
  }};
  border: ${props => {
    switch(props.$size) {
      case 'sm': return '2px';
      case 'lg': return '4px';
      case 'xl': return '5px';
      default: return '3px';
    }
  }} solid ${({ theme }) => theme.border.light};
  border-top: ${props => {
    switch(props.$size) {
      case 'sm': return '2px';
      case 'lg': return '4px';
      case 'xl': return '5px';
      default: return '3px';
    }
  }} solid ${({ theme }) => theme.primary.main};
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
`;

const LoadingText = styled.p`
  color: ${({ theme }) => theme.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  margin: 0;
  animation: ${pulse} 2s ease-in-out infinite;
`;

const LoadingDots = styled.div`
  display: flex;
  gap: 0.25rem;
  
  span {
    width: ${props => {
      switch(props.$size) {
        case 'sm': return '0.375rem';
        case 'lg': return '0.75rem';
        default: return '0.5rem';
      }
    }};
    height: ${props => {
      switch(props.$size) {
        case 'sm': return '0.375rem';
        case 'lg': return '0.75rem';
        default: return '0.5rem';
      }
    }};
    background-color: ${({ theme }) => theme.primary.main};
    border-radius: 50%;
    animation: ${pulse} 1.4s ease-in-out infinite;
    
    &:nth-child(1) { animation-delay: -0.32s; }
    &:nth-child(2) { animation-delay: -0.16s; }
    &:nth-child(3) { animation-delay: 0s; }
  }
`;

const LoadingSpinner = ({ 
  size = 'md', 
  fullPage = false, 
  text = '', 
  variant = 'spinner', // 'spinner' or 'dots'
  className = '' 
}) => {
  return (
    <SpinnerContainer $fullPage={fullPage} className={className}>
      {variant === 'dots' ? (
        <LoadingDots $size={size}>
          <span />
          <span />
          <span />
        </LoadingDots>
      ) : (
        <Spinner $size={size} />
      )}
      {text && <LoadingText>{text}</LoadingText>}
    </SpinnerContainer>
  );
};

export default LoadingSpinner;
