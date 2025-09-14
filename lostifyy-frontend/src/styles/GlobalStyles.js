import { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle`
  /* Fonts will be loaded via index.html */

  /* CSS Reset & Base Styles */
  *,
  *::before,
  *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  html {
    font-size: 16px;
    line-height: 1.5;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-rendering: optimizeLegibility;
    scroll-behavior: smooth;
  }

  body {
    font-family: ${({ theme }) => theme.typography.fontFamily.sans};
    font-size: ${({ theme }) => theme.typography.fontSize.base};
    font-weight: ${({ theme }) => theme.typography.fontWeight.normal};
    line-height: ${({ theme }) => theme.typography.lineHeight.normal};
    color: ${({ theme }) => theme.text.primary};
    background-color: ${({ theme }) => theme.background.default};
    transition: background-color ${({ theme }) => theme.transition.duration.normal} ${({ theme }) => theme.transition.easing.easeInOut},
                color ${({ theme }) => theme.transition.duration.normal} ${({ theme }) => theme.transition.easing.easeInOut};
    overflow-x: hidden;
  }

  /* Typography */
  h1, h2, h3, h4, h5, h6 {
    font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
    line-height: ${({ theme }) => theme.typography.lineHeight.tight};
    color: ${({ theme }) => theme.text.primary};
    margin-bottom: 0.5em;
  }

  h1 {
    font-size: ${({ theme }) => theme.typography.fontSize['4xl']};
    font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
    
    @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
      font-size: ${({ theme }) => theme.typography.fontSize['3xl']};
    }
  }

  h2 {
    font-size: ${({ theme }) => theme.typography.fontSize['3xl']};
    
    @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
      font-size: ${({ theme }) => theme.typography.fontSize['2xl']};
    }
  }

  h3 {
    font-size: ${({ theme }) => theme.typography.fontSize['2xl']};
    
    @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
      font-size: ${({ theme }) => theme.typography.fontSize.xl};
    }
  }

  h4 {
    font-size: ${({ theme }) => theme.typography.fontSize.xl};
  }

  h5 {
    font-size: ${({ theme }) => theme.typography.fontSize.lg};
  }

  h6 {
    font-size: ${({ theme }) => theme.typography.fontSize.base};
  }

  p {
    margin-bottom: 1em;
    color: ${({ theme }) => theme.text.secondary};
    line-height: ${({ theme }) => theme.typography.lineHeight.relaxed};
  }

  /* Links */
  a {
    color: ${({ theme }) => theme.text.link};
    text-decoration: none;
    transition: color ${({ theme }) => theme.transition.duration.fast} ${({ theme }) => theme.transition.easing.easeInOut};
    
    &:hover {
      color: ${({ theme }) => theme.text.linkHover};
    }
    
    &:focus {
      outline: 2px solid ${({ theme }) => theme.border.focus};
      outline-offset: 2px;
      border-radius: ${({ theme }) => theme.radius.sm};
    }
  }

  /* Form Elements */
  input, textarea, select, button {
    font-family: inherit;
    font-size: inherit;
    line-height: inherit;
  }

  button {
    cursor: pointer;
    border: none;
    background: none;
    
    &:disabled {
      cursor: not-allowed;
      opacity: 0.6;
    }
    
    &:focus {
      outline: 2px solid ${({ theme }) => theme.border.focus};
      outline-offset: 2px;
    }
  }

  input, textarea, select {
    &:focus {
      outline: 2px solid ${({ theme }) => theme.border.focus};
      outline-offset: -2px;
    }
  }

  /* Lists */
  ul, ol {
    padding-left: 1.5em;
    margin-bottom: 1em;
  }

  li {
    margin-bottom: 0.25em;
  }

  /* Images */
  img {
    max-width: 100%;
    height: auto;
    display: block;
  }

  /* Code */
  code, pre {
    font-family: ${({ theme }) => theme.typography.fontFamily.mono};
    font-size: 0.875em;
  }

  code {
    background-color: ${({ theme }) => theme.surface.elevated};
    padding: 0.125em 0.25em;
    border-radius: ${({ theme }) => theme.radius.sm};
    color: ${({ theme }) => theme.text.primary};
  }

  pre {
    background-color: ${({ theme }) => theme.surface.elevated};
    padding: 1em;
    border-radius: ${({ theme }) => theme.radius.md};
    overflow-x: auto;
    margin-bottom: 1em;
    
    code {
      background: none;
      padding: 0;
    }
  }

  /* Scrollbars */
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  ::-webkit-scrollbar-track {
    background: ${({ theme }) => theme.surface.default};
  }

  ::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.border.medium};
    border-radius: ${({ theme }) => theme.radius.full};
    
    &:hover {
      background: ${({ theme }) => theme.border.strong};
    }
  }

  /* Selection */
  ::selection {
    background-color: ${({ theme }) => theme.primary[200]};
    color: ${({ theme }) => theme.primary[900]};
  }

  /* Focus visible for better accessibility */
  :focus-visible {
    outline: 2px solid ${({ theme }) => theme.border.focus};
    outline-offset: 2px;
  }

  /* Utility classes */
  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }

  .container {
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1rem;
    
    @media (min-width: ${({ theme }) => theme.breakpoints.sm}) {
      padding: 0 1.5rem;
    }
    
    @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
      padding: 0 2rem;
    }
  }

  /* Animation utilities */
  .animate-fade-in {
    animation: fadeIn 0.3s ease-out;
  }

  .animate-slide-up {
    animation: slideUp 0.3s ease-out;
  }

  .animate-scale-in {
    animation: scaleIn 0.2s ease-out;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes scaleIn {
    from {
      opacity: 0;
      transform: scale(0.95);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }

  /* Loading spinner animation */
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }

  .animate-spin {
    animation: spin 1s linear infinite;
  }

  /* Pulse animation for loading states */
  @keyframes pulse {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
  }

  .animate-pulse {
    animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  }
`;