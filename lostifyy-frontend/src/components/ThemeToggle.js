import React from 'react';
import styled, { css } from 'styled-components';
import { FaSun, FaMoon } from 'react-icons/fa';
import { useTheme } from '../context/ThemeContext';

const ToggleButton = styled.button`
  position: relative;
  width: 3rem;
  height: 1.5rem;
  background-color: ${({ theme, $isDark }) => 
    $isDark ? theme.primary.main : theme.gray[300]
  };
  border: none;
  border-radius: ${({ theme }) => theme.radius.full};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transition.duration.normal} ${({ theme }) => theme.transition.easing.easeInOut};
  display: flex;
  align-items: center;
  padding: 0.125rem;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);

  &:hover {
    box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.15), 
                0 0 0 3px ${({ theme }) => theme.primary[100]};
  }

  &:focus {
    outline: none;
    box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1),
                0 0 0 3px ${({ theme }) => theme.primary[200]};
  }
`;

const ToggleThumb = styled.div`
  width: 1.25rem;
  height: 1.25rem;
  background-color: white;
  border-radius: 50%;
  box-shadow: ${({ theme }) => theme.shadow.sm};
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all ${({ theme }) => theme.transition.duration.normal} ${({ theme }) => theme.transition.easing.spring};
  transform: translateX(${({ $isDark }) => $isDark ? '1.5rem' : '0'});
  
  svg {
    width: 0.75rem;
    height: 0.75rem;
    color: ${({ theme, $isDark }) => 
      $isDark ? theme.primary.main : theme.warning.main
    };
    transition: all ${({ theme }) => theme.transition.duration.fast} ${({ theme }) => theme.transition.easing.easeInOut};
  }
`;

const ToggleLabel = styled.span`
  margin-left: 0.75rem;
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.text.secondary};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    display: none;
  }
`;

const ToggleWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const ThemeToggle = ({ showLabel = true, className }) => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <ToggleWrapper className={className}>
      <ToggleButton
        onClick={toggleTheme}
        $isDark={isDarkMode}
        aria-label={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}
        title={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}
      >
        <ToggleThumb $isDark={isDarkMode}>
          {isDarkMode ? <FaMoon /> : <FaSun />}
        </ToggleThumb>
      </ToggleButton>
      {showLabel && (
        <ToggleLabel>
          {isDarkMode ? 'Dark' : 'Light'}
        </ToggleLabel>
      )}
    </ToggleWrapper>
  );
};

export default ThemeToggle;