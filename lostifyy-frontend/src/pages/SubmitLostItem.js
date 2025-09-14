import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { AuthContext } from '../context/AuthContext';
import { UniversityContext } from '../context/UniversityContext';
import ItemForm from '../components/ItemForm';
import { FaCheckCircle } from 'react-icons/fa';
import styled, { keyframes } from 'styled-components';

// Animation for success message
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const SuccessContainer = styled.div`
  max-width: 600px;
  margin: 2rem auto;
  padding: 2rem;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
  text-align: center;
  animation: ${fadeIn} 0.5s ease-out;
`;

const SuccessIcon = styled.div`
  font-size: 4rem;
  color: #4caf50;
  margin-bottom: 1.5rem;
`;

const SuccessTitle = styled.h2`
  color: #2e7d32;
  margin-bottom: 1rem;
`;

const SuccessMessage = styled.p`
  color: #4a4a4a;
  margin-bottom: 2rem;
  line-height: 1.6;
  box-shadow: 0 0 0 2px rgba(229, 115, 115, 0.2);
`;

const SubmitLostItem = () => {
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  // const { user } = useContext(AuthContext); // Not needed since we're using FormData
  const { selectedUniversityId } = useContext(UniversityContext);
  const navigate = useNavigate();

  const handleSubmit = async (formData) => {
    setError('');
    
    try {
      setIsSubmitting(true);
      
      // Submit the lost item with photos
      const response = await api.post('/api/items/lost', formData);
      setIsSuccess(true);
      
      // Redirect to items list after a short delay
      setTimeout(() => {
        navigate('/items');
      }, 2000);
      
    } catch (err) {
      console.error('Error submitting lost item:', err);
      
      // More detailed error handling
      if (err.response?.status === 401) {
        setError('Authentication failed. Please log in again.');
      } else if (err.response?.status === 403) {
        setError('You do not have permission to perform this action.');
      } else if (err.response?.status === 400) {
        setError(err.response?.data?.message || 'Invalid form data. Please check your inputs.');
      } else {
        setError(err.response?.data?.message || 'Failed to submit lost item. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <SuccessContainer>
        <SuccessIcon>
          <FaCheckCircle />
        </SuccessIcon>
        <SuccessTitle>Report Submitted Successfully!</SuccessTitle>
        <SuccessMessage>
          Your lost item has been reported. We'll help you find it!
          <br />
          Redirecting to items list...
        </SuccessMessage>
      </SuccessContainer>
    );
  }

  return (
    <ItemForm
      type="lost"
      onSubmit={handleSubmit}
      loading={isSubmitting}
      error={error}
      success={isSuccess}
      successMessage="Your lost item has been reported successfully!"
      initialValues={{
        universityId: selectedUniversityId || ''
      }}
    />
  );
};

export default SubmitLostItem;