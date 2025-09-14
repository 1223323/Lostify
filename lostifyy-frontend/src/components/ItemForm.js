import React, { useState } from 'react';
import { FaBoxOpen, FaTag, FaAlignLeft, FaMapMarkerAlt, FaUniversity, FaCalendarAlt, FaInfoCircle, FaCheckCircle, FaCamera, FaPhone, FaEnvelope, FaTimes } from 'react-icons/fa';
import styled, { keyframes } from 'styled-components';
import useUniversities from '../hooks/useUniversities';

// Animations
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const slideIn = keyframes`
  from { transform: translateX(20px); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
`;

// Styled Components
const FormContainer = styled.div`
  max-width: 700px;
  margin: 2rem auto;
  padding: 0 1rem;
  animation: ${fadeIn} 0.6s ease-out;
`;

const FormCard = styled.div`
  background: ${({ theme }) => theme.surface.default};
  border-radius: ${({ theme }) => theme.radius['3xl']};
  box-shadow: ${({ theme }) => theme.shadow.xl};
  border: 1px solid ${({ theme }) => theme.border.light};
  overflow: hidden;
  transition: all ${({ theme }) => theme.transition.duration.normal} ${({ theme }) => theme.transition.easing.spring};
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: ${({ type, theme }) => 
      type === 'lost' 
        ? `linear-gradient(90deg, ${theme.primary.main}, ${theme.secondary.main})` 
        : `linear-gradient(90deg, ${theme.accent.main}, ${theme.warm.main})`
    };
  }
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.shadow['2xl']};
  }
`;

const FormHeader = styled.div`
  background: ${({ type, theme }) => 
    type === 'lost' 
      ? `linear-gradient(135deg, ${theme.primary.main}15, ${theme.secondary.main}15)` 
      : `linear-gradient(135deg, ${theme.accent.main}15, ${theme.warm.main}15)`
  };
  padding: 2rem 2.5rem 1.5rem;
  text-align: center;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 60px;
    height: 3px;
    background: ${({ type, theme }) => 
      type === 'lost' 
        ? `linear-gradient(90deg, ${theme.primary.main}, ${theme.secondary.main})` 
        : `linear-gradient(90deg, ${theme.accent.main}, ${theme.warm.main})`
    };
    border-radius: ${({ theme }) => theme.radius.full};
  }
  
  h2 {
    margin: 0 0 0.75rem;
    font-size: ${({ theme }) => theme.typography.fontSize['2xl']};
    font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
    color: ${({ theme }) => theme.text.primary};
    letter-spacing: -0.025em;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.75rem;
    
    svg {
      color: ${({ type, theme }) => 
        type === 'lost' ? theme.primary.main : theme.accent.main
      };
    }
  }
  
  p {
    margin: 0;
    color: ${({ theme }) => theme.text.secondary};
    font-size: ${({ theme }) => theme.typography.fontSize.base};
    font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  }
`;

const FormBody = styled.form`
  padding: 2rem 2.5rem 2.5rem;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    padding: 1.5rem 1.5rem 2rem;
  }
`;

const FormGroup = styled.div`
  margin-bottom: 2rem;
  position: relative;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const FormLabel = styled.label`
  display: block;
  margin-bottom: 0.75rem;
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.text.primary};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  svg {
    color: ${({ type, theme }) => 
      type === 'lost' ? theme.primary.main : theme.accent.main
    };
    font-size: 1rem;
  }
`;

const FormInput = styled.input`
  width: 100%;
  padding: 1rem 1.25rem 1rem 3.25rem;
  border: 2px solid ${({ theme }) => theme.border.default};
  border-radius: ${({ theme }) => theme.radius.xl};
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  font-family: inherit;
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  transition: all ${({ theme }) => theme.transition.duration.normal} ${({ theme }) => theme.transition.easing.easeInOut};
  background-color: ${({ theme }) => theme.surface.elevated};
  color: ${({ theme }) => theme.text.primary};
  
  &:focus {
    outline: none;
    border-color: ${({ type, theme }) => 
      type === 'lost' ? theme.primary.main : theme.accent.main
    };
    box-shadow: 0 0 0 4px ${({ type, theme }) => 
      type === 'lost' ? theme.primary[100] : theme.accent[100]
    };
    background-color: ${({ theme }) => theme.surface.default};
    transform: translateY(-1px);
  }
  
  &:hover:not(:focus) {
    border-color: ${({ theme }) => theme.border.medium};
    background-color: ${({ theme }) => theme.surface.default};
  }
  
  &::placeholder {
    color: ${({ theme }) => theme.text.tertiary};
    font-weight: ${({ theme }) => theme.typography.fontWeight.normal};
  }
`;

const FormTextArea = styled.textarea`
  width: 100%;
  min-height: 140px;
  padding: 1rem 1.25rem 1rem 3.25rem;
  border: 2px solid ${({ theme }) => theme.border.default};
  border-radius: ${({ theme }) => theme.radius.xl};
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  font-family: inherit;
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  resize: vertical;
  transition: all ${({ theme }) => theme.transition.duration.normal} ${({ theme }) => theme.transition.easing.easeInOut};
  background-color: ${({ theme }) => theme.surface.elevated};
  color: ${({ theme }) => theme.text.primary};
  line-height: ${({ theme }) => theme.typography.lineHeight.relaxed};
  
  &:focus {
    outline: none;
    border-color: ${({ type, theme }) => 
      type === 'lost' ? theme.primary.main : theme.accent.main
    };
    box-shadow: 0 0 0 4px ${({ type, theme }) => 
      type === 'lost' ? theme.primary[100] : theme.accent[100]
    };
    background-color: ${({ theme }) => theme.surface.default};
    transform: translateY(-1px);
  }
  
  &:hover:not(:focus) {
    border-color: ${({ theme }) => theme.border.medium};
    background-color: ${({ theme }) => theme.surface.default};
  }
  
  &::placeholder {
    color: ${({ theme }) => theme.text.tertiary};
    font-weight: ${({ theme }) => theme.typography.fontWeight.normal};
  }
`;

const FormSelect = styled.select`
  width: 100%;
  padding: 1rem 3rem 1rem 3.25rem;
  border: 2px solid ${({ theme }) => theme.border.default};
  border-radius: ${({ theme }) => theme.radius.xl};
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  font-family: inherit;
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  appearance: none;
  background-color: ${({ theme }) => theme.surface.elevated};
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='%23${({ theme }) => theme.text.tertiary.replace('#', '')}' viewBox='0 0 16 16'%3E%3Cpath d='M7.247 11.14L2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 1.25rem center;
  background-size: 14px;
  cursor: pointer;
  transition: all ${({ theme }) => theme.transition.duration.normal} ${({ theme }) => theme.transition.easing.easeInOut};
  color: ${({ theme }) => theme.text.primary};
  
  &:focus {
    outline: none;
    border-color: ${({ type, theme }) => 
      type === 'lost' ? theme.primary.main : theme.accent.main
    };
    box-shadow: 0 0 0 4px ${({ type, theme }) => 
      type === 'lost' ? theme.primary[100] : theme.accent[100]
    };
    background-color: ${({ theme }) => theme.surface.default};
    transform: translateY(-1px);
  }
  
  &:hover:not(:focus) {
    border-color: ${({ theme }) => theme.border.medium};
    background-color: ${({ theme }) => theme.surface.default};
  }
`;

const InputIcon = styled.span`
  position: absolute;
  left: 1.25rem;
  top: 3.25rem;
  color: ${({ type, theme }) => 
    type === 'lost' ? theme.primary.main : theme.accent.main
  };
  font-size: 1.125rem;
  transition: all ${({ theme }) => theme.transition.duration.fast} ${({ theme }) => theme.transition.easing.easeInOut};
  z-index: 1;
`;

const FormButton = styled.button`
  width: 100%;
  padding: 1.25rem 2rem;
  border: none;
  border-radius: ${({ theme }) => theme.radius['2xl']};
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: white;
  background: ${({ type, theme }) => 
    type === 'lost' 
      ? `linear-gradient(135deg, ${theme.primary.main} 0%, ${theme.secondary.main} 100%)` 
      : `linear-gradient(135deg, ${theme.accent.main} 0%, ${theme.warm.main} 100%)`
  };
  cursor: pointer;
  transition: all ${({ theme }) => theme.transition.duration.normal} ${({ theme }) => theme.transition.easing.spring};
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  margin-top: 2rem;
  box-shadow: ${({ theme }) => theme.shadow.lg};
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transition: left ${({ theme }) => theme.transition.duration.slow} ${({ theme }) => theme.transition.easing.easeInOut};
  }
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: ${({ theme }) => theme.shadow['2xl']};
    
    &::before {
      left: 100%;
    }
  }
  
  &:active {
    transform: translateY(-1px);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none !important;
    
    &::before {
      display: none;
    }
  }
`;



const ErrorMessage = styled.div`
  background: ${({ theme }) => theme.error[50]};
  color: ${({ theme }) => theme.error[700]};
  border: 1px solid ${({ theme }) => theme.error[200]};
  padding: 1rem 1.25rem;
  border-radius: ${({ theme }) => theme.radius.xl};
  margin-bottom: 2rem;
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  display: flex;
  align-items: center;
  gap: 0.75rem;
  animation: ${slideIn} 0.4s ease-out;
  box-shadow: ${({ theme }) => theme.shadow.sm};
  
  svg {
    font-size: 1.125rem;
    flex-shrink: 0;
  }
`;

const SuccessMessage = styled.div`
  background: ${({ theme }) => theme.success[50]};
  color: ${({ theme }) => theme.success[700]};
  border: 1px solid ${({ theme }) => theme.success[200]};
  padding: 1rem 1.25rem;
  border-radius: ${({ theme }) => theme.radius.xl};
  margin-bottom: 2rem;
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  display: flex;
  align-items: center;
  gap: 0.75rem;
  animation: ${slideIn} 0.4s ease-out;
  box-shadow: ${({ theme }) => theme.shadow.sm};
  
  svg {
    font-size: 1.125rem;
    flex-shrink: 0;
  }
`;

const LoadingSpinner = styled.div`
  display: inline-block;
  width: 1.2rem;
  height: 1.2rem;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 1s ease-in-out infinite;
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

// Photo Upload Components
const PhotoUploadArea = styled.div`
  border: 2px dashed ${({ type, theme }) => 
    type === 'lost' ? theme.primary.main : theme.accent.main
  };
  border-radius: ${({ theme }) => theme.radius['2xl']};
  padding: 3rem 2rem;
  text-align: center;
  background: ${({ type, theme }) => 
    type === 'lost' 
      ? `linear-gradient(135deg, ${theme.primary[50]}, ${theme.secondary[50]})` 
      : `linear-gradient(135deg, ${theme.accent[50]}, ${theme.warm[50]})`
  };
  cursor: pointer;
  transition: all ${({ theme }) => theme.transition.duration.normal} ${({ theme }) => theme.transition.easing.easeInOut};
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: ${({ type, theme }) => 
      type === 'lost' 
        ? `radial-gradient(circle at 30% 70%, ${theme.primary[100]}40, transparent 50%), radial-gradient(circle at 70% 30%, ${theme.secondary[100]}40, transparent 50%)`
        : `radial-gradient(circle at 30% 70%, ${theme.accent[100]}40, transparent 50%), radial-gradient(circle at 70% 30%, ${theme.warm[100]}40, transparent 50%)`
    };
    opacity: 0;
    transition: opacity ${({ theme }) => theme.transition.duration.normal} ${({ theme }) => theme.transition.easing.easeInOut};
  }
  
  &:hover {
    border-color: ${({ type, theme }) => 
      type === 'lost' ? theme.primary.dark : theme.accent[600]
    };
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.shadow.lg};
    
    &::before {
      opacity: 1;
    }
  }
  
  input[type="file"] {
    display: none;
  }
`;

const PhotoUploadIcon = styled.div`
  font-size: 3rem;
  color: ${({ type, theme }) => 
    type === 'lost' ? theme.primary.main : theme.accent.main
  };
  margin-bottom: 1rem;
  transition: all ${({ theme }) => theme.transition.duration.normal} ${({ theme }) => theme.transition.easing.spring};
  
  ${PhotoUploadArea}:hover & {
    transform: scale(1.1);
  }
`;

const PhotoUploadText = styled.div`
  color: ${({ theme }) => theme.text.primary};
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  margin-bottom: 0.5rem;
  
  strong {
    color: ${({ type, theme }) => 
      type === 'lost' ? theme.primary.main : theme.accent.main
    };
  }
`;

const PhotoUploadSubtext = styled.div`
  color: ${({ theme }) => theme.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
`;

const PhotoPreviewGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 1.5rem;
  margin-top: 1.5rem;
`;

const PhotoPreviewItem = styled.div`
  position: relative;
  aspect-ratio: 1;
  border-radius: ${({ theme }) => theme.radius.xl};
  overflow: hidden;
  box-shadow: ${({ theme }) => theme.shadow.md};
  transition: all ${({ theme }) => theme.transition.duration.normal} ${({ theme }) => theme.transition.easing.easeInOut};
  border: 2px solid ${({ theme }) => theme.border.light};
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.shadow.lg};
    border-color: ${({ theme }) => theme.border.medium};
  }
`;

const PhotoPreviewImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform ${({ theme }) => theme.transition.duration.normal} ${({ theme }) => theme.transition.easing.easeInOut};
  
  ${PhotoPreviewItem}:hover & {
    transform: scale(1.05);
  }
`;

const PhotoRemoveButton = styled.button`
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  background: ${({ theme }) => theme.error.main};
  color: white;
  border: none;
  border-radius: ${({ theme }) => theme.radius.full};
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 0.875rem;
  transition: all ${({ theme }) => theme.transition.duration.fast} ${({ theme }) => theme.transition.easing.easeInOut};
  box-shadow: ${({ theme }) => theme.shadow.sm};
  
  &:hover {
    background: ${({ theme }) => theme.error[600]};
    transform: scale(1.1);
    box-shadow: ${({ theme }) => theme.shadow.md};
  }
  
  &:active {
    transform: scale(0.95);
  }
`;

const ContactSection = styled.div`
  background: ${({ type, theme }) => 
    type === 'lost' 
      ? `linear-gradient(135deg, ${theme.primary[50]}, ${theme.secondary[50]})` 
      : `linear-gradient(135deg, ${theme.accent[50]}, ${theme.warm[50]})`
  };
  border: 1px solid ${({ type, theme }) => 
    type === 'lost' ? theme.primary[200] : theme.accent[200]
  };
  border-radius: ${({ theme }) => theme.radius['2xl']};
  padding: 2rem;
  margin-bottom: 2rem;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: ${({ type, theme }) => 
      type === 'lost' 
        ? `linear-gradient(90deg, ${theme.primary.main}, ${theme.secondary.main})` 
        : `linear-gradient(90deg, ${theme.accent.main}, ${theme.warm.main})`
    };
  }
`;

const ContactTitle = styled.h3`
  color: ${({ theme }) => theme.text.primary};
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  
  svg {
    color: ${({ type, theme }) => 
      type === 'lost' ? theme.primary.main : theme.accent.main
    };
    font-size: 1.25rem;
  }
`;

const ContactGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
`;

// Main Component
const ItemForm = ({ 
  type = 'lost', // 'lost' or 'found'
  onSubmit, 
  initialValues = {},
  loading = false,
  error = null,
  success = false,
  successMessage = '',
  onSuccessDismiss,
  universities: externalUniversities = null
}) => {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    description: '',
    location: '',
    universityId: '',
    date: new Date().toISOString().split('T')[0],
    contactPhone: '',
    contactEmail: '',
    ...initialValues
  });

  const [selectedPhotos, setSelectedPhotos] = useState([]);
  const [photoPreviewUrls, setPhotoPreviewUrls] = useState([]);

  const { universities, loading: universitiesLoading } = useUniversities();
  const availableUniversities = externalUniversities || universities;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePhotoChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + selectedPhotos.length > 5) {
      alert('You can upload maximum 5 photos');
      return;
    }

    setSelectedPhotos(prev => [...prev, ...files]);

    // Create preview URLs
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPhotoPreviewUrls(prev => [...prev, e.target.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removePhoto = (index) => {
    setSelectedPhotos(prev => prev.filter((_, i) => i !== index));
    setPhotoPreviewUrls(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Create FormData for file upload
    const submitData = new FormData();
    
    // Add item data as JSON string
    const itemData = {
      ...formData,
      dateReported: formData.date
    };
    submitData.append('item', JSON.stringify(itemData));
    
    // Add photos
    selectedPhotos.forEach((photo, index) => {
      submitData.append('photos', photo);
    });
    
    onSubmit(submitData);
  };

  const categories = [
    'ELECTRONICS', 
    'BOOKS', 
    'APPAREL', 
    'ACCESSORIES', 
    'DOCUMENTS', 
    'OTHER'
  ];

  const getCategoryLabel = (category) => {
    return category.charAt(0) + category.slice(1).toLowerCase();
  };

  return (
    <FormContainer>
      <FormCard>
        <FormHeader type={type}>
          <h2>
            {type === 'lost' ? (
              <>
                <FaBoxOpen /> Report Lost Item
              </>
            ) : (
              <>
                <FaBoxOpen /> Report Found Item
              </>
            )}
          </h2>
          <p>
            {type === 'lost' 
              ? 'Help us help you find your lost item' 
              : 'Help return a found item to its owner'}
          </p>
        </FormHeader>
        
        <FormBody onSubmit={handleSubmit}>
          {error && (
            <ErrorMessage>
              <FaInfoCircle /> {error}
            </ErrorMessage>
          )}
          
          {success && (
            <SuccessMessage>
              <FaCheckCircle /> 
              {successMessage || (type === 'lost' 
                ? 'Lost item reported successfully! We\'ll help you find it.' 
                : 'Found item reported! Thank you for helping return it.')}
            </SuccessMessage>
          )}
          
          <FormGroup>
            <FormLabel htmlFor="name" type={type}>
              <FaBoxOpen /> Item Name
            </FormLabel>
            <div style={{ position: 'relative' }}>
              <FormInput
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g., Black Wallet, iPhone 13, MacBook Pro..."
                required
                $type={type}
              />
              <InputIcon type={type}>
                <FaBoxOpen />
              </InputIcon>
            </div>
          </FormGroup>
          
          <FormGroup>
            <FormLabel htmlFor="category" type={type}>
              <FaTag /> Category
            </FormLabel>
            <div style={{ position: 'relative' }}>
              <FormSelect
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                type={type}
              >
                <option value="">Select a category</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {getCategoryLabel(cat)}
                  </option>
                ))}
              </FormSelect>
              <InputIcon type={type}>
                <FaTag />
              </InputIcon>
            </div>
          </FormGroup>
          
          <FormGroup>
            <FormLabel htmlFor="description" type={type}>
              <FaAlignLeft /> Description
            </FormLabel>
            <div style={{ position: 'relative' }}>
              <FormTextArea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder={`Please provide a detailed description of the ${
                  type === 'lost' ? 'lost' : 'found'
                } item. Include color, size, brand, distinctive features...`}
                required
                type={type}
              />
              <InputIcon type={type} style={{ top: '1.25rem' }}>
                <FaAlignLeft />
              </InputIcon>
            </div>
          </FormGroup>
          
          <FormGroup>
            <FormLabel htmlFor="location" type={type}>
              <FaMapMarkerAlt /> 
              {type === 'lost' ? 'Where did you lose it?' : 'Where did you find it?'}
            </FormLabel>
            <div style={{ position: 'relative' }}>
              <FormInput
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g., Main Library, Student Center, Building A Room 201..."
                required
                $type={type}
              />
              <InputIcon type={type}>
                <FaMapMarkerAlt />
              </InputIcon>
            </div>
          </FormGroup>
          
          <FormGroup>
            <FormLabel htmlFor="date" type={type}>
              <FaCalendarAlt /> 
              {type === 'lost' ? 'When did you lose it?' : 'When did you find it?'}
            </FormLabel>
            <div style={{ position: 'relative' }}>
              <FormInput
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                max={new Date().toISOString().split('T')[0]}
                required
                $type={type}
              />
              <InputIcon type={type}>
                <FaCalendarAlt />
              </InputIcon>
            </div>
          </FormGroup>
          
          <FormGroup>
            <FormLabel htmlFor="university" type={type}>
              <FaUniversity /> University
            </FormLabel>
            <div style={{ position: 'relative' }}>
              <FormSelect
                id="university"
                name="universityId"
                value={formData.universityId}
                onChange={handleChange}
                required
                disabled={universitiesLoading || availableUniversities.length === 0}
                type={type}
              >
                <option value="">
                  {universitiesLoading ? 'Loading universities...' : 'Select your university'}
                </option>
                {availableUniversities.map((uni) => (
                  <option key={uni.id} value={uni.id}>
                    {uni.name}
                  </option>
                ))}
              </FormSelect>
              <InputIcon type={type}>
                <FaUniversity />
              </InputIcon>
            </div>
          </FormGroup>

          {/* Contact Information Section */}
          <ContactSection type={type}>
            <ContactTitle type={type}>
              <FaPhone /> Contact Information
            </ContactTitle>
            <ContactGrid>
              <FormGroup style={{ marginBottom: '0' }}>
                <FormLabel htmlFor="contactPhone" type={type}>
                  <FaPhone /> Phone Number
                </FormLabel>
                <div style={{ position: 'relative' }}>
                  <FormInput
                    type="tel"
                    id="contactPhone"
                    name="contactPhone"
                    value={formData.contactPhone}
                    onChange={handleChange}
                    placeholder="+1 (555) 123-4567"
                    $type={type}
                  />
                  <InputIcon type={type}>
                    <FaPhone />
                  </InputIcon>
                </div>
              </FormGroup>
              
              <FormGroup style={{ marginBottom: '0' }}>
                <FormLabel htmlFor="contactEmail" type={type}>
                  <FaEnvelope /> Email Address
                </FormLabel>
                <div style={{ position: 'relative' }}>
                  <FormInput
                    type="email"
                    id="contactEmail"
                    name="contactEmail"
                    value={formData.contactEmail}
                    onChange={handleChange}
                    placeholder="your.email@example.com"
                    $type={type}
                  />
                  <InputIcon type={type}>
                    <FaEnvelope />
                  </InputIcon>
                </div>
              </FormGroup>
            </ContactGrid>
          </ContactSection>

          {/* Photo Upload Section */}
          <FormGroup>
            <FormLabel type={type}>
              <FaCamera /> Photos (Optional)
            </FormLabel>
            <PhotoUploadArea 
              type={type}
              onClick={() => document.getElementById('photo-upload').click()}
            >
              <input
                id="photo-upload"
                type="file"
                multiple
                accept="image/*"
                onChange={handlePhotoChange}
              />
              <PhotoUploadIcon type={type}>
                <FaCamera />
              </PhotoUploadIcon>
              <PhotoUploadText type={type}>
                <strong>Click to upload photos</strong> or drag and drop
              </PhotoUploadText>
              <PhotoUploadSubtext>
                PNG, JPG, GIF up to 5MB each (maximum 5 photos)
              </PhotoUploadSubtext>
            </PhotoUploadArea>
            
            {photoPreviewUrls.length > 0 && (
              <PhotoPreviewGrid>
                {photoPreviewUrls.map((url, index) => (
                  <PhotoPreviewItem key={index}>
                    <PhotoPreviewImage src={url} alt={`Preview ${index + 1}`} />
                    <PhotoRemoveButton
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        removePhoto(index);
                      }}
                    >
                      <FaTimes />
                    </PhotoRemoveButton>
                  </PhotoPreviewItem>
                ))}
              </PhotoPreviewGrid>
            )}
          </FormGroup>
          
          <FormButton 
            type="submit" 
            disabled={loading || universitiesLoading}
            $type={type}
          >
            {loading ? (
              <>
                <LoadingSpinner /> Processing...
              </>
            ) : type === 'lost' ? (
              <>
                <FaBoxOpen /> Report Lost Item
              </>
            ) : (
              <>
                <FaBoxOpen /> Report Found Item
              </>
            )}
          </FormButton>
        </FormBody>
      </FormCard>
    </FormContainer>
  );
};

export default ItemForm;
