import React from 'react';
import styled, { css } from 'styled-components';

const InputWrapper = styled.div`
  position: relative;
  width: 100%;
`;

const InputBase = styled.input`
  width: 100%;
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  line-height: ${({ theme }) => theme.typography.lineHeight.normal};
  color: ${({ theme }) => theme.text.primary};
  background-color: ${({ theme }) => theme.surface.default};
  border: 1px solid ${({ theme }) => theme.border.default};
  border-radius: ${({ theme }) => theme.radius.md};
  transition: all ${({ theme }) => theme.transition.duration.fast} ${({ theme }) => theme.transition.easing.easeInOut};
  outline: none;

  &::placeholder {
    color: ${({ theme }) => theme.text.tertiary};
  }

  &:focus {
    border-color: ${({ theme }) => theme.border.focus};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.primary[100]};
  }

  &:disabled {
    background-color: ${({ theme }) => theme.surface.disabled};
    color: ${({ theme }) => theme.text.disabled};
    cursor: not-allowed;
  }

  /* Size variants */
  ${({ $size }) => {
    switch ($size) {
      case 'sm':
        return css`
          padding: 0.5rem 0.75rem;
          font-size: ${({ theme }) => theme.typography.fontSize.xs};
        `;
      case 'lg':
        return css`
          padding: 0.75rem 1rem;
          font-size: ${({ theme }) => theme.typography.fontSize.base};
        `;
      default: // md
        return css`
          padding: 0.625rem 0.875rem;
          font-size: ${({ theme }) => theme.typography.fontSize.sm};
        `;
    }
  }}

  /* Error state */
  ${({ $error, theme }) => $error && css`
    border-color: ${theme.error.main};
    
    &:focus {
      border-color: ${theme.error.main};
      box-shadow: 0 0 0 3px ${theme.error[100]};
    }
  `}

  /* Success state */
  ${({ $success, theme }) => $success && css`
    border-color: ${theme.success.main};
    
    &:focus {
      border-color: ${theme.success.main};
      box-shadow: 0 0 0 3px ${theme.success[100]};
    }
  `}

  /* Icon padding */
  ${({ $hasLeftIcon }) => $hasLeftIcon && css`
    padding-left: 2.5rem;
  `}

  ${({ $hasRightIcon }) => $hasRightIcon && css`
    padding-right: 2.5rem;
  `}
`;

const TextAreaBase = styled.textarea`
  width: 100%;
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  line-height: ${({ theme }) => theme.typography.lineHeight.normal};
  color: ${({ theme }) => theme.text.primary};
  background-color: ${({ theme }) => theme.surface.default};
  border: 1px solid ${({ theme }) => theme.border.default};
  border-radius: ${({ theme }) => theme.radius.md};
  transition: all ${({ theme }) => theme.transition.duration.fast} ${({ theme }) => theme.transition.easing.easeInOut};
  outline: none;
  resize: vertical;
  min-height: 80px;
  padding: 0.625rem 0.875rem;
  font-family: inherit;

  &::placeholder {
    color: ${({ theme }) => theme.text.tertiary};
  }

  &:focus {
    border-color: ${({ theme }) => theme.border.focus};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.primary[100]};
  }

  &:disabled {
    background-color: ${({ theme }) => theme.surface.disabled};
    color: ${({ theme }) => theme.text.disabled};
    cursor: not-allowed;
    resize: none;
  }

  /* Error state */
  ${({ $error, theme }) => $error && css`
    border-color: ${theme.error.main};
    
    &:focus {
      border-color: ${theme.error.main};
      box-shadow: 0 0 0 3px ${theme.error[100]};
    }
  `}

  /* Success state */
  ${({ $success, theme }) => $success && css`
    border-color: ${theme.success.main};
    
    &:focus {
      border-color: ${theme.success.main};
      box-shadow: 0 0 0 3px ${theme.success[100]};
    }
  `}
`;

const IconWrapper = styled.div`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.text.tertiary};
  pointer-events: none;
  z-index: 1;

  ${({ $position }) => $position === 'left' ? css`
    left: 0.75rem;
  ` : css`
    right: 0.75rem;
  `}

  svg {
    width: 1rem;
    height: 1rem;
  }
`;

const Label = styled.label`
  display: block;
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.text.primary};
  margin-bottom: 0.375rem;
  
  ${({ $required }) => $required && css`
    &::after {
      content: ' *';
      color: ${({ theme }) => theme.error.main};
    }
  `}
`;

const HelperText = styled.div`
  margin-top: 0.375rem;
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  line-height: ${({ theme }) => theme.typography.lineHeight.normal};
  
  ${({ $error, theme }) => $error ? css`
    color: ${theme.error.main};
  ` : css`
    color: ${theme.text.tertiary};
  `}
`;

const Input = React.forwardRef(({
  label,
  helperText,
  error,
  success,
  required,
  size = 'md',
  leftIcon,
  rightIcon,
  multiline,
  rows = 3,
  className,
  ...props
}, ref) => {
  const Component = multiline ? TextAreaBase : InputBase;
  
  return (
    <div className={className}>
      {label && (
        <Label htmlFor={props.id} $required={required}>
          {label}
        </Label>
      )}
      <InputWrapper>
        {leftIcon && (
          <IconWrapper $position="left">
            {leftIcon}
          </IconWrapper>
        )}
        <Component
          ref={ref}
          $size={size}
          $error={!!error}
          $success={success}
          $hasLeftIcon={!!leftIcon}
          $hasRightIcon={!!rightIcon}
          rows={multiline ? rows : undefined}
          {...props}
        />
        {rightIcon && (
          <IconWrapper $position="right">
            {rightIcon}
          </IconWrapper>
        )}
      </InputWrapper>
      {(helperText || error) && (
        <HelperText $error={!!error}>
          {error || helperText}
        </HelperText>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;