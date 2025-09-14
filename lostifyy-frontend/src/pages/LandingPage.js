import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { UniversityContext } from '../context/UniversityContext';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import styled, { keyframes } from 'styled-components';
import { FaPlus, FaSearch, FaShieldAlt, FaBolt, FaUsers, FaGraduationCap, FaArrowRight } from 'react-icons/fa';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';

// --- UniversitySelector Component ---
// For simplicity, I've merged this component here.
// In a larger app, you would keep this in its own file.
const UniversitySelector = () => {
  const [universities, setUniversities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { setSelectedUniversityId } = useContext(UniversityContext);

  useEffect(() => {
    const fetchUniversities = async () => {
      try {
        const res = await api.get('/api/universities');
        setUniversities(res.data);
      } catch (err) {
        setError('Failed to load universities.');
      } finally {
        setLoading(false);
      }
    };
    fetchUniversities();
  }, []);

  const handleSelect = (universityId) => {
    setSelectedUniversityId(universityId);
    navigate('/items');
  };
  
  if (loading) return <LoadingMessage>Loading Universities...</LoadingMessage>;
  if (error) return <ErrorMessage>{error}</ErrorMessage>;

  return (
    <UniversitySelectorContainer>
      <UniversityGrid>
        {universities.map((university) => (
          <UniversityCard 
            key={university.id}
            onClick={() => handleSelect(university.id)}
            size="sm"
            interactive
          >
            <UniversityCardContent>
              <UniversityInitial>{university.name.charAt(0)}</UniversityInitial>
              <UniversityInfo>
                <h4>{university.name}</h4>
                {university.location && <Location>{university.location}</Location>}
              </UniversityInfo>
            </UniversityCardContent>
          </UniversityCard>
        ))}
        <AddUniversityCard 
          onClick={() => navigate('/universities/add')}
          size="sm"
          interactive
        >
          <UniversityCardContent>
            <AddUniversityInitial><FaPlus /></AddUniversityInitial>
            <UniversityInfo>
              <h4>Add University</h4>
              <Location>Is yours missing?</Location>
            </UniversityInfo>
          </UniversityCardContent>
        </AddUniversityCard>
      </UniversityGrid>
    </UniversitySelectorContainer>
  );
};


// --- LandingPage Component ---
const LandingPage = () => {
  const { user } = useAuth();

  return (
    <LandingBackground>
      {/* Hero Section */}
      <HeroSection>
        <HeroContent>
          <HeroTitle>
            Reunite with Your Belongings
            <HeroHighlight>Lost & Found, Simplified</HeroHighlight>
          </HeroTitle>
          <HeroDescription>
            Lostifyy connects students, faculty, and staff to help recover lost items quickly and securely. 
            Join thousands of users who have successfully reunited with their belongings.
          </HeroDescription>
          
          {user ? (
            <HeroActions>
              <Button 
                variant="primary" 
                size="lg"
                as={Link}
                to="/items"
              >
                Go to Dashboard
                <FaArrowRight />
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                as={Link}
                to="/items/lost"
              >
                Report Lost Item
              </Button>
            </HeroActions>
          ) : (
            <HeroActions>
              <Button 
                variant="primary" 
                size="lg"
                as={Link}
                to="/register"
              >
                Get Started Free
                <FaArrowRight />
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                as={Link}
                to="/login"
              >
                Sign In
              </Button>
            </HeroActions>
          )}
          
          <HeroBadges>
            <Badge variant="ghost" size="sm">
              <FaShieldAlt />
              Secure & Private
            </Badge>
            <Badge variant="ghost" size="sm">
              <FaBolt />
              Fast Matching
            </Badge>
            <Badge variant="ghost" size="sm">
              <FaUsers />
              Community Driven
            </Badge>
          </HeroBadges>
        </HeroContent>
        
        <HeroVisual>
          <HeroCard>
            <SearchIcon>
              <FaSearch />
            </SearchIcon>
            <HeroCardContent>
              <h4>Find Your Items</h4>
              <p>Advanced search and matching algorithms help you locate your belongings faster than ever.</p>
            </HeroCardContent>
          </HeroCard>
        </HeroVisual>
      </HeroSection>

      {/* University Selection Section */}
      {!user && (
        <UniversitySection>
          <SectionHeader>
            <SectionTitle>Choose Your University</SectionTitle>
            <SectionDescription>
              Get started by selecting your institution to connect with your campus community
            </SectionDescription>
          </SectionHeader>
          <UniversitySelector />
        </UniversitySection>
      )}

      {/* Features Section */}
      <FeaturesSection>
        <SectionHeader>
          <SectionTitle>Why Choose Lostifyy?</SectionTitle>
          <SectionDescription>
            Built specifically for educational institutions with features that matter
          </SectionDescription>
        </SectionHeader>
        
        <FeaturesGrid>
          <FeatureCard>
            <FeatureIcon>
              <FaSearch />
            </FeatureIcon>
            <FeatureContent>
              <h3>Smart Search</h3>
              <p>Advanced algorithms match lost and found items based on descriptions, locations, and timestamps.</p>
            </FeatureContent>
          </FeatureCard>
          
          <FeatureCard>
            <FeatureIcon>
              <FaShieldAlt />
            </FeatureIcon>
            <FeatureContent>
              <h3>Secure Platform</h3>
              <p>Your personal information is protected with enterprise-grade security and privacy controls.</p>
            </FeatureContent>
          </FeatureCard>
          
          <FeatureCard>
            <FeatureIcon>
              <FaBolt />
            </FeatureIcon>
            <FeatureContent>
              <h3>Instant Notifications</h3>
              <p>Get notified immediately when potential matches are found for your lost items.</p>
            </FeatureContent>
          </FeatureCard>
          
          <FeatureCard>
            <FeatureIcon>
              <FaGraduationCap />
            </FeatureIcon>
            <FeatureContent>
              <h3>Campus Focused</h3>
              <p>Designed specifically for university environments with location-based organization.</p>
            </FeatureContent>
          </FeatureCard>
        </FeaturesGrid>
      </FeaturesSection>

      {/* CTA Section */}
      <CTASection>
        <CTAContent>
          <CTATitle>Ready to Get Started?</CTATitle>
          <CTADescription>
            Join your campus community and never lose track of your belongings again.
          </CTADescription>
          <CTAActions>
            {user ? (
              <Button 
                variant="primary" 
                size="lg"
                as={Link}
                to="/items"
              >
                Go to Dashboard
              </Button>
            ) : (
              <>
                <Button 
                  variant="primary" 
                  size="lg"
                  as={Link}
                  to="/register"
                >
                  Sign Up Now
                </Button>
                <Button 
                  variant="ghost" 
                  size="lg"
                  as={Link}
                  to="/login"
                >
                  Already have an account?
                </Button>
              </>
            )}
          </CTAActions>
        </CTAContent>
      </CTASection>
    </LandingBackground>
  );
};

// Animations
const fadeIn = keyframes`
  from { 
    opacity: 0; 
    transform: translateY(20px);
  }
  to { 
    opacity: 1; 
    transform: translateY(0);
  }
`;

const float = keyframes`
  0%, 100% { 
    transform: translateY(0px); 
  }
  50% { 
    transform: translateY(-10px); 
  }
`;

const pulse = keyframes`
  0%, 100% { 
    opacity: 1; 
  }
  50% { 
    opacity: 0.8; 
  }
`;

const slideIn = keyframes`
  from {
    transform: scaleX(0);
  }
  to {
    transform: scaleX(1);
  }
`;

// Layout Components
const LandingBackground = styled.div`
  background: ${({ theme }) => theme.background.default};
  color: ${({ theme }) => theme.text.primary};
  min-height: 100vh;
  overflow-x: hidden;
`;

// Unused styled components are commented out
/*
const Navbar = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid ${theme.borderColor};
  position: sticky;
  top: 0;
  z-index: 50;

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const Logo = styled.div`
  font-size: 1.75rem;
  font-weight: 800;
  color: ${theme.primaryBrand};
`;

const NavLinks = styled.div`
  display: flex;
  gap: 2rem;
  margin: 0 auto;
  
  @media (max-width: 768px) {
    display: none;
  }
`;

const NavLink = styled.a`
  font-weight: 500;
  color: ${theme.textSecondary};
  text-decoration: none;
  transition: color 0.2s;
  
  &:hover {
    color: ${theme.primaryBrand};
  }
`;

const AuthButtons = styled.div`
  display: flex;
  gap: 1rem;
  
  @media (max-width: 480px) {
    gap: 0.5rem;
  }
`;

const ButtonBase = styled(Link)`
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
`;

const LoginButton = styled(ButtonBase)`
  background: transparent;
  color: ${theme.primaryBrand};
  
  &:hover {
    background: ${theme.primaryLight};
  }
  
  @media (max-width: 480px) {
    padding: 0.5rem 0.75rem;
    font-size: 0.875rem;
  }
`;

const GetStartedButton = styled(ButtonBase)`
  background: ${theme.primaryBrand};
  color: white;
  
  &:hover {
    background: ${theme.primaryDark};
    transform: translateY(-2px);
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  }
  
  @media (max-width: 480px) {
    padding: 0.5rem 0.75rem;
    font-size: 0.875rem;
  }
`;
*/

// Hero Section
const HeroSection = styled.section`
  padding: 8rem 2rem 6rem;
  max-width: 1400px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 6rem;
  align-items: center;
  min-height: 90vh;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: 
      radial-gradient(circle at 20% 80%, ${({ theme }) => theme.primary[100]}40, transparent 50%),
      radial-gradient(circle at 80% 20%, ${({ theme }) => theme.secondary[100]}40, transparent 50%),
      radial-gradient(circle at 40% 40%, ${({ theme }) => theme.accent[100]}20, transparent 50%);
    pointer-events: none;
    z-index: -1;
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    grid-template-columns: 1fr;
    gap: 4rem;
    text-align: center;
    padding: 6rem 1.5rem 4rem;
    min-height: auto;
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    padding: 4rem 1rem 3rem;
    gap: 3rem;
  }
`;

const HeroContent = styled.div`
  animation: ${fadeIn} 0.8s ease-out;
`;

const HeroTitle = styled.h1`
  font-size: ${({ theme }) => theme.typography.fontSize['6xl']};
  font-weight: ${({ theme }) => theme.typography.fontWeight.black};
  line-height: ${({ theme }) => theme.typography.lineHeight.tight};
  margin-bottom: 2rem;
  color: ${({ theme }) => theme.text.primary};
  letter-spacing: -0.025em;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    font-size: ${({ theme }) => theme.typography.fontSize['5xl']};
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    font-size: ${({ theme }) => theme.typography.fontSize['4xl']};
  }
`;

const HeroHighlight = styled.span`
  display: block;
  margin-top: 1rem;
  background: linear-gradient(135deg, ${({ theme }) => theme.primary.main}, ${({ theme }) => theme.secondary.main}, ${({ theme }) => theme.accent.main});
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  background-size: 200% 200%;
  animation: ${pulse} 4s ease-in-out infinite;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -0.5rem;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, ${({ theme }) => theme.primary.main}, ${({ theme }) => theme.secondary.main});
    border-radius: ${({ theme }) => theme.radius.full};
    transform: scaleX(0);
    animation: ${slideIn} 1s ease-out 0.5s forwards;
  }
`;

const HeroDescription = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  color: ${({ theme }) => theme.text.secondary};
  line-height: ${({ theme }) => theme.typography.lineHeight.relaxed};
  margin-bottom: 2rem;
  max-width: 500px;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    max-width: 600px;
    margin: 0 auto 2rem;
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    font-size: ${({ theme }) => theme.typography.fontSize.base};
  }
`;

const HeroActions = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    justify-content: center;
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    flex-direction: column;
    align-items: center;
    
    > * {
      width: 100%;
      max-width: 280px;
    }
  }
`;

const HeroBadges = styled.div`
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    justify-content: center;
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    gap: 0.5rem;
  }
`;

const HeroVisual = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  animation: ${fadeIn} 1s ease-out 0.3s both;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    order: -1;
  }
`;

const HeroCard = styled(Card)`
  max-width: 450px;
  animation: ${float} 8s ease-in-out infinite;
  background: ${({ theme }) => theme.surface.default};
  border: 1px solid ${({ theme }) => theme.border.light};
  box-shadow: ${({ theme }) => theme.shadow['2xl']};
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, ${({ theme }) => theme.primary.main}, ${({ theme }) => theme.secondary.main}, ${({ theme }) => theme.accent.main});
  }
  
  &::after {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: 
      radial-gradient(circle, ${({ theme }) => theme.primary[100]}20, transparent 70%),
      radial-gradient(circle, ${({ theme }) => theme.secondary[100]}20, transparent 70%);
    animation: ${float} 10s ease-in-out infinite reverse;
    z-index: -1;
  }
`;

const SearchIcon = styled.div`
  width: 4rem;
  height: 4rem;
  background: linear-gradient(135deg, ${({ theme }) => theme.primary.main}, ${({ theme }) => theme.secondary.main});
  border-radius: ${({ theme }) => theme.radius.xl};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
  
  svg {
    width: 1.5rem;
    height: 1.5rem;
    color: white;
  }
`;

const HeroCardContent = styled.div`
  h4 {
    font-size: ${({ theme }) => theme.typography.fontSize.lg};
    font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
    color: ${({ theme }) => theme.text.primary};
    margin-bottom: 0.5rem;
  }
  
  p {
    color: ${({ theme }) => theme.text.secondary};
    line-height: ${({ theme }) => theme.typography.lineHeight.relaxed};
    margin: 0;
  }
`;

// University Section
const UniversitySection = styled.section`
  padding: 4rem 2rem;
  background: ${({ theme }) => theme.surface.elevated};
  border-top: 1px solid ${({ theme }) => theme.border.light};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    padding: 3rem 1rem;
  }
`;

// Features Section
const FeaturesSection = styled.section`
  padding: 6rem 2rem;
  max-width: 1200px;
  margin: 0 auto;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    padding: 4rem 1rem;
  }
`;

const SectionHeader = styled.div`
  text-align: center;
  margin-bottom: 4rem;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    margin-bottom: 3rem;
  }
`;

const SectionTitle = styled.h2`
  font-size: ${({ theme }) => theme.typography.fontSize['3xl']};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.text.primary};
  margin-bottom: 1rem;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    font-size: ${({ theme }) => theme.typography.fontSize['2xl']};
  }
`;

const SectionDescription = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  color: ${({ theme }) => theme.text.secondary};
  max-width: 600px;
  margin: 0 auto;
  line-height: ${({ theme }) => theme.typography.lineHeight.relaxed};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    font-size: ${({ theme }) => theme.typography.fontSize.base};
  }
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
`;

const FeatureCard = styled(Card)`
  text-align: center;
  transition: all ${({ theme }) => theme.transition.duration.normal} ${({ theme }) => theme.transition.easing.easeInOut};
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: ${({ theme }) => theme.shadow.lg};
  }
`;

const FeatureIcon = styled.div`
  width: 3rem;
  height: 3rem;
  background: ${({ theme }) => theme.primary[100]};
  color: ${({ theme }) => theme.primary.main};
  border-radius: ${({ theme }) => theme.radius.lg};
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem;
  
  svg {
    width: 1.25rem;
    height: 1.25rem;
  }
`;

const FeatureContent = styled.div`
  h3 {
    font-size: ${({ theme }) => theme.typography.fontSize.lg};
    font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
    color: ${({ theme }) => theme.text.primary};
    margin-bottom: 0.75rem;
  }
  
  p {
    color: ${({ theme }) => theme.text.secondary};
    line-height: ${({ theme }) => theme.typography.lineHeight.relaxed};
    margin: 0;
  }
`;

// CTA Section
const CTASection = styled.section`
  padding: 6rem 2rem;
  background: ${({ theme }) => theme.surface.elevated};
  border-top: 1px solid ${({ theme }) => theme.border.light};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    padding: 4rem 1rem;
  }
`;

const CTAContent = styled.div`
  max-width: 600px;
  margin: 0 auto;
  text-align: center;
`;

const CTATitle = styled.h2`
  font-size: ${({ theme }) => theme.typography.fontSize['3xl']};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.text.primary};
  margin-bottom: 1rem;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    font-size: ${({ theme }) => theme.typography.fontSize['2xl']};
  }
`;

const CTADescription = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  color: ${({ theme }) => theme.text.secondary};
  margin-bottom: 2rem;
  line-height: ${({ theme }) => theme.typography.lineHeight.relaxed};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    font-size: ${({ theme }) => theme.typography.fontSize.base};
  }
`;

const CTAActions = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    flex-direction: column;
    align-items: center;
    
    > * {
      width: 100%;
      max-width: 280px;
    }
  }
`;

// University Selector Components
const UniversitySelectorContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
`;

const LoadingMessage = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  color: ${({ theme }) => theme.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSize.base};
`;

const ErrorMessage = styled.div`
  background: ${({ theme }) => theme.error[50]};
  color: ${({ theme }) => theme.error[700]};
  border: 1px solid ${({ theme }) => theme.error[200]};
  border-radius: ${({ theme }) => theme.radius.lg};
  padding: 1rem 1.5rem;
  margin: 1rem 0;
  text-align: center;
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
`;

const UniversityGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
`;

const UniversityCard = styled(Card)`
  cursor: pointer;
  transition: all ${({ theme }) => theme.transition.duration.normal} ${({ theme }) => theme.transition.easing.spring};
  border: 2px solid ${({ theme }) => theme.border.light};
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, ${({ theme }) => theme.primary[50]}, transparent);
    transition: left ${({ theme }) => theme.transition.duration.slow} ${({ theme }) => theme.transition.easing.easeInOut};
  }
  
  &:hover {
    transform: translateY(-6px);
    box-shadow: ${({ theme }) => theme.shadow.xl};
    border-color: ${({ theme }) => theme.primary.main};
    
    &::before {
      left: 100%;
    }
  }
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 4px ${({ theme }) => theme.primary[200]};
  }
  
  &:active {
    transform: translateY(-2px);
  }
`;

const UniversityCardContent = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  width: 100%;
`;

const UniversityInitial = styled.div`
  width: 3.5rem;
  height: 3.5rem;
  flex-shrink: 0;
  border-radius: ${({ theme }) => theme.radius['2xl']};
  background: linear-gradient(135deg, ${({ theme }) => theme.primary[100]}, ${({ theme }) => theme.secondary[100]});
  color: ${({ theme }) => theme.primary.main};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${({ theme }) => theme.typography.fontSize.xl};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  box-shadow: ${({ theme }) => theme.shadow.md};
  transition: all ${({ theme }) => theme.transition.duration.normal} ${({ theme }) => theme.transition.easing.spring};
  
  ${UniversityCard}:hover & {
    transform: scale(1.1);
    box-shadow: ${({ theme }) => theme.shadow.lg};
  }
`;

const UniversityInfo = styled.div`
  text-align: left;
  flex: 1;
  
  h4 {
    font-size: ${({ theme }) => theme.typography.fontSize.base};
    font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
    color: ${({ theme }) => theme.text.primary};
    margin: 0 0 0.25rem 0;
    line-height: ${({ theme }) => theme.typography.lineHeight.tight};
  }
`;

const Location = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.text.secondary};
  margin: 0;
  line-height: ${({ theme }) => theme.typography.lineHeight.normal};
`;

const AddUniversityCard = styled(UniversityCard)`
  border: 2px dashed ${({ theme }) => theme.border.medium};
  background: ${({ theme }) => theme.surface.elevated};
  
  &:hover {
    border-color: ${({ theme }) => theme.primary.main};
    background: ${({ theme }) => theme.primary[25]};
  }
`;

const AddUniversityInitial = styled(UniversityInitial)`
  background: ${({ theme }) => theme.gray[100]};
  color: ${({ theme }) => theme.gray[500]};
`;

export default LandingPage;
