import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { FaUniversity, FaArrowLeft } from 'react-icons/fa';
import styled, { keyframes } from 'styled-components';

const AddUniversity = () => {
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!name.trim()) {
      setError('University name is required');
      return;
    }

    try {
      setIsSubmitting(true);
      await api.post('/api/universities', { name, location });
      setSuccess(true);
      // Redirect back to university list after a short delay
      setTimeout(() => {
        navigate('/universities');
      }, 1500);
    } catch (err) {
      console.error('Error adding university:', err);
      setError(err.response?.data?.message || 'Failed to add university. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <UniversityContainer>
      <UniversityHeader>
        <BackButton 
          onClick={() => navigate(-1)}
          disabled={isSubmitting}
        >
          <FaArrowLeft /> Back
        </BackButton>
        <Title><FaUniversity /> Add New University</Title>
      </UniversityHeader>
      
      <Form onSubmit={handleSubmit}>
        {error && <ErrorMessage>{error}</ErrorMessage>}
        {success && (
          <SuccessMessage>
            University added successfully! Redirecting...
          </SuccessMessage>
        )}
        
        <FormGroup>
          <Label htmlFor="name">University Name *</Label>
          <Input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter university name"
            disabled={isSubmitting || success}
            required
          />
        </FormGroup>
        
        <FormGroup>
          <Label htmlFor="location">Location (Optional)</Label>
          <Input
            type="text"
            id="location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Enter location (city, country)"
            disabled={isSubmitting || success}
          />
        </FormGroup>
        
        <FormActions>
          <SecondaryButton 
            type="button" 
            onClick={() => navigate(-1)}
            disabled={isSubmitting}
          >
            Cancel
          </SecondaryButton>
          <PrimaryButton 
            type="submit" 
            disabled={isSubmitting || success || !name.trim()}
          >
            {isSubmitting ? 'Adding...' : 'Add University'}
          </PrimaryButton>
        </FormActions>
      </Form>
    </UniversityContainer>
  );
};

// Styled Components
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const UniversityContainer = styled.div`
  max-width: 800px;
  margin: 2rem auto;
  padding: 1.5rem;
  background: #ffffff;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  animation: ${fadeIn} 0.3s ease-out;
`;

const UniversityHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #eaeaea;
`;

const Title = styled.h2`
  margin: 0;
  color: #2c3e50;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-grow: 1;
  justify-content: center;
  font-size: 1.5rem;
`;

const BackButton = styled.button`
  background: none;
  border: none;
  color: #4F46E5;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1rem;
  padding: 0.5rem 1rem;
  border-radius: 5px;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: #f0f7ff;
  }
  
  &:disabled {
    color: #bdc3c7;
    cursor: not-allowed;
    background: none;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-size: 0.9375rem;
  font-weight: 500;
  color: #2c3e50;
`;

const Input = styled.input`
  padding: 0.75rem 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.375rem;
  font-size: 1rem;
  transition: border-color 0.2s, box-shadow 0.2s;
  
  &:focus {
    outline: none;
    border-color: #4F46E5;
    box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
  }
  
  &:disabled {
    background-color: #f8fafc;
    cursor: not-allowed;
  }
  
  &::placeholder {
    color: #94a3b8;
  }
`;

const FormActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1.5rem;
  padding-top: 1rem;
  border-top: 1px solid #eaeaea;
`;

const BaseButton = styled.button`
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  font-weight: 500;
  border-radius: 0.375rem;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  gap: 0.5rem;
  
  &:disabled {
    cursor: not-allowed;
    opacity: 0.7;
  }
`;

const PrimaryButton = styled(BaseButton)`
  background-color: #4F46E5;
  color: white;
  border: none;
  
  &:hover:not(:disabled) {
    background-color: #4338CA;
  }
  
  &:active:not(:disabled) {
    transform: translateY(1px);
  }
`;

const SecondaryButton = styled(BaseButton)`
  background-color: #f1f5f9;
  color: #334155;
  border: 1px solid #e2e8f0;
  
  &:hover:not(:disabled) {
    background-color: #e2e8f0;
  }
  
  &:active:not(:disabled) {
    transform: translateY(1px);
  }
`;

const Message = styled.div`
  padding: 0.75rem 1rem;
  border-radius: 0.375rem;
  margin-bottom: 1rem;
  font-size: 0.9375rem;
`;

const ErrorMessage = styled(Message)`
  background-color: #FEE2E2;
  color: #B91C1C;
`;

const SuccessMessage = styled(Message)`
  background-color: #DCFCE7;
  color: #166534;
`;

export default AddUniversity;
