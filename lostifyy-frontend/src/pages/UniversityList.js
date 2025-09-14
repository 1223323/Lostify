import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUniversity, FaPlus, FaSearch } from 'react-icons/fa';
import api from '../utils/api';
import { AuthContext } from '../context/AuthContext';
import styled, { keyframes } from 'styled-components';

const UniversityList = () => {
    const [universities, setUniversities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUniversities = async () => {
            try {
                const res = await api.get('/api/universities');
                setUniversities(res.data);
                setError('');
            } catch (err) {
                console.error('Error fetching universities:', err);
                setError('Failed to load universities. Please try again later.');
                setUniversities([]);
            } finally {
                setLoading(false);
            }
        };

        fetchUniversities();
    }, []);

    const handleUniversitySelect = (universityId) => {
        navigate(`/items?universityId=${universityId}`);
    };

    const filteredUniversities = universities.filter(university => 
        university.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (university.location && 
         university.location.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    if (loading) {
        return (
            <Container>
                <Header>
                    <Title><FaUniversity /> Select Your University</Title>
                </Header>
                <LoadingSpinner>Loading universities...</LoadingSpinner>
            </Container>
        );
    }

    return (
        <Container>
            <Header>
                <Title><FaUniversity /> Select Your University</Title>
            </Header>

            <SearchContainer>
                <SearchBox>
                    <FaSearch />
                    <SearchInput
                        type="text"
                        placeholder="Search universities..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </SearchBox>
                {user && (
                    <AddButton onClick={() => navigate('/universities/add')}>
                        <FaPlus /> Add University
                    </AddButton>
                )}
            </SearchContainer>

            {error && <ErrorMessage>{error}</ErrorMessage>}

            {filteredUniversities.length === 0 ? (
                <NoResults>
                    <p>No universities found. {user && 'Try adding a new one!'}</p>
                </NoResults>
            ) : (
                <UniversityListContainer>
                    {filteredUniversities.map(university => (
                        <UniversityItem 
                            key={university.id}
                            onClick={() => handleUniversitySelect(university.id)}
                        >
                            <UniversityInfo>
                                <h3>{university.name}</h3>
                                {university.location && (
                                    <Location>{university.location}</Location>
                                )}
                            </UniversityInfo>
                            <Arrow>→</Arrow>
                        </UniversityItem>
                    ))}
                </UniversityListContainer>
            )}
        </Container>
    );
};

// Styled Components
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const Container = styled.div`
  max-width: 800px;
  margin: 2rem auto;
  padding: 1.5rem;
  background: #ffffff;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  animation: ${fadeIn} 0.3s ease-out;
`;

const Header = styled.div`
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #eaeaea;
  text-align: center;
`;

const Title = styled.h1`
  margin: 0;
  color: #2c3e50;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  font-size: 1.75rem;
`;

const LoadingSpinner = styled.div`
  text-align: center;
  padding: 2rem;
  color: #64748b;
  font-size: 1.1rem;
`;

const SearchContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1.5rem;
  
  @media (min-width: 640px) {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
`;

const SearchBox = styled.div`
  display: flex;
  align-items: center;
  background: #f8fafc;
  border-radius: 0.5rem;
  padding: 0.5rem 1rem;
  flex: 1;
  max-width: 500px;
  border: 1px solid #e2e8f0;
  transition: border-color 0.2s, box-shadow 0.2s;
  
  &:focus-within {
    border-color: #4F46E5;
    box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
  }
  
  svg {
    color: #94a3b8;
    margin-right: 0.75rem;
  }
`;

const SearchInput = styled.input`
  border: none;
  background: transparent;
  padding: 0.5rem 0;
  font-size: 1rem;
  width: 100%;
  
  &:focus {
    outline: none;
  }
  
  &::placeholder {
    color: #94a3b8;
  }
`;

const AddButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background-color: #4F46E5;
  color: white;
  border: none;
  border-radius: 0.5rem;
  padding: 0.75rem 1.25rem;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s, transform 0.1s;
  
  &:hover {
    background-color: #4338CA;
  }
  
  &:active {
    transform: translateY(1px);
  }
  
  @media (max-width: 639px) {
    width: 100%;
    justify-content: center;
  }
`;

const ErrorMessage = styled.div`
  background-color: #FEE2E2;
  color: #B91C1C;
  padding: 0.75rem 1rem;
  border-radius: 0.375rem;
  margin-bottom: 1.5rem;
  font-size: 0.9375rem;
`;

const NoResults = styled.div`
  text-align: center;
  padding: 2rem 1rem;
  color: #64748b;
  background: #f8fafc;
  border-radius: 0.5rem;
  border: 1px dashed #e2e8f0;
`;

const UniversityListContainer = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  gap: 0.75rem;
`;

const UniversityItem = styled.li`
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  padding: 1.25rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    border-color: #c7d2fe;
  }
  
  &:active {
    transform: translateY(0);
  }
`;

const UniversityInfo = styled.div`
  h3 {
    margin: 0 0 0.25rem 0;
    color: #1e293b;
    font-size: 1.125rem;
  }
`;

const Location = styled.p`
  margin: 0;
  color: #64748b;
  font-size: 0.9375rem;
`;

const Arrow = styled.span`
  color: #94a3b8;
  font-size: 1.25rem;
  font-weight: bold;
`;

export default UniversityList;
