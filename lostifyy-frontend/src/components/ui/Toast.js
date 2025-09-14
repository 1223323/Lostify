import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { FaCheckCircle, FaExclamationTriangle, FaInfoCircle, FaTimes } from 'react-icons/fa';

const slideIn = keyframes`
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
`;

const slideOut = keyframes`
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(100%);
    opacity: 0;
  }
`;

const ToastContainer = styled.div`
  position: fixed;
  top: 2rem;
  right: 2rem;
  z-index: ${({ theme }) => theme.zIndex.toast};
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  max-width: 400px;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    top: 1rem;
    right: 1rem;
    left: 1rem;
    max-width: none;
  }
`;

const ToastItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 1.25rem;
  border-radius: ${({ theme }) => theme.radius.lg};
  box-shadow: ${({ theme }) => theme.shadow.lg};
  border: 1px solid ${({ theme, $type }) => {
    switch ($type) {
      case 'success': return theme.success[200];
      case 'error': return theme.error[200];
      case 'warning': return theme.warning[200];
      default: return theme.primary[200];
    }
  }};
  background: ${({ theme, $type }) => {
    switch ($type) {
      case 'success': return theme.success[50];
      case 'error': return theme.error[50];
      case 'warning': return theme.warning[50];
      default: return theme.primary[50];
    }
  }};
  color: ${({ theme, $type }) => {
    switch ($type) {
      case 'success': return theme.success[700];
      case 'error': return theme.error[700];
      case 'warning': return theme.warning[700];
      default: return theme.primary[700];
    }
  }};
  animation: ${({ $isExiting }) => $isExiting ? slideOut : slideIn} 0.3s ease-out;
`;

const ToastIcon = styled.div`
  flex-shrink: 0;
  font-size: 1.25rem;
`;

const ToastContent = styled.div`
  flex: 1;
  
  h4 {
    margin: 0 0 0.25rem;
    font-size: ${({ theme }) => theme.typography.fontSize.sm};
    font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  }
  
  p {
    margin: 0;
    font-size: ${({ theme }) => theme.typography.fontSize.xs};
    opacity: 0.9;
  }
`;

const ToastClose = styled.button`
  background: none;
  border: none;
  color: currentColor;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: ${({ theme }) => theme.radius.sm};
  opacity: 0.7;
  transition: opacity ${({ theme }) => theme.transition.duration.fast} ${({ theme }) => theme.transition.easing.easeInOut};
  
  &:hover {
    opacity: 1;
  }
  
  svg {
    width: 1rem;
    height: 1rem;
  }
`;

const Toast = ({ toasts, removeToast }) => {
  const getIcon = (type) => {
    switch (type) {
      case 'success': return <FaCheckCircle />;
      case 'error': return <FaExclamationTriangle />;
      case 'warning': return <FaExclamationTriangle />;
      default: return <FaInfoCircle />;
    }
  };

  return (
    <ToastContainer>
      {toasts.map((toast) => (
        <ToastItem key={toast.id} $type={toast.type} $isExiting={toast.isExiting}>
          <ToastIcon>{getIcon(toast.type)}</ToastIcon>
          <ToastContent>
            {toast.title && <h4>{toast.title}</h4>}
            <p>{toast.message}</p>
          </ToastContent>
          <ToastClose onClick={() => removeToast(toast.id)}>
            <FaTimes />
          </ToastClose>
        </ToastItem>
      ))}
    </ToastContainer>
  );
};

// Hook for using toasts
export const useToast = () => {
  const [toasts, setToasts] = useState([]);

  const addToast = (toast) => {
    const id = Date.now() + Math.random();
    const newToast = { id, ...toast };
    
    setToasts(prev => [...prev, newToast]);
    
    // Auto remove after duration
    setTimeout(() => {
      removeToast(id);
    }, toast.duration || 5000);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.map(toast => 
      toast.id === id ? { ...toast, isExiting: true } : toast
    ));
    
    // Remove from array after animation
    setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.id !== id));
    }, 300);
  };

  return {
    toasts,
    addToast,
    removeToast,
    success: (message, title) => addToast({ type: 'success', message, title }),
    error: (message, title) => addToast({ type: 'error', message, title }),
    warning: (message, title) => addToast({ type: 'warning', message, title }),
    info: (message, title) => addToast({ type: 'info', message, title }),
  };
};

export default Toast;