import React, { useState, useEffect, useMemo, useCallback, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaSearch, 
  FaPlus, 
  FaExclamationTriangle, 
  FaTag, 
  FaImage,
  FaUniversity,
  FaFilter,
  FaSortAmountDown,
  FaMapMarkerAlt,
  FaClock,
  FaPhone,
  FaUser,
  FaComments,
  FaEnvelope,
  FaTrash
} from 'react-icons/fa';
import styled, { keyframes, css } from 'styled-components';
import api from '../utils/api';
import { UniversityContext } from '../context/UniversityContext';
import useUniversities from '../hooks/useUniversities';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';

// --- Advanced Animations ---
const fadeInUp = keyframes`
  0% {
    opacity: 0;
    transform: translateY(40px) scale(0.95);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
`;

const slideInFromLeft = keyframes`
  0% {
    opacity: 0;
    transform: translateX(-30px);
  }
  100% {
    opacity: 1;
    transform: translateX(0);
  }
`;

const pulse = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
`;

const shimmer = keyframes`
  0% { background-position: -200px 0; }
  100% { background-position: calc(200px + 100%) 0; }
`;

const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-6px); }
`;

const ripple = keyframes`
  0% {
    transform: scale(0);
    opacity: 1;
  }
  100% {
    transform: scale(4);
    opacity: 0;
  }
`;

const gradientShift = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const bounceIn = keyframes`
  0% {
    opacity: 0;
    transform: scale(0.3) rotate(-10deg);
  }
  50% {
    opacity: 1;
    transform: scale(1.05) rotate(5deg);
  }
  70% {
    transform: scale(0.95) rotate(-2deg);
  }
  100% {
    opacity: 1;
    transform: scale(1) rotate(0deg);
  }
`;

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

// --- Modern Styled Components ---
const Container = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem 1.5rem 4rem;
  animation: ${fadeInUp} 0.8s ease-out;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 200px;
    background: linear-gradient(135deg, 
      rgba(99, 102, 241, 0.05) 0%, 
      rgba(168, 85, 247, 0.05) 100%);
    border-radius: 0 0 50px 50px;
    z-index: -1;
  }
`;

const Header = styled.header`
  margin-bottom: 3rem;
  animation: ${slideInFromLeft} 0.6s ease-out 0.2s both;
  
  .university-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
    flex-wrap: wrap;
    gap: 1.5rem;
  }
  
  h1 {
    font-size: clamp(2rem, 4vw, 3rem);
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    font-weight: 800;
    position: relative;
    
    &::after {
      content: '';
      position: absolute;
      bottom: -8px;
      left: 0;
      width: 60px;
      height: 4px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 2px;
      animation: ${shimmer} 3s ease-in-out infinite;
    }
  }
  
  .university-badge {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
    color: #475569;
    padding: 0.75rem 1.5rem;
    border-radius: 50px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
    border: 1px solid rgba(255, 255, 255, 0.2);
    position: relative;
    overflow: hidden;
    
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, 
        transparent, 
        rgba(103, 126, 234, 0.1), 
        transparent
      );
      transition: left 0.5s;
    }
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 30px rgba(103, 126, 234, 0.2);
      
      &::before {
        left: 100%;
      }
    }
    
    &:active {
      transform: translateY(0);
    }
  }
`;

const ControlsContainer = styled.div`
  display: grid;
  gap: 1.5rem;
  margin-bottom: 3rem;
  grid-template-columns: 1fr;
  
  @media (min-width: 768px) {
    grid-template-columns: 2fr 1fr;
    align-items: center;
  }
  
  @media (min-width: 1024px) {
    grid-template-columns: 3fr 2fr;
  }
`;

const SearchBar = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  
  .search-icon {
    position: absolute;
    left: 1.25rem;
    color: #9CA3AF;
    z-index: 2;
    transition: color 0.3s ease;
  }
  
  input {
    width: 100%;
    padding: 1rem 1.5rem 1rem 3.5rem;
    border: 2px solid transparent;
    border-radius: 25px;
    font-size: 1rem;
    background: linear-gradient(white, white) padding-box,
                linear-gradient(135deg, #667eea 0%, #764ba2 100%) border-box;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
    
    &:focus {
      outline: none;
      transform: translateY(-2px);
      box-shadow: 0 8px 30px rgba(103, 126, 234, 0.2);
      
      + .search-icon {
        color: #667eea;
      }
    }
    
    &::placeholder {
      color: #9CA3AF;
    }
  }
`;

const HeaderActions = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  justify-content: flex-end;
  
  @media (max-width: 767px) {
    justify-content: stretch;
    
    > * {
      flex: 1;
    }
  }
`;

const ActionButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  background: ${props => props.$primary 
    ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' 
    : 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)'};
  color: ${props => props.$primary ? 'white' : '#475569'};
  border: ${props => props.$primary 
    ? 'none' 
    : '2px solid transparent'};
  border-radius: 15px;
  padding: 0.875rem 1.5rem;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
  position: relative;
  overflow: hidden;
  white-space: nowrap;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: ${props => props.$primary 
      ? 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)'
      : 'linear-gradient(90deg, transparent, rgba(103, 126, 234, 0.1), transparent)'};
    transition: left 0.5s;
  }
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: ${props => props.$primary 
      ? '0 12px 35px rgba(103, 126, 234, 0.4)'
      : '0 12px 35px rgba(0, 0, 0, 0.15)'};
    
    &::before {
      left: 100%;
    }
  }
  
  &:active {
    transform: translateY(-1px);
  }
`;

const StyledSelect = styled.select`
  padding: 0.875rem 1.5rem;
  border-radius: 15px;
  border: 2px solid transparent;
  background: linear-gradient(white, white) padding-box,
              linear-gradient(135deg, #e2e8f0 0%, #cbd5e1 100%) border-box;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
  
  &:focus {
    outline: none;
    transform: translateY(-2px);
    box-shadow: 0 8px 30px rgba(103, 126, 234, 0.2);
  }
  
  option {
    padding: 0.5rem;
    background: white;
  }
`;

const ItemsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
  gap: 2rem;
  padding: 2rem 0;
  
  @media (max-width: 1024px) {
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  }
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
    padding: 1rem 0;
  }
  
  @media (max-width: 480px) {
    gap: 1rem;
  }
`;

const ItemCard = styled.article`
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  position: relative;
  animation: ${bounceIn} 0.6s ease-out;
  
  /* Dynamic border based on status */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 6px;
    background: ${props => 
      props.$status === 'LOST' 
        ? 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)' : 
      props.$status === 'FOUND' 
        ? 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)' : 
      props.$status === 'RETURNED' 
        ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' 
        : 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)'};
    z-index: 1;
  }
  
  /* Hover glow effect */
  &::after {
    content: '';
    position: absolute;
    top: -2px;
    left: -2px;
    right: -2px;
    bottom: -2px;
    background: ${props => 
      props.$status === 'LOST' 
        ? 'linear-gradient(135deg, #ef4444, #dc2626)' : 
      props.$status === 'FOUND' 
        ? 'linear-gradient(135deg, #3b82f6, #1d4ed8)' : 
      props.$status === 'RETURNED' 
        ? 'linear-gradient(135deg, #10b981, #059669)' 
        : 'linear-gradient(135deg, #6b7280, #4b5563)'};
    border-radius: 26px;
    opacity: 0;
    transition: opacity 0.3s ease;
    z-index: -1;
  }

  &:hover {
    transform: translateY(-10px) scale(1.02);
    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.15);
    
    &::after {
      opacity: 0.3;
    }
    
    .item-image {
      transform: scale(1.1);
    }
    
    .status-badge {
      animation: ${pulse} 1s ease-in-out infinite;
    }
  }

  &:active {
    transform: translateY(-5px) scale(1.01);
  }
`;

const ItemImage = styled.div`
  height: 240px;
  background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #94a3b8;
  font-size: 3.5rem;
  position: relative;
  overflow: hidden;
  transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  }
  
  /* Shimmer effect for placeholder */
  &:not(:has(img))::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(90deg, 
      transparent, 
      rgba(255,255,255,0.4), 
      transparent
    );
    animation: ${shimmer} 2s ease-in-out infinite;
  }
  
  @media (max-width: 768px) {
    height: 200px;
  }
  
  @media (max-width: 480px) {
    height: 180px;
  }
`;

const ItemDetails = styled.div`
  padding: 1.5rem;
  
  h3 {
    font-size: 1.25rem;
    font-weight: 700;
    margin-bottom: 0.75rem;
    color: #1e293b;
    line-height: 1.3;
  }
  
  p {
    font-size: 0.95rem;
    color: #64748b;
    margin-bottom: 1.5rem;
    line-height: 1.6;
    height: 4.8em;
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
  }
`;

const ItemMeta = styled.div`
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 1rem;
  align-items: center;
  font-size: 0.875rem;
  color: #64748b;
  padding-top: 1rem;
  border-top: 2px solid #f1f5f9;
`;

const MetaItem = styled.span`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 500;
  
  svg {
    color: #94a3b8;
  }
`;

const StatusBadge = styled.span.attrs(({ $status }) => ({
  // Forward the status as a data attribute for testing if needed
  'data-status': $status
}))`
  padding: 0.5rem 1rem;
  border-radius: 25px;
  font-weight: 700;
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  position: relative;
  overflow: hidden;
  
  color: ${props => 
    props.$status === 'LOST' ? '#ffffff' : 
    props.$status === 'FOUND' ? '#ffffff' : 
    props.$status === 'RETURNED' ? '#ffffff' : '#64748b'};
    
  background: ${props => 
    props.$status === 'LOST' 
      ? 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)' : 
    props.$status === 'FOUND' 
      ? 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)' : 
    props.$status === 'RETURNED' 
      ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' 
      : 'linear-gradient(135deg, #e2e8f0 0%, #cbd5e1 100%)'};
  
  box-shadow: 0 4px 15px ${props => 
    props.$status === 'LOST' ? 'rgba(239, 68, 68, 0.3)' : 
    props.$status === 'FOUND' ? 'rgba(59, 130, 246, 0.3)' : 
    props.$status === 'RETURNED' ? 'rgba(16, 185, 129, 0.3)' : 
    'rgba(0, 0, 0, 0.1)'};
`;

// Item Actions
const ItemActions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #e2e8f0;
`;

// Delete icon button (owner-only)
const DeleteIconButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  background: #fef2f2;
  color: #dc2626;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #fee2e2;
    color: #b91c1c;
    transform: translateY(-1px);
  }
`;

const MessageSellerButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 12px 20px;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
  width: 100%;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(99, 102, 241, 0.4);
    background: linear-gradient(135deg, #5b5bf6, #7c3aed);
  }

  &:active {
    transform: translateY(0);
  }
  
  span {
    font-weight: 600;
  }
`;

const SecondaryActions = styled.div`
  display: flex;
  gap: 0.5rem;
  justify-content: center;
`;

const SecondaryButton = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  background: #f1f5f9;
  color: #64748b;
  border-radius: 8px;
  text-decoration: none;
  transition: all 0.2s ease;
  
  &:hover {
    background: #e2e8f0;
    color: #475569;
    transform: translateY(-1px);
  }
`;

// --- Loading State Styles ---
const LoadingContainer = styled.div`
  text-align: center;
  padding: 4rem;
  animation: ${fadeInUp} 0.6s ease-out;
`;

const LoadingIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 1rem;
  animation: ${float} 2s ease-in-out infinite;
`;

const LoadingBar = styled.div`
  width: 100px;
  height: 4px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  margin: 0 auto;
  border-radius: 2px;
  animation: ${shimmer} 1.5s ease-in-out infinite;
`;

const LoadingState = () => (
  <LoadingContainer>
    <LoadingIcon>🔍</LoadingIcon>
    <h3 style={{ color: '#475569', marginBottom: '1rem' }}>Loading items...</h3>
    <LoadingBar />
  </LoadingContainer>
);

// --- Error State Styles ---
const ErrorContainer = styled.div`
  text-align: center;
  padding: 4rem;
  animation: ${bounceIn} 0.6s ease-out;
`;

const ErrorIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 1.5rem;
  animation: ${pulse} 2s ease-in-out infinite;
  color: #ef4444;
`;

const ErrorTitle = styled.h3`
  color: #1e293b;
  margin-bottom: 1rem;
`;

const ErrorMessage = styled.p`
  color: #64748b;
  margin-bottom: 2rem;
`;

const ErrorState = ({ message, onRetry }) => (
  <ErrorContainer>
    <ErrorIcon>
      <FaExclamationTriangle />
    </ErrorIcon>
    <ErrorTitle>Something went wrong</ErrorTitle>
    <ErrorMessage>{message}</ErrorMessage>
    <ActionButton $primary onClick={onRetry}>
      <FaPlus /> Try Again
    </ActionButton>
  </ErrorContainer>
);

// --- Empty State Styles ---
const EmptyContainer = styled.div`
  text-align: center;
  padding: 4rem;
  animation: ${fadeInUp} 0.6s ease-out;
`;

const EmptyIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 1.5rem;
  animation: ${float} 3s ease-in-out infinite;
`;

const EmptyTitle = styled.h3`
  color: #1e293b;
  margin-bottom: 1rem;
`;

const EmptyMessage = styled.p`
  color: #64748b;
  max-width: 400px;
  margin: 0 auto 2rem;
`;

const EmptyState = ({ onAddNew }) => (
  <EmptyContainer>
    <EmptyIcon>📦</EmptyIcon>
    <EmptyTitle>No Items Found</EmptyTitle>
    <EmptyMessage>
      Be the first to report a lost or found item for this university.
      Help build a community of care and connection.
    </EmptyMessage>
    <ActionButton $primary onClick={onAddNew}>
      <FaPlus /> Report an Item
    </ActionButton>
  </EmptyContainer>
);

// --- Main Component ---
const ItemsList = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  
  const navigate = useNavigate();
  const { selectedUniversityId } = useContext(UniversityContext);
  const { currentUniversity } = useUniversities(selectedUniversityId);
  const { user } = useContext(AuthContext);
  

  const fetchItems = useCallback(async () => {
    if (!selectedUniversityId) {
      navigate('/universities');
      return;
    }
    try {
      setLoading(true);
      const response = await api.get(`/api/items?universityId=${selectedUniversityId}`);
      setItems(response.data || []);
    } catch (err) {
      setError('Failed to load items. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [selectedUniversityId, navigate]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const handleDeleteItem = useCallback(async (e, itemId) => {
    e?.stopPropagation?.();
    const confirmed = window.confirm('Delete this item? This action cannot be undone.');
    if (!confirmed) return;
    try {
      await api.delete(`/api/items/${itemId}`);
      setItems(prev => prev.filter(i => i.id !== itemId));
      toast.success('Item deleted successfully!');
    } catch (err) {
      toast.error('Failed to delete item. You can only delete your own items.');
    }
  }, []);

  const filteredAndSortedItems = useMemo(() => {
    return items
      .filter(item => {
        const searchLower = searchTerm.toLowerCase();
        return (
          item.name?.toLowerCase().includes(searchLower) ||
          item.description?.toLowerCase().includes(searchLower) ||
          item.category?.toLowerCase().includes(searchLower)
        );
      })
      .sort((a, b) => {
        if (sortBy === 'newest') {
          return new Date(b.dateReported) - new Date(a.dateReported);
        }
        if (sortBy === 'oldest') {
          return new Date(a.dateReported) - new Date(b.dateReported);
        }
        return 0;
      });
  }, [items, searchTerm, sortBy]);

  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} onRetry={fetchItems} />;

  return (
    <Container>
      <Header>
        <div className="university-header">
          <h1>{currentUniversity?.name || 'Lost & Found'}</h1>
          <button 
            className="university-badge" 
            onClick={() => navigate('/universities')}
          >
            <FaUniversity /> Change University
          </button>
        </div>
        
        <ControlsContainer>
          <SearchBar>
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search by name, category, or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </SearchBar>
          
          <HeaderActions>
            <StyledSelect 
              value={sortBy} 
              onChange={e => setSortBy(e.target.value)}
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </StyledSelect>
            
            <ActionButton $primary onClick={() => navigate('/items/lost')}>
              <FaPlus /> Report Item
            </ActionButton>
          </HeaderActions>
        </ControlsContainer>
      </Header>

      {items.length === 0 ? (
        <EmptyState onAddNew={() => navigate('/items/lost')} />
      ) : (
        <ItemsGrid>
          {filteredAndSortedItems.map((item, index) => (
            <ItemCard 
              key={item.id} 
              $status={item.status}
              onClick={() => navigate(`/items/${item.id}`)}
              style={{
                animationDelay: `${index * 0.1}s`
              }}
            >
              <ItemImage className="item-image">
                {item.imageUrl ? 
                  <img src={item.imageUrl} alt={item.name} /> : 
                  <FaImage />
                }
              </ItemImage>
              
              <ItemDetails>
                <h3>{item.name}</h3>
                <p>{item.description}</p>
                
                <ItemMeta>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
                    <MetaItem>
                      <FaTag /> {item.category}
                    </MetaItem>
                    {item.user && (
                      <MetaItem style={{ fontSize: '0.75rem', color: '#6366f1' }}>
                        <FaUser /> Reported by {item.user.username}
                      </MetaItem>
                    )}
                    {(item.contactPhone || item.contactEmail) && (
                      <MetaItem style={{ fontSize: '0.75rem', color: '#10b981' }}>
                        <FaPhone /> Contact available
                      </MetaItem>
                    )}
                  </div>
                  <StatusBadge 
                    $status={item.status}
                    className="status-badge"
                  >
                    {item.status}
                  </StatusBadge>
                </ItemMeta>
                
                <ItemActions onClick={(e) => e.stopPropagation()}>
                  {item.user?.id ? (
                    <MessageSellerButton 
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate('/messages', { 
                          state: { 
                            itemId: item.id,
                            otherUserId: item.user.id 
                          } 
                        });
                      }}
                    >
                      <FaComments size={16} />
                      <span>Message {item.status === 'LOST' ? 'Reporter' : 'Finder'}</span>
                    </MessageSellerButton>
                  ) : (
                    <MessageSellerButton disabled style={{ opacity: 0.6, cursor: 'not-allowed' }}>
                      <FaComments size={16} />
                      <span>Contact Info Unavailable</span>
                    </MessageSellerButton>
                  )}
                  
                  <SecondaryActions>
                    {item.contactPhone && (
                      <SecondaryButton href={`tel:${item.contactPhone}`}>
                        <FaPhone size={14} />
                      </SecondaryButton>
                    )}
                    {item.contactEmail && (
                      <SecondaryButton href={`mailto:${item.contactEmail}`}>
                        <FaEnvelope size={14} />
                      </SecondaryButton>
                    )}
                    {user && item.user?.id === user.id && (
                      <DeleteIconButton
                        title="Delete item"
                        onClick={(e) => handleDeleteItem(e, item.id)}
                      >
                        <FaTrash size={14} />
                      </DeleteIconButton>
                    )}
                  </SecondaryActions>
                </ItemActions>
              </ItemDetails>
            </ItemCard>
          ))}
        </ItemsGrid>
      )}
    </Container>
  );
};

export default ItemsList;