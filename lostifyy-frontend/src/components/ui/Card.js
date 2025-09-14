import React from 'react';
import styled, { css } from 'styled-components';

const CardBase = styled.div`
  background-color: ${({ theme }) => theme.surface.default};
  border: 1px solid ${({ theme }) => theme.border.default};
  border-radius: ${({ theme }) => theme.radius.lg};
  box-shadow: ${({ theme }) => theme.shadow.sm};
  transition: all ${({ theme }) => theme.transition.duration.normal} ${({ theme }) => theme.transition.easing.easeInOut};
  overflow: hidden;

  /* Hover effect for interactive cards */
  ${({ $interactive }) => $interactive && css`
    cursor: pointer;
    
    &:hover {
      box-shadow: ${({ theme }) => theme.shadow.md};
      transform: translateY(-2px);
      border-color: ${({ theme }) => theme.border.medium};
    }
    
    &:active {
      transform: translateY(0);
      box-shadow: ${({ theme }) => theme.shadow.sm};
    }
  `}

  /* Size variants */
  ${({ $size }) => {
    switch ($size) {
      case 'sm':
        return css`
          padding: 1rem;
        `;
      case 'lg':
        return css`
          padding: 2rem;
        `;
      default: // md
        return css`
          padding: 1.5rem;
        `;
    }
  }}

  /* Variant styles */
  ${({ $variant, theme }) => {
    switch ($variant) {
      case 'elevated':
        return css`
          box-shadow: ${theme.shadow.lg};
          border: none;
        `;
      case 'outlined':
        return css`
          box-shadow: none;
          border: 2px solid ${theme.border.default};
        `;
      case 'ghost':
        return css`
          background-color: transparent;
          border: none;
          box-shadow: none;
        `;
      default:
        return '';
    }
  }}
`;

const CardHeader = styled.div`
  margin-bottom: 1rem;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const CardTitle = styled.h3`
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.text.primary};
  margin-bottom: 0.25rem;
  line-height: ${({ theme }) => theme.typography.lineHeight.tight};
`;

const CardDescription = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.text.secondary};
  margin: 0;
  line-height: ${({ theme }) => theme.typography.lineHeight.normal};
`;

const CardContent = styled.div`
  /* Content styles are minimal to allow flexibility */
`;

const CardFooter = styled.div`
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid ${({ theme }) => theme.border.light};
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  
  &:first-child {
    margin-top: 0;
    padding-top: 0;
    border-top: none;
  }
`;

const Card = React.forwardRef(({
  children,
  variant = 'default',
  size = 'md',
  interactive = false,
  className,
  ...props
}, ref) => {
  return (
    <CardBase
      ref={ref}
      $variant={variant}
      $size={size}
      $interactive={interactive}
      className={className}
      {...props}
    >
      {children}
    </CardBase>
  );
});

Card.displayName = 'Card';

// Compound components
Card.Header = CardHeader;
Card.Title = CardTitle;
Card.Description = CardDescription;
Card.Content = CardContent;
Card.Footer = CardFooter;

export default Card;