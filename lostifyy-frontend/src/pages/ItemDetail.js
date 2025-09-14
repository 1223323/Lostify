import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useParams, useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { 
  FaArrowLeft, 
  FaMapMarkerAlt, 
  FaCalendarAlt, 
  FaUser, 
  FaEdit, 
  FaTrash, 
  FaCheck,
  FaImage,
  FaChevronLeft,
  FaChevronRight,
  FaShare,
  FaComments,
  FaFlag
} from 'react-icons/fa';
import api from '../utils/api';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Toast, { useToast } from '../components/ui/Toast';

// Animations
const fadeIn = keyframes`
  from { 
    opacity: 0; 
    transform: translateY(30px);
  }
  to { 
    opacity: 1; 
    transform: translateY(0);
  }
`;

const slideIn = keyframes`
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;



// Main Container
const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
  animation: ${fadeIn} 0.6s ease-out;
`;

const BackButton = styled(Button)`
  margin-bottom: 2rem;
  
  svg {
    margin-right: 0.5rem;
  }
`;

const ItemGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 450px;
  gap: 3rem;
  max-width: 1400px;
  margin: 0 auto;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    gap: 1.5rem;
  }
`;

// Image Gallery
const ImageGallery = styled(Card)`
  position: relative;
  overflow: hidden;
  height: 500px;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
  border: 1px solid ${({ theme }) => theme.border.light};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    height: 400px;
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    height: 350px;
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    height: 280px;
  }
`;

const ImageContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  overflow: hidden;
  border-radius: ${({ theme }) => theme.radius.lg};
`;

const ImageSlide = styled.div`
  min-width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ theme }) => theme.surface.elevated};
  color: ${({ theme }) => theme.text.tertiary};
  font-size: 4rem;
  transition: transform ${({ theme }) => theme.transition.duration.normal} ${({ theme }) => theme.transition.easing.easeInOut};
  transform: translateX(${({ $currentIndex }) => -$currentIndex * 100}%);
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const ImageNavButton = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: ${({ theme }) => theme.surface.default}e6;
  border: none;
  border-radius: ${({ theme }) => theme.radius.full};
  width: 3rem;
  height: 3rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.text.primary};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transition.duration.fast} ${({ theme }) => theme.transition.easing.easeInOut};
  z-index: 2;
  
  ${({ $direction }) => $direction === 'left' ? 'left: 1rem;' : 'right: 1rem;'}
  
  &:hover {
    background: ${({ theme }) => theme.surface.default};
    transform: translateY(-50%) scale(1.1);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const ImageIndicators = styled.div`
  position: absolute;
  bottom: 1rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 0.5rem;
  z-index: 2;
`;

const ImageIndicator = styled.button`
  width: 0.75rem;
  height: 0.75rem;
  border-radius: ${({ theme }) => theme.radius.full};
  border: none;
  background: ${({ $active, theme }) => 
    $active ? theme.primary.main : theme.surface.default + '80'
  };
  cursor: pointer;
  transition: all ${({ theme }) => theme.transition.duration.fast} ${({ theme }) => theme.transition.easing.easeInOut};
  
  &:hover {
    transform: scale(1.2);
  }
`;

// Item Info
const ItemInfo = styled(Card)`
  height: fit-content;
`;

const ItemHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2rem;
  gap: 1rem;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const ItemTitleSection = styled.div`
  flex: 1;
`;

const ItemTitle = styled.h1`
  font-size: ${({ theme }) => theme.typography.fontSize['4xl']};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.text.primary};
  margin: 0 0 0.5rem 0;
  line-height: ${({ theme }) => theme.typography.lineHeight.tight};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    font-size: ${({ theme }) => theme.typography.fontSize['3xl']};
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    font-size: ${({ theme }) => theme.typography.fontSize['2xl']};
  }
`;

const ItemSubtitle = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  color: ${({ theme }) => theme.text.secondary};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
`;

const ItemMeta = styled.div`
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
`;

const KeyDetailsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: ${({ theme }) => theme.surface.elevated};
  border-radius: ${({ theme }) => theme.radius.lg};
  border: 1px solid ${({ theme }) => theme.border.light};
`;

const KeyDetail = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const KeyDetailIcon = styled.div`
  width: 48px;
  height: 48px;
  border-radius: ${({ theme }) => theme.radius.lg};
  background: linear-gradient(135deg, ${({ theme }) => theme.primary.main}20, ${({ theme }) => theme.accent.main}20);
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.primary.main};
  font-size: 20px;
  flex-shrink: 0;
`;

const KeyDetailContent = styled.div`
  flex: 1;
`;

const KeyDetailLabel = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.text.secondary};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  margin-bottom: 0.25rem;
`;

const KeyDetailValue = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  color: ${({ theme }) => theme.text.primary};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
`;

const StatusBadge = styled(Badge)`
  ${({ $status, theme }) => {
    switch ($status) {
      case 'LOST':
        return `
          background: ${theme.error.main};
          color: white;
        `;
      case 'FOUND':
        return `
          background: ${theme.primary.main};
          color: white;
        `;
      case 'RETURNED':
        return `
          background: ${theme.success.main};
          color: white;
        `;
      default:
        return `
          background: ${theme.gray[200]};
          color: ${theme.gray[700]};
        `;
    }
  }}
`;

const ItemDescription = styled.div`
  margin-bottom: 2rem;
  
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

const ItemDetails = styled.div`
  display: grid;
  gap: 1rem;
  margin-bottom: 2rem;
`;

const DetailItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  background: ${({ theme }) => theme.surface.elevated};
  border-radius: ${({ theme }) => theme.radius.md};
  
  svg {
    color: ${({ theme }) => theme.primary.main};
    font-size: 1.125rem;
    flex-shrink: 0;
  }
  
  .detail-content {
    flex: 1;
    
    .label {
      font-size: ${({ theme }) => theme.typography.fontSize.xs};
      font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
      color: ${({ theme }) => theme.text.tertiary};
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-bottom: 0.25rem;
    }
    
    .value {
      font-size: ${({ theme }) => theme.typography.fontSize.sm};
      font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
      color: ${({ theme }) => theme.text.primary};
    }
  }
`;

// Contact Section
const ContactSection = styled.div`
  background: ${({ theme }) => theme.primary[50]};
  border: 1px solid ${({ theme }) => theme.primary[200]};
  border-radius: ${({ theme }) => theme.radius.lg};
  padding: 1.5rem;
  margin-bottom: 2rem;
  
  h3 {
    font-size: ${({ theme }) => theme.typography.fontSize.lg};
    font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
    color: ${({ theme }) => theme.primary[800]};
    margin-bottom: 1rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
`;

// Reporter Section
const ReporterSection = styled.div`
  background: ${({ theme }) => theme.accent[50]};
  border: 1px solid ${({ theme }) => theme.accent[200]};
  border-radius: ${({ theme }) => theme.radius.lg};
  padding: 1.5rem;
  margin-bottom: 2rem;
  
  h3 {
    font-size: ${({ theme }) => theme.typography.fontSize.lg};
    font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
    color: ${({ theme }) => theme.accent[800]};
    margin-bottom: 1rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
`;

const ReporterInfo = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1rem;
  background: white;
  border-radius: ${({ theme }) => theme.radius.md};
  border: 1px solid ${({ theme }) => theme.accent[200]};
`;

const ReporterAvatar = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: linear-gradient(135deg, ${({ theme }) => theme.accent.main}, ${({ theme }) => theme.primary.main});
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  flex-shrink: 0;
`;

const ReporterDetails = styled.div`
  flex: 1;
`;

const ReporterName = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.text.primary};
  margin-bottom: 0.25rem;
`;

const ReporterMeta = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.text.secondary};
  margin-bottom: 0.75rem;
  
  span {
    margin-right: 0.5rem;
  }
`;

const ReporterActions = styled.div`
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
`;

// Actions Section
const ActionsSection = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
`;

// Status Update Modal
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: ${({ theme }) => theme.zIndex.modal};
  animation: ${fadeIn} 0.2s ease-out;
`;

const ModalContent = styled(Card)`
  max-width: 400px;
  width: 90%;
  animation: ${slideIn} 0.3s ease-out;
  
  h3 {
    font-size: ${({ theme }) => theme.typography.fontSize.lg};
    font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
    color: ${({ theme }) => theme.text.primary};
    margin-bottom: 1rem;
  }
  
  p {
    color: ${({ theme }) => theme.text.secondary};
    margin-bottom: 1.5rem;
  }
`;

const ModalActions = styled.div`
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
`;

const Select = styled.select`
  width: 100%;
  padding: 0.75rem;
  border: 2px solid ${({ theme }) => theme.border.default};
  border-radius: ${({ theme }) => theme.radius.md};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  background: ${({ theme }) => theme.surface.default};
  color: ${({ theme }) => theme.text.primary};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transition.duration.fast} ${({ theme }) => theme.transition.easing.easeInOut};
  margin-bottom: 1.5rem;
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.primary.main};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.primary[100]};
  }
`;

// Loading States
const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  text-align: center;
`;

const LoadingSpinner = styled.div`
  width: 3rem;
  height: 3rem;
  border: 3px solid ${({ theme }) => theme.border.light};
  border-top: 3px solid ${({ theme }) => theme.primary.main};
  border-radius: ${({ theme }) => theme.radius.full};
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  text-align: center;
  color: ${({ theme }) => theme.error.main};
  
  svg {
    font-size: 3rem;
    margin-bottom: 1rem;
  }
  
  h3 {
    color: ${({ theme }) => theme.text.primary};
    margin-bottom: 0.5rem;
  }
  
  p {
    color: ${({ theme }) => theme.text.secondary};
    margin-bottom: 1.5rem;
  }
`;

const ItemDetail = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const res = await api.get(`/api/items/${id}`);
        setItem(res.data);
        setNewStatus(res.data.status);
      } catch (err) {
        console.error('Error fetching item:', err);
        setError('Item not found or you do not have permission to view it.');
      } finally {
        setLoading(false);
      }
    };
    fetchItem();
  }, [id]);

  const handleStatusUpdate = async () => {
    setIsUpdating(true);
    try {
      const res = await api.put(`/api/items/${id}/status`, null, { 
        params: { status: newStatus } 
      });
      setItem(res.data);
      setShowStatusModal(false);
      toast.success('Status updated successfully!');
    } catch (err) {
      toast.error('Failed to update status. Please try again.');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/api/items/${id}`);
      toast.success('Item deleted successfully!');
      navigate('/items');
    } catch (err) {
      toast.error('Failed to delete item. You can only delete your own items.');
    }
    setShowDeleteModal(false);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${item.status} Item: ${item.name}`,
          text: item.description,
          url: window.location.href,
        });
      } catch (err) {
        // User cancelled sharing
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  const nextImage = () => {
    if (item.photoUrls && item.photoUrls.length > 1) {
      setCurrentImageIndex((prev) => 
        prev === item.photoUrls.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevImage = () => {
    if (item.photoUrls && item.photoUrls.length > 1) {
      setCurrentImageIndex((prev) => 
        prev === 0 ? item.photoUrls.length - 1 : prev - 1
      );
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const isOwner = user && item && item.user && item.user.id === user.id;

  if (loading) {
    return (
      <Container>
        <LoadingContainer>
          <LoadingSpinner />
          <h3>Loading item details...</h3>
          <p>Please wait while we fetch the information.</p>
        </LoadingContainer>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <ErrorContainer>
          <FaFlag />
          <h3>Unable to Load Item</h3>
          <p>{error}</p>
          <Button variant="primary" onClick={() => navigate('/items')}>
            <FaArrowLeft /> Back to Items
          </Button>
        </ErrorContainer>
      </Container>
    );
  }

  if (!item) return null;

  const images = item.photoUrls && item.photoUrls.length > 0 ? item.photoUrls : [];

  return (
    <>
      <Toast toasts={toast.toasts} removeToast={toast.removeToast} />
      
      <Container>
        <BackButton variant="ghost" onClick={() => navigate('/items')}>
          <FaArrowLeft /> Back to Items
        </BackButton>

        <ItemGrid>
          {/* Image Gallery */}
          <ImageGallery>
            <ImageContainer>
              {images.length > 0 ? (
                images.map((imageUrl, index) => (
                  <ImageSlide key={index} $currentIndex={currentImageIndex}>
                    <img src={imageUrl} alt={`${item.name} - Image ${index + 1}`} />
                  </ImageSlide>
                ))
              ) : (
                <ImageSlide $currentIndex={0}>
                  <FaImage />
                </ImageSlide>
              )}
            </ImageContainer>

            {images.length > 1 && (
              <>
                <ImageNavButton 
                  $direction="left" 
                  onClick={prevImage}
                  disabled={images.length <= 1}
                >
                  <FaChevronLeft />
                </ImageNavButton>
                <ImageNavButton 
                  $direction="right" 
                  onClick={nextImage}
                  disabled={images.length <= 1}
                >
                  <FaChevronRight />
                </ImageNavButton>
                <ImageIndicators>
                  {images.map((_, index) => (
                    <ImageIndicator
                      key={index}
                      $active={index === currentImageIndex}
                      onClick={() => setCurrentImageIndex(index)}
                    />
                  ))}
                </ImageIndicators>
              </>
            )}
          </ImageGallery>

          {/* Item Information */}
          <ItemInfo>
            <ItemHeader>
              <ItemTitleSection>
                <ItemTitle>{item.name}</ItemTitle>
                <ItemSubtitle>
                  {item.status === 'LOST' ? 'Missing Item' : 'Found Item'} • {item.category}
                </ItemSubtitle>
              </ItemTitleSection>
              <ItemMeta>
                <StatusBadge variant="primary" $status={item.status}>
                  {item.status}
                </StatusBadge>
              </ItemMeta>
            </ItemHeader>
            
            <KeyDetailsGrid>
              <KeyDetail>
                <KeyDetailIcon>
                  <FaMapMarkerAlt />
                </KeyDetailIcon>
                <KeyDetailContent>
                  <KeyDetailLabel>Location</KeyDetailLabel>
                  <KeyDetailValue>{item.location}</KeyDetailValue>
                </KeyDetailContent>
              </KeyDetail>
              
              <KeyDetail>
                <KeyDetailIcon>
                  <FaCalendarAlt />
                </KeyDetailIcon>
                <KeyDetailContent>
                  <KeyDetailLabel>Date Reported</KeyDetailLabel>
                  <KeyDetailValue>{formatDate(item.dateReported)}</KeyDetailValue>
                </KeyDetailContent>
              </KeyDetail>
              
              <KeyDetail>
                <KeyDetailIcon>
                  <FaUser />
                </KeyDetailIcon>
                <KeyDetailContent>
                  <KeyDetailLabel>Reported By</KeyDetailLabel>
                  <KeyDetailValue>{item.user?.username}</KeyDetailValue>
                </KeyDetailContent>
              </KeyDetail>
            </KeyDetailsGrid>

            <ItemDescription>
              <h3>Description</h3>
              <p>{item.description}</p>
            </ItemDescription>

            <ItemDetails>
              <DetailItem>
                <FaMapMarkerAlt />
                <div className="detail-content">
                  <div className="label">Location</div>
                  <div className="value">{item.location}</div>
                </div>
              </DetailItem>

              <DetailItem>
                <FaCalendarAlt />
                <div className="detail-content">
                  <div className="label">Date Reported</div>
                  <div className="value">{formatDate(item.dateReported)}</div>
                </div>
              </DetailItem>

              {item.user && (
                <DetailItem>
                  <FaUser />
                  <div className="detail-content">
                    <div className="label">Reported By</div>
                    <div className="value">{item.user.username}</div>
                  </div>
                </DetailItem>
              )}
            </ItemDetails>

            {/* Reporter Information removed per UI cleanup */}

            {/* Contact Information removed per UI cleanup */}



            {/* Message Seller Section removed per UI cleanup */}

            {/* Fallback contact/message section removed per UI cleanup */}

            {/* Secondary Actions */}
            <ActionsSection>
              <Button variant="outline" onClick={handleShare}>
                <FaShare /> Share
              </Button>
              {!isOwner && item.user?.id && (
                <Button 
                  variant="primary"
                  onClick={() => navigate('/messages', { 
                    state: { 
                      itemId: item.id,
                      otherUserId: item.user.id,
                      otherUsername: item.user.username
                    }
                  })}
                >
                  <FaComments /> Message {item.status === 'LOST' ? 'Reporter' : 'Finder'}
                </Button>
              )}
              
              {isOwner && (
                <>
                  <Button 
                    variant="primary" 
                    onClick={() => setShowStatusModal(true)}
                  >
                    <FaEdit /> Update Status
                  </Button>
                  <Button 
                    variant="danger" 
                    onClick={() => setShowDeleteModal(true)}
                  >
                    <FaTrash /> Delete
                  </Button>
                </>
              )}
            </ActionsSection>
          </ItemInfo>
        </ItemGrid>
      </Container>

      {/* Status Update Modal */}
      {showStatusModal && (
        <ModalOverlay onClick={() => setShowStatusModal(false)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <h3>Update Item Status</h3>
            <p>Change the status of this item to reflect its current state.</p>
            
            <Select 
              value={newStatus} 
              onChange={(e) => setNewStatus(e.target.value)}
            >
              <option value="LOST">Lost</option>
              <option value="FOUND">Found</option>
              <option value="RETURNED">Returned</option>
            </Select>

            <ModalActions>
              <Button 
                variant="ghost" 
                onClick={() => setShowStatusModal(false)}
                disabled={isUpdating}
              >
                Cancel
              </Button>
              <Button 
                variant="primary" 
                onClick={handleStatusUpdate}
                loading={isUpdating}
                disabled={isUpdating}
              >
                <FaCheck /> Update Status
              </Button>
            </ModalActions>
          </ModalContent>
        </ModalOverlay>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <ModalOverlay onClick={() => setShowDeleteModal(false)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <h3>Delete Item</h3>
            <p>Are you sure you want to delete this item? This action cannot be undone.</p>

            <ModalActions>
              <Button 
                variant="ghost" 
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </Button>
              <Button 
                variant="danger" 
                onClick={handleDelete}
              >
                <FaTrash /> Delete Item
              </Button>
            </ModalActions>
          </ModalContent>
        </ModalOverlay>
      )}

    </>
  );
};

export default ItemDetail;
