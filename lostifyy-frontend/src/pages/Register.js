import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import api from '../utils/api';
import styled, { keyframes } from 'styled-components';
import { FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash, FaCheck, FaPhone } from 'react-icons/fa';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card from '../components/ui/Card';

const Register = () => {
  const { login, user } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate('/items', { replace: true });
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear field error when user starts typing
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const { username, email, password, confirmPassword } = formData;
    const errors = {};
    
    if (!username.trim()) {
      errors.username = 'Username is required';
    } else if (username.length < 3) {
      errors.username = 'Username must be at least 3 characters';
    }
    
    if (!email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = 'Please enter a valid email address';
    }
    
    if (!password) {
      errors.password = 'Password is required';
    } else if (password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }
    
    if (!confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
    } else if (password !== confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      const { confirmPassword, ...userData } = formData;
      const response = await api.post('/api/auth/register', userData);
      
      if (response.data.token) {
        login(response.data.token);
        // The useEffect will handle the redirect when user state updates
      }
    } catch (err) {
      console.error('Registration error:', err);
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
      setIsLoading(false);
    }
  };

  const getPasswordStrength = (password) => {
    if (!password) return { strength: 0, label: '' };
    
    let strength = 0;
    if (password.length >= 6) strength++;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    
    const labels = ['', 'Weak', 'Fair', 'Good', 'Strong', 'Very Strong'];
    return { strength, label: labels[strength] };
  };

  const passwordStrength = getPasswordStrength(formData.password);

  return (
    <AuthContainer>
      <AuthCard>
        <AuthHeader>
          <AuthTitle>Create Your Account</AuthTitle>
          <AuthSubtitle>Join Lostifyy and never lose track of your belongings</AuthSubtitle>
        </AuthHeader>
        
        <AuthForm onSubmit={handleSubmit}>
          {error && (
            <ErrorMessage>
              {error}
            </ErrorMessage>
          )}
          
          <Input
            id="username"
            name="username"
            type="text"
            label="Username"
            placeholder="Choose a username"
            value={formData.username}
            onChange={handleChange}
            leftIcon={<FaUser />}
            error={fieldErrors.username}
            disabled={isLoading}
            required
          />
          
          <Input
            id="email"
            name="email"
            type="email"
            label="Email Address"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            leftIcon={<FaEnvelope />}
            error={fieldErrors.email}
            disabled={isLoading}
            required
          />
          
          <div>
            <Input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              label="Password"
              placeholder="Create a secure password"
              value={formData.password}
              onChange={handleChange}
              leftIcon={<FaLock />}
              rightIcon={
                <PasswordToggle 
                  onClick={() => setShowPassword(!showPassword)}
                  type="button"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </PasswordToggle>
              }
              error={fieldErrors.password}
              disabled={isLoading}
              required
            />
            {formData.password && (
              <PasswordStrength $strength={passwordStrength.strength}>
                <PasswordStrengthBar>
                  {[1, 2, 3, 4, 5].map(level => (
                    <PasswordStrengthSegment 
                      key={level}
                      $active={level <= passwordStrength.strength}
                      $strength={passwordStrength.strength}
                    />
                  ))}
                </PasswordStrengthBar>
                <PasswordStrengthLabel>
                  {passwordStrength.label}
                </PasswordStrengthLabel>
              </PasswordStrength>
            )}
          </div>
          
          <Input
            id="phoneNumber"
            name="phoneNumber"
            type="tel"
            label="Phone Number (Optional)"
            placeholder="Your phone number"
            value={formData.phoneNumber}
            onChange={handleChange}
            leftIcon={<FaPhone />}
            disabled={isLoading}
          />

          <Input
            id="confirmPassword"
            name="confirmPassword"
            type={showConfirmPassword ? 'text' : 'password'}
            label="Confirm Password"
            placeholder="Confirm your password"
            value={formData.confirmPassword}
            onChange={handleChange}
            leftIcon={<FaLock />}
            rightIcon={
              formData.confirmPassword && formData.password === formData.confirmPassword ? (
                <PasswordMatch>
                  <FaCheck />
                </PasswordMatch>
              ) : (
                <PasswordToggle 
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  type="button"
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </PasswordToggle>
              )
            }
            error={fieldErrors.confirmPassword}
            success={formData.confirmPassword && formData.password === formData.confirmPassword}
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
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </Button>
          
          <AuthDivider>
            <span>or</span>
          </AuthDivider>
          
          <Button 
            variant="outline"
            size="lg"
            fullWidth
            as={Link}
            to="/login"
            disabled={isLoading}
          >
            Sign In to Existing Account
          </Button>
        </AuthForm>
        
        <AuthFooter>
          <FooterText>
            By creating an account, you agree to our{' '}
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
  max-width: 480px;
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

const PasswordMatch = styled.div`
  color: ${({ theme }) => theme.success.main};
  display: flex;
  align-items: center;
  justify-content: center;
  
  svg {
    width: 1rem;
    height: 1rem;
  }
`;

const PasswordStrength = styled.div`
  margin-top: 0.5rem;
`;

const PasswordStrengthBar = styled.div`
  display: flex;
  gap: 0.25rem;
  margin-bottom: 0.25rem;
`;

const PasswordStrengthSegment = styled.div`
  height: 0.25rem;
  flex: 1;
  border-radius: ${({ theme }) => theme.radius.sm};
  background-color: ${({ theme, $active, $strength }) => {
    if (!$active) return theme.border.light;
    
    if ($strength <= 1) return theme.error.main;
    if ($strength <= 2) return theme.warning.main;
    if ($strength <= 3) return theme.warning[400];
    if ($strength <= 4) return theme.success[400];
    return theme.success.main;
  }};
  transition: background-color ${({ theme }) => theme.transition.duration.fast} ${({ theme }) => theme.transition.easing.easeInOut};
`;

const PasswordStrengthLabel = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  color: ${({ theme }) => theme.text.tertiary};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
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

export default Register; 