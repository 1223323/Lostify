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

// Styled components
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

const SuccessMessageText = styled.p`
  color: #4a4a4a;
  margin-bottom: 2rem;
  line-height: 1.6;
`;

const SuggestionModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const SuggestionModalContent = styled.div`
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  max-width: 500px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
  
  h3 {
    margin-top: 0;
    color: #1f2937;
  }
  
  p {
    color: #4b5563;
    margin-bottom: 1.5rem;
  }
`;

const SuggestionList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0 0 1.5rem;
`;

const SuggestionItem = styled.li`
  padding: 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  margin-bottom: 0.75rem;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    border-color: #4f46e5;
    background: #f5f3ff;
  }
  
  strong {
    display: block;
    color: #1f2937;
    margin-bottom: 0.25rem;
  }
  
  p {
    margin: 0.25rem 0;
    color: #4b5563;
    font-size: 0.9rem;
  }
  
  small {
    color: #6b7280;
    font-size: 0.8rem;
  }
  }
`;

const SuggestionModal = ({ isOpen, onClose, suggestions, onItemClick }) => {
  if (!isOpen) return null;

  return (
    <SuggestionModalOverlay onClick={onClose}>
      <SuggestionModalContent onClick={(e) => e.stopPropagation()}>
        <h3>Similar Items Found</h3>
        <p>We found some items that might match what you're reporting. Are any of these your item?</p>
        
        <SuggestionList>
          {suggestions.map((item) => (
            <SuggestionItem key={item.id} onClick={() => onItemClick(item)}>
              <strong>{item.name}</strong>
              <p>{item.description}</p>
              <small>Found on: {new Date(item.dateFound).toLocaleDateString()}</small>
            </SuggestionItem>
          ))}
        </SuggestionList>
        
        <button 
          onClick={onClose}
          style={{
            background: '#e5e7eb',
            border: 'none',
            padding: '0.5rem 1rem',
            borderRadius: '6px',
            cursor: 'pointer'
          }}
        >
          No, continue with my report
        </button>
      </SuggestionModalContent>
    </SuggestionModalOverlay>
  );
};

const SubmitFoundItem = () => {
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  
  // const { user } = useContext(AuthContext); // Not needed since we're using FormData
  const { selectedUniversityId } = useContext(UniversityContext);
  const navigate = useNavigate();

  const handleSubmit = async (formData) => {
    setError('');
    
    try {
      setIsSubmitting(true);
      
      // First, check for similar items
      const similarItems = await api.get('/api/items/similar', {
        params: {
          name: formData.name,
          category: formData.category,
          universityId: selectedUniversityId || formData.universityId
        }
      });
      
      if (similarItems.data.length > 0) {
        setSuggestions(similarItems.data);
        setShowSuggestions(true);
        return;
      }
      
      // If no similar items, submit the found item
      await submitFoundItem(formData);
      
    } catch (err) {
      console.error('Error submitting found item:', err);
      
      // More detailed error handling
      if (err.response?.status === 401) {
        setError('Authentication failed. Please log in again.');
      } else if (err.response?.status === 403) {
        setError('You do not have permission to perform this action.');
      } else if (err.response?.status === 400) {
        setError(err.response?.data?.message || 'Invalid form data. Please check your inputs.');
      } else {
        setError(err.response?.data?.message || 'Failed to submit found item. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const submitFoundItem = async (formData) => {
    const response = await api.post('/api/items/found', formData);
    setIsSuccess(true);
    
    // Redirect to items list after a short delay
    setTimeout(() => {
      navigate('/items');
    }, 2000);
  };
  
  const handleSuggestionSelect = (suggestion) => {
    // Handle when user selects a suggested item
    // For example, mark the item as claimed or show contact info
    setShowSuggestions(false);
    // You can implement the logic for what happens when a suggestion is selected
  };

  if (isSuccess) {
    return (
      <SuccessContainer>
        <SuccessIcon>
          <FaCheckCircle />
        </SuccessIcon>
        <SuccessTitle>Report Submitted Successfully!</SuccessTitle>
        <SuccessMessageText>
          The found item has been reported. Thank you for helping return it to its owner!
          <br />
          Redirecting to items list...
        </SuccessMessageText>
      </SuccessContainer>
    );
  }

  return (
    <>
      <ItemForm
        type="found"
        onSubmit={handleSubmit}
        loading={isSubmitting}
        error={error}
        success={isSuccess}
        successMessage="The found item has been reported successfully!"
        initialValues={{
          universityId: selectedUniversityId || ''
        }}
      />
      
      <SuggestionModal
        isOpen={showSuggestions}
        onClose={() => setShowSuggestions(false)}
        suggestions={suggestions}
        onItemClick={handleSuggestionSelect}
      />
    </>
  );
};

export default SubmitFoundItem;