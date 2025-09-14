import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { 
  FaBars, 
  FaTimes, 
  FaHome, 
  FaPlus, 
  FaComments, 
  FaMoon, 
  FaSun,
  FaUser,
  FaSignOutAlt,
  FaSearch
} from 'react-icons/fa';
import styled, { css } from 'styled-components';
import { useTheme } from '../context/ThemeContext';
import MessagesBadge from './messaging/MessagesBadge';

// Styled Components
const Nav = styled.nav`
  background: ${({ theme }) => theme.surface.default};
  backdrop-filter: blur(20px);
  border-bottom: 1px solid ${({ theme }) => theme.border.light};
  position: sticky;
  top: 0;
  z-index: 1000;
  transition: all 0.3s ease;
  
  ${props => props.$scrolled && css`
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    background: ${({ theme }) => theme.surface.default}f8;
  `}
`;

const NavContainer = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 64px;
  
  @media (max-width: 768px) {
    padding: 0 1rem;
    height: 56px;
  }
`;

const NavBrand = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  text-decoration: none;
  color: ${({ theme }) => theme.text.primary};
  font-weight: 700;
  font-size: 1.25rem;
  transition: all 0.2s ease;
  
  &:hover {
    transform: translateY(-1px);
  }
`;

const BrandIcon = styled.div`
  width: 32px;
  height: 32px;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 16px;
  font-weight: bold;
`;

const BrandText = styled.span`
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  
  @media (max-width: 480px) {
    display: none;
  }
`;

const NavCenter = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  @media (max-width: 768px) {
    display: none;
  }
`;

const NavButton = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  text-decoration: none;
  color: ${({ theme }) => theme.text.secondary};
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.2s ease;
  position: relative;
  
  &:hover {
    color: ${({ theme }) => theme.text.primary};
    background: ${({ theme }) => theme.surface.hover};
  }
  
  &.active {
    color: ${({ theme }) => theme.primary.main};
    background: ${({ theme }) => theme.primary.main}10;
  }
  
  svg {
    width: 16px;
    height: 16px;
    opacity: 0.7;
  }
  
  &:hover svg,
  &.active svg {
    opacity: 1;
  }
`;

const NavActions = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    gap: 0.5rem;
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    display: none;
  }
`;

// Right section and user menu trigger
const NavRight = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const IconButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: ${({ theme }) => theme.radius.md};
  border: none;
  background: transparent;
  color: ${({ theme }) => theme.text.primary};
  cursor: pointer;
  transition: background 0.2s ease, color 0.2s ease;

  &:hover {
    background: ${({ theme }) => theme.surface.hover};
    color: ${({ theme }) => theme.primary.main};
  }
`;

const MobileMenuButton = styled.button`
  display: none;
  cursor: pointer;
  font-size: 1.25rem;
  color: ${({ theme }) => theme.text.primary};
  padding: 0.5rem;
  border-radius: ${({ theme }) => theme.radius.md};
  transition: all ${({ theme }) => theme.transition.duration.fast} ${({ theme }) => theme.transition.easing.easeInOut};
  background: none;
  border: none;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  &:hover {
    background-color: ${({ theme }) => theme.surface.hover};
    color: ${({ theme }) => theme.primary.main};
  }
`;

const MobileMenu = styled.div`
  display: none;
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: ${({ theme }) => theme.surface.default};
  backdrop-filter: blur(10px);
  box-shadow: ${({ theme }) => theme.shadow.xl};
  border-top: 1px solid ${({ theme }) => theme.border.light};
  z-index: ${({ theme }) => theme.zIndex.dropdown};
  max-height: 0;
  overflow: hidden;
  opacity: 0;
  transform: translateY(-10px);
  transition: all ${({ theme }) => theme.transition.duration.normal} ${({ theme }) => theme.transition.easing.easeInOut};
  
  ${props => props.$isOpen && css`
    display: block;
    max-height: 100vh;
    opacity: 1;
    transform: translateY(0);
    padding: 1rem 0;
  `}
  
  a, button {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    width: 100%;
    padding: 1rem 1.5rem;
    text-align: left;
    color: ${({ theme }) => theme.text.secondary};
    font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
    transition: all ${({ theme }) => theme.transition.duration.fast} ${({ theme }) => theme.transition.easing.easeInOut};
    border: none;
    background: none;
    cursor: pointer;
    font-size: ${({ theme }) => theme.typography.fontSize.base};
    text-decoration: none;
    
    &:hover, &.active {
      background: ${({ theme }) => theme.primary[50]};
      color: ${({ theme }) => theme.primary.main};
      padding-left: 2rem;
    }
    
    .nav-icon {
      width: 1.25rem;
      display: flex;
      justify-content: center;
      opacity: 0.8;
      transition: opacity ${({ theme }) => theme.transition.duration.fast} ${({ theme }) => theme.transition.easing.easeInOut};
    }
    
    &:hover .nav-icon,
    &.active .nav-icon {
      opacity: 1;
    }
  }
  
  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    display: none !important;
  }
`;

// User menu styled components
const UserMenu = styled.div`
  position: relative;
`;

const UserButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: none;
  background: transparent;
  cursor: pointer;
  &:hover {
    background: ${({ theme }) => theme.surface.hover};
  }
`;

const Avatar = styled.div`
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  color: white;
  font-weight: 700;
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const UserDropdown = styled.div`
  position: absolute;
  top: 110%;
  right: 0;
  min-width: 180px;
  background: ${({ theme }) => theme.surface.default};
  border: 1px solid ${({ theme }) => theme.border.light};
  box-shadow: ${({ theme }) => theme.shadow.lg};
  border-radius: ${({ theme }) => theme.radius.lg};
  padding: 0.5rem;
  display: none;

  ${props => props.$isOpen && css`
    display: block;
  `}
`;

const DropdownItem = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  border: none;
  background: transparent;
  color: ${({ theme }) => theme.text.secondary};
  border-radius: ${({ theme }) => theme.radius.md};
  cursor: pointer;
  &:hover {
    background: ${({ theme }) => theme.surface.hover};
    color: ${({ theme }) => theme.text.primary};
  }
`;

// Mobile menu helper components
const MobileMenuItem = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 1.5rem;
  text-decoration: none;
  color: ${({ theme }) => theme.text.secondary};
  &:hover, &.active {
    background: ${({ theme }) => theme.surface.hover};
    color: ${({ theme }) => theme.text.primary};
  }
`;

const MobileDivider = styled.div`
  height: 1px;
  background: ${({ theme }) => theme.border.light};
  margin: 0.5rem 0;
`;

const MobileMenuButton2 = styled.button`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
  padding: 1rem 1.5rem;
  border: none;
  background: transparent;
  color: ${({ theme }) => theme.text.secondary};
  text-align: left;
  cursor: pointer;
  &:hover {
    background: ${({ theme }) => theme.surface.hover};
    color: ${({ theme }) => theme.text.primary};
  }
`;

const MobileAuth = styled.div`
  margin-top: 1rem;
  border-top: 1px solid ${({ theme }) => theme.border.light};
  padding: 1rem 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const MobileThemeToggle = styled.div`
  padding: 1rem 1.5rem;
  border-top: 1px solid ${({ theme }) => theme.border.light};
  display: flex;
  align-items: center;
  justify-content: space-between;
  
  span {
    font-size: ${({ theme }) => theme.typography.fontSize.sm};
    font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
    color: ${({ theme }) => theme.text.secondary};
  }
`;

const Navbar = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  const { token, logout, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Add scroll effect to navbar
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleMobileMenu = () => setMobileMenuOpen(prev => !prev);
  const toggleUserMenu = () => setIsUserMenuOpen(prev => !prev);

  const getUserInitials = () => {
    if (!user) return '?';
    const name = user.username || user.email || '';
    const parts = name.trim().split(/[\s._-]+/).filter(Boolean);
    if (parts.length === 0) return (name[0] || '?').toUpperCase();
    const first = parts[0][0] || '';
    const last = parts.length > 1 ? (parts[parts.length - 1][0] || '') : '';
    return (first + last).toUpperCase();
  };

  // Check if a nav link is active
  const isActive = (path) => {
    return location.pathname === path || 
           (path !== '/' && location.pathname.startsWith(path));
  };

  return (
    <Nav $scrolled={isScrolled}>
      <NavContainer>
        {/* Brand */}
        <NavBrand to="/">
          <BrandIcon>L</BrandIcon>
          <BrandText>LOSTIFY</BrandText>
        </NavBrand>

        {/* Center Navigation - Desktop Only */}
        {token && (
          <NavCenter>
            <NavButton 
              to="/items" 
              className={isActive('/items') ? 'active' : ''}
            >
              <FaHome />
              <span>Home</span>
            </NavButton>
            <NavButton 
              to="/items/lost" 
              className={isActive('/items/lost') ? 'active' : ''}
            >
              <FaPlus />
              <span>Report Lost</span>
            </NavButton>
            <NavButton 
              to="/items/found" 
              className={isActive('/items/found') ? 'active' : ''}
            >
              <FaPlus />
              <span>Report Found</span>
            </NavButton>
            <MessagesBadge>
              <NavButton 
                to="/messages" 
                className={isActive('/messages') ? 'active' : ''}
              >
                <FaComments />
                <span>Messages</span>
              </NavButton>
            </MessagesBadge>
          </NavCenter>
        )}

        {/* Right Actions */}
        <NavRight>
          {/* Theme Toggle */}
          <IconButton onClick={toggleTheme} title="Toggle theme">
            {isDarkMode ? <FaSun /> : <FaMoon />}
          </IconButton>

          {token ? (
            /* User Menu */
            <UserMenu data-user-menu>
              <UserButton onClick={toggleUserMenu}>
                <Avatar>{getUserInitials()}</Avatar>
              </UserButton>
              <UserDropdown $isOpen={isUserMenuOpen}>
                <DropdownItem onClick={() => navigate('/profile')}>
                  <FaUser />
                  Profile
                </DropdownItem>
                <DropdownItem onClick={handleLogout}>
                  <FaSignOutAlt />
                  Sign Out
                </DropdownItem>
              </UserDropdown>
            </UserMenu>
          ) : (
            /* Auth Buttons for Non-authenticated Users */
            <>
              <NavButton to="/login">Login</NavButton>
              <NavButton 
                to="/register" 
                style={{ 
                  background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                  color: 'white'
                }}
              >
                Sign Up
              </NavButton>
            </>
          )}

          {/* Mobile Menu Button */}
          <MobileMenuButton onClick={toggleMobileMenu}>
            {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
          </MobileMenuButton>
        </NavRight>
      </NavContainer>

      {/* Mobile Menu */}
      <MobileMenu $isOpen={isMobileMenuOpen}>
        {token ? (
          <>
            <MobileMenuItem 
              to="/items" 
              className={isActive('/items') ? 'active' : ''}
              onClick={() => setMobileMenuOpen(false)}
            >
              <FaHome />
              Home
            </MobileMenuItem>
            <MobileMenuItem 
              to="/items/lost" 
              className={isActive('/items/lost') ? 'active' : ''}
              onClick={() => setMobileMenuOpen(false)}
            >
              <FaSearch />
              Report Lost
            </MobileMenuItem>
            <MobileMenuItem 
              to="/items/found" 
              className={isActive('/items/found') ? 'active' : ''}
              onClick={() => setMobileMenuOpen(false)}
            >
              <FaPlus />
              Report Found
            </MobileMenuItem>
            <MobileMenuItem 
              to="/messages" 
              className={isActive('/messages') ? 'active' : ''}
              onClick={() => setMobileMenuOpen(false)}
            >
              <FaComments />
              Messages
            </MobileMenuItem>
            <MobileDivider />
            <MobileMenuButton2 onClick={handleLogout}>
              <FaSignOutAlt />
              Sign Out
            </MobileMenuButton2>
          </>
        ) : (
          <>
            <MobileMenuItem 
              to="/login"
              onClick={() => setMobileMenuOpen(false)}
            >
              <FaUser />
              Login
            </MobileMenuItem>
            <MobileMenuItem 
              to="/register"
              onClick={() => setMobileMenuOpen(false)}
            >
              <FaPlus />
              Sign Up
            </MobileMenuItem>
          </>
        )}
      </MobileMenu>
    </Nav>
  );
};

export default Navbar;