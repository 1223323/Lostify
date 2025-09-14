import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import api from '../utils/api';
import { FaPlus, FaUniversity } from 'react-icons/fa';
import { UniversityContext } from '../context/UniversityContext';

// Styled Components
const SelectorContainer = styled.div`
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h3`
  text-align: center;
  color: #333;
  margin-bottom: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-size: 1.5rem;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    gap: 1rem;
  }
`;

const Card = styled.button`
  background: #fff;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  padding: 1.5rem 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-decoration: none;
  color: #333;
  border-style: ${props => props.$isAdd ? 'dashed' : 'solid'};
  background-color: ${props => props.$isAdd ? '#f8fafc' : '#fff'};
  color: ${props => props.$isAdd ? '#64748b' : '#333'};

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    border-color: #4f46e5;
    color: ${props => props.$isAdd ? '#4f46e5' : '#333'};
  }

  ${props => props.$selected && !props.$isAdd && `
    border-color: #4f46e5;
    background-color: #f8fafc;
    box-shadow: 0 4px 12px rgba(79, 70, 229, 0.2);
  `}
`;

const CardInner = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const Initial = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: ${props => props.$isAdd ? '#e2e8f0' : '#4f46e5'};
  color: ${props => props.$isAdd ? '#64748b' : 'white'};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 1rem;
  transition: all 0.2s ease;

  ${Card}:hover & {
    background: ${props => props.$isAdd ? '#4f46e5' : '#4338ca'};
    color: white;
  }
`;

const UniversityName = styled.h4`
  margin: 0.5rem 0;
  font-size: 1rem;
  color: #1e293b;
`;

const Location = styled.p`
  margin: 0;
  font-size: 0.85rem;
  color: #64748b;
`;

const Actions = styled.div`
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid #e2e8f0;
  text-align: center;
`;

const SelectedHint = styled.p`
  font-size: 1.1rem;
  color: #475569;
  margin-bottom: 1.5rem;
`;

const ActionButtons = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: center;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const ActionButton = styled.button`
  padding: 0.75rem 1.5rem;
  border: ${props => props.$variant === 'primary' ? 'none' : '1px solid #c7d2fe'};
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.95rem;
  background-color: ${props => props.$variant === 'primary' ? '#4f46e5' : 'white'};
  color: ${props => props.$variant === 'primary' ? 'white' : '#4f46e5'};
  width: ${props => props.$fullWidth ? '100%' : 'auto'};

  &:hover {
    transform: translateY(-1px);
    background-color: ${props => props.$variant === 'primary' ? '#4338ca' : '#eef2ff'};
  }

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const LoadingMessage = styled.div`
  text-align: center;
  padding: 2rem;
  color: #64748b;
`;

const ErrorMessage = styled.div`
  text-align: center;
  color: #ef4444;
  background-color: #fef2f2;
  padding: 1rem;
  border-radius: 6px;
  margin-bottom: 1rem;
`;

const UniversitySelector = () => {
  const [universities, setUniversities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { selectedUniversityId, setSelectedUniversityId } = useContext(UniversityContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUniversities = async () => {
      try {
        const res = await api.get('/api/universities');
        setUniversities(res.data);
        setError('');
      } catch (err) {
        console.error('Error fetching universities:', err);
        setError('Failed to load universities. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchUniversities();
  }, []);

  const handleSelect = (universityId) => {
    setSelectedUniversityId(universityId);
  };

  if (loading) {
    return <LoadingMessage>Loading universities...</LoadingMessage>;
  }

  return (
    <SelectorContainer>
      <Title>
        <FaUniversity /> Select Your University
      </Title>
      
      {error && <ErrorMessage>{error}</ErrorMessage>}
      
      <Grid>
        {universities.map((university) => (
          <Card
            key={university.id}
            $selected={selectedUniversityId === university.id}
            onClick={() => handleSelect(university.id)}
          >
            <CardInner>
              <Initial>
                {university.name.charAt(0).toUpperCase()}
              </Initial>
              <UniversityName>{university.name}</UniversityName>
              {university.location && (
                <Location>{university.location}</Location>
              )}
            </CardInner>
          </Card>
        ))}
        
        <Card 
          $isAdd 
          onClick={() => navigate('/universities/add')}
        >
          <CardInner>
            <Initial $isAdd>
              <FaPlus />
            </Initial>
            <UniversityName>Add Your University</UniversityName>
          </CardInner>
        </Card>
      </Grid>
      
      {selectedUniversityId && (
        <Actions>
          <SelectedHint>
            Selected: {universities.find(u => u.id === selectedUniversityId)?.name}
          </SelectedHint>
          <ActionButtons>
            <ActionButton 
              $variant="primary"
              onClick={() => navigate('/items')}
            >
              View Lost & Found Items
            </ActionButton>
            <ActionButton 
              $variant="secondary"
              onClick={() => navigate('/items/lost')}
            >
              Report Lost Item
            </ActionButton>
            <ActionButton 
              $variant="secondary"
              onClick={() => navigate('/items/found')}
            >
              Report Found Item
            </ActionButton>
          </ActionButtons>
        </Actions>
      )}
    </SelectorContainer>
  );
};

export default UniversitySelector;
