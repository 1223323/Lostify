import React from 'react';
import styled, { css } from 'styled-components';

const BadgeBase = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.25rem;
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  line-height: 1;
  border-radius: ${({ theme }) => theme.radius.full};
  white-space: nowrap;
  transition: all ${({ theme }) => theme.transition.duration.fast} ${({ theme }) => theme.transition.easing.easeInOut};

  /* Size variants */
  ${({ $size }) => {
    switch ($size) {
      case 'sm':
        return css`
          padding: 0.125rem 0.5rem;
          font-size: ${({ theme }) => theme.typography.fontSize.xs};
          min-height: 1.25rem;
        `;
      case 'lg':
        return css`
          padding: 0.375rem 0.75rem;
          font-size: ${({ theme }) => theme.typography.fontSize.sm};
          min-height: 2rem;
        `;
      default: // md
        return css`
          padding: 0.25rem 0.625rem;
          font-size: ${({ theme }) => theme.typography.fontSize.xs};
          min-height: 1.5rem;
        `;
    }
  }}

  /* Variant styles */
  ${({ $variant, theme }) => {
    switch ($variant) {
      case 'primary':
        return css`
          background-color: ${theme.primary.main};
          color: white;
        `;
      
      case 'secondary':
        return css`
          background-color: ${theme.secondary.main};
          color: white;
        `;
      
      case 'success':
        return css`
          background-color: ${theme.success[100]};
          color: ${theme.success[800]};
          border: 1px solid ${theme.success[200]};
        `;
      
      case 'warning':
        return css`
          background-color: ${theme.warning[100]};
          color: ${theme.warning[800]};
          border: 1px solid ${theme.warning[200]};
        `;
      
      case 'error':
        return css`
          background-color: ${theme.error[100]};
          color: ${theme.error[800]};
          border: 1px solid ${theme.error[200]};
        `;
      
      case 'outline':
        return css`
          background-color: transparent;
          color: ${theme.text.secondary};
          border: 1px solid ${theme.border.default};
        `;
      
      case 'ghost':
        return css`
          background-color: ${theme.surface.hover};
          color: ${theme.text.secondary};
        `;
      
      default: // neutral
        return css`
          background-color: ${theme.gray[100]};
          color: ${theme.gray[800]};
          border: 1px solid ${theme.gray[200]};
        `;
    }
  }}

  /* Interactive styles */
  ${({ $interactive, theme }) => $interactive && css`
    cursor: pointer;
    
    &:hover {
      transform: scale(1.05);
      box-shadow: ${theme.shadow.sm};
    }
    
    &:active {
      transform: scale(0.98);
    }
  `}

  /* Dot indicator */
  ${({ $dot }) => $dot && css`
    position: relative;
    
    &::before {
      content: '';
      position: absolute;
      left: 0.375rem;
      width: 0.375rem;
      height: 0.375rem;
      border-radius: 50%;
      background-color: currentColor;
    }
    
    padding-left: 1rem;
  `}
`;

const Badge = React.forwardRef(({
  children,
  variant = 'default',
  size = 'md',
  interactive = false,
  dot = false,
  className,
  ...props
}, ref) => {
  return (
    <BadgeBase
      ref={ref}
      $variant={variant}
      $size={size}
      $interactive={interactive}
      $dot={dot}
      className={className}
      {...props}
    >
      {children}
    </BadgeBase>
  );
});

Badge.displayName = 'Badge';

export default Badge;