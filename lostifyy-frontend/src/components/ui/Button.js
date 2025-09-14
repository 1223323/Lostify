import React from 'react';
import styled, { css } from 'styled-components';

const ButtonBase = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  line-height: 1;
  border-radius: ${({ theme }) => theme.radius.xl};
  transition: all ${({ theme }) => theme.transition.duration.normal} ${({ theme }) => theme.transition.easing.spring};
  cursor: pointer;
  border: 2px solid transparent;
  text-decoration: none;
  white-space: nowrap;
  user-select: none;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transition: left ${({ theme }) => theme.transition.duration.slow} ${({ theme }) => theme.transition.easing.easeInOut};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    pointer-events: none;
    transform: none !important;
    
    &::before {
      display: none;
    }
  }

  &:focus-visible {
    outline: 3px solid ${({ theme }) => theme.primary[200]};
    outline-offset: 2px;
  }
  
  &:hover:not(:disabled) {
    transform: translateY(-2px);
    
    &::before {
      left: 100%;
    }
  }
  
  &:active:not(:disabled) {
    transform: translateY(0);
  }

  /* Size variants */
  ${({ $size }) => {
    switch ($size) {
      case 'xs':
        return css`
          padding: 0.375rem 0.75rem;
          font-size: ${({ theme }) => theme.typography.fontSize.xs};
        `;
      case 'sm':
        return css`
          padding: 0.5rem 1rem;
          font-size: ${({ theme }) => theme.typography.fontSize.sm};
        `;
      case 'lg':
        return css`
          padding: 0.75rem 1.5rem;
          font-size: ${({ theme }) => theme.typography.fontSize.base};
        `;
      case 'xl':
        return css`
          padding: 1rem 2rem;
          font-size: ${({ theme }) => theme.typography.fontSize.lg};
        `;
      default: // md
        return css`
          padding: 0.625rem 1.25rem;
          font-size: ${({ theme }) => theme.typography.fontSize.sm};
        `;
    }
  }}

  /* Variant styles */
  ${({ $variant, theme }) => {
    switch ($variant) {
      case 'primary':
        return css`
          background: linear-gradient(135deg, ${theme.primary.main}, ${theme.secondary.main});
          color: white;
          border-color: transparent;
          box-shadow: ${theme.shadow.lg};

          &:hover:not(:disabled) {
            background: linear-gradient(135deg, ${theme.primary.dark}, ${theme.secondary.dark});
            box-shadow: ${theme.shadow.xl};
          }
        `;
      
      case 'secondary':
        return css`
          background: ${theme.surface.default};
          color: ${theme.text.primary};
          border-color: ${theme.border.medium};
          box-shadow: ${theme.shadow.md};

          &:hover:not(:disabled) {
            background: ${theme.surface.hover};
            border-color: ${theme.primary.main};
            box-shadow: ${theme.shadow.lg};
          }

          &:active {
            background: ${theme.surface.pressed};
          }
        `;
      
      case 'outline':
        return css`
          background: transparent;
          color: ${theme.primary.main};
          border-color: ${theme.primary.main};

          &:hover:not(:disabled) {
            background: ${theme.primary[50]};
            color: ${theme.primary.dark};
            border-color: ${theme.primary.dark};
          }

          &:active {
            background: ${theme.primary[100]};
          }
        `;
      
      case 'ghost':
        return css`
          background: transparent;
          color: ${theme.text.secondary};
          border-color: transparent;

          &:hover:not(:disabled) {
            background: ${theme.surface.hover};
            color: ${theme.text.primary};
          }

          &:active {
            background: ${theme.surface.pressed};
          }
        `;
      
      case 'danger':
        return css`
          background: ${theme.error.main};
          color: white;
          border-color: ${theme.error.main};
          box-shadow: ${theme.shadow.sm};

          &:hover:not(:disabled) {
            background: ${theme.error[600]};
            border-color: ${theme.error[600]};
            box-shadow: ${theme.shadow.md};
            transform: translateY(-1px);
          }

          &:active {
            transform: translateY(0);
            box-shadow: ${theme.shadow.sm};
          }
        `;
      
      case 'success':
        return css`
          background: ${theme.success.main};
          color: white;
          border-color: ${theme.success.main};
          box-shadow: ${theme.shadow.sm};

          &:hover:not(:disabled) {
            background: ${theme.success[600]};
            border-color: ${theme.success[600]};
            box-shadow: ${theme.shadow.md};
            transform: translateY(-1px);
          }

          &:active {
            transform: translateY(0);
            box-shadow: ${theme.shadow.sm};
          }
        `;
      
      default:
        return css`
          background: ${theme.surface.default};
          color: ${theme.text.primary};
          border-color: ${theme.border.default};
          box-shadow: ${theme.shadow.sm};

          &:hover:not(:disabled) {
            background: ${theme.surface.hover};
            border-color: ${theme.border.medium};
            box-shadow: ${theme.shadow.md};
          }

          &:active {
            background: ${theme.surface.pressed};
          }
        `;
    }
  }}

  /* Full width */
  ${({ $fullWidth }) => $fullWidth && css`
    width: 100%;
  `}

  /* Loading state */
  ${({ $loading }) => $loading && css`
    color: transparent;
    pointer-events: none;
    
    &::after {
      content: '';
      position: absolute;
      width: 1rem;
      height: 1rem;
      border: 2px solid transparent;
      border-top: 2px solid currentColor;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      color: ${({ $variant, theme }) => 
        $variant === 'primary' || $variant === 'danger' || $variant === 'success' 
          ? 'white' 
          : theme.text.primary
      };
    }
  `}
`;

const Button = React.forwardRef(({
  children,
  variant = 'default',
  size = 'md',
  fullWidth = false,
  loading = false,
  disabled = false,
  className,
  ...props
}, ref) => {
  return (
    <ButtonBase
      ref={ref}
      $variant={variant}
      $size={size}
      $fullWidth={fullWidth}
      $loading={loading}
      disabled={disabled || loading}
      className={className}
      {...props}
    >
      {children}
    </ButtonBase>
  );
});

Button.displayName = 'Button';

export default Button;