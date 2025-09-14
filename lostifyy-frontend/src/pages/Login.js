import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import api from '../utils/api';
import styled, { keyframes } from 'styled-components';
import { FaUser, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card from '../components/ui/Card';

const Login = () => {
  const { login, user } = useContext(AuthContext);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
    
  const from = location.state?.from?.pathname || '/items';

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate(from, { replace: true });
    }
  }, [user, navigate, from]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!username || !password) {
      setError('Please fill in all fields.');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const response = await api.post('/api/auth/login', { username, password });
      login(response.data.token);
      
      // Get the returnTo URL from query params or use the default
      const queryParams = new URLSearchParams(window.location.search);
      const returnTo = queryParams.get('returnTo') || '/items';
      
      // Wait for the next tick to ensure the auth state is updated
      setTimeout(() => {
        navigate(returnTo, { replace: true });
      }, 0);
      
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.message || 'Invalid username or password. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <AuthContainer>
      <AuthCard>
        <AuthHeader>
          <AuthTitle>Welcome Back</AuthTitle>
          <AuthSubtitle>Sign in to your Lostifyy account</AuthSubtitle>
        </AuthHeader>
        
        <AuthForm onSubmit={handleSubmit}>
          {error && (
            <ErrorMessage>
              {error}
            </ErrorMessage>
          )}
          
          <Input
            id="username"
            type="text"
            label="Username"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            leftIcon={<FaUser />}
            error={error && !username ? 'Username is required' : ''}
            disabled={isLoading}
            required
          />
          
          <Input
            id="password"
            type={showPassword ? 'text' : 'password'}
            label="Password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            leftIcon={<FaLock />}
            rightIcon={
              <PasswordToggle 
                onClick={() => setShowPassword(!showPassword)}
                type="button"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </PasswordToggle>
            }
            error={error && !password ? 'Password is required' : ''}
            disabled={isLoading}
            required
          />
          
          <Button 
            type="submit" 
            variant="primary"
            size="lg"
            fullWidth
            loading={isLoading}
            disabled={isLoading}
          >
            {isLoading ? 'Signing In...' : 'Sign In'}
          </Button>
          
          <AuthDivider>
            <span>or</span>
          </AuthDivider>
          
          <Button 
            variant="outline"
            size="lg"
            fullWidth
            as={Link}
            to="/register"
            disabled={isLoading}
          >
            Create New Account
          </Button>
        </AuthForm>
        
        <AuthFooter>
          <FooterText>
            By signing in, you agree to our{' '}
            <FooterLink href="#" onClick={(e) => e.preventDefault()}>
              Terms of Service
            </FooterLink>{' '}
            and{' '}
            <FooterLink href="#" onClick={(e) => e.preventDefault()}>
              Privacy Policy
            </FooterLink>
          </FooterText>
        </AuthFooter>
      </AuthCard>
    </AuthContainer>
  );
};

// Styled Components
const slideUp = keyframes`
  from { 
    opacity: 0; 
    transform: translateY(30px);
  }
  to { 
    opacity: 1; 
    transform: translateY(0);
  }
`;

const AuthContainer = styled.div`
  min-height: calc(100vh - 80px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 1rem;
  background: ${({ theme }) => theme.background.default};
`;

const AuthCard = styled(Card)`
  width: 100%;
  max-width: 420px;
  animation: ${slideUp} 0.6s ease-out;
  box-shadow: ${({ theme }) => theme.shadow.xl};
  border: 1px solid ${({ theme }) => theme.border.light};
`;

const AuthHeader = styled.div`
  text-align: center;
  margin-bottom: 2rem;
`;

const AuthTitle = styled.h1`
  font-size: ${({ theme }) => theme.typography.fontSize['2xl']};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.text.primary};
  margin-bottom: 0.5rem;
`;

const AuthSubtitle = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  color: ${({ theme }) => theme.text.secondary};
  margin: 0;
`;

const AuthForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const ErrorMessage = styled.div`
  background: ${({ theme }) => theme.error[50]};
  color: ${({ theme }) => theme.error[700]};
  border: 1px solid ${({ theme }) => theme.error[200]};
  border-radius: ${({ theme }) => theme.radius.md};
  padding: 0.75rem 1rem;
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
`;

const PasswordToggle = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.text.tertiary};
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color ${({ theme }) => theme.transition.duration.fast} ${({ theme }) => theme.transition.easing.easeInOut};
  
  &:hover {
    color: ${({ theme }) => theme.text.secondary};
  }
  
  svg {
    width: 1rem;
    height: 1rem;
  }
`;

const AuthDivider = styled.div`
  position: relative;
  text-align: center;
  margin: 0.5rem 0;
  
  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    height: 1px;
    background: ${({ theme }) => theme.border.default};
  }
  
  span {
    background: ${({ theme }) => theme.surface.default};
    color: ${({ theme }) => theme.text.tertiary};
    font-size: ${({ theme }) => theme.typography.fontSize.sm};
    padding: 0 1rem;
    position: relative;
  }
`;

const AuthFooter = styled.div`
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid ${({ theme }) => theme.border.light};
`;

const FooterText = styled.p`
  text-align: center;
  color: ${({ theme }) => theme.text.tertiary};
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  line-height: ${({ theme }) => theme.typography.lineHeight.relaxed};
  margin: 0;
`;

const FooterLink = styled.a`
  color: ${({ theme }) => theme.primary.main};
  text-decoration: none;
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  
  &:hover {
    text-decoration: underline;
  }
`;

export default Login; 