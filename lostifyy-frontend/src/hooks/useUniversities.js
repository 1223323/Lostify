import { useState, useEffect } from 'react';
import api from '../utils/api';

const useUniversities = (universityId = null) => {
    const [universities, setUniversities] = useState([]);
    const [currentUniversity, setCurrentUniversity] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch all universities
    useEffect(() => {
        const fetchUniversities = async () => {
            try {
                setLoading(true);
                const res = await api.get('/api/universities');
                setUniversities(res.data);
                setError(null);
                
                // If a specific university ID is provided, find and set it
                if (universityId) {
                    const foundUni = res.data.find(u => u.id.toString() === universityId.toString());
                    setCurrentUniversity(foundUni || null);
                }
            } catch (err) {
                console.error('Error fetching universities:', err);
                setError('Failed to load universities. Please try again later.');
                setUniversities([]);
            } finally {
                setLoading(false);
            }
        };

        fetchUniversities();
    }, [universityId]);

    // Function to get a university by ID
    const getUniversityById = (id) => {
        return universities.find(u => u.id.toString() === id.toString()) || null;
    };

    return {
        universities,
        currentUniversity,
        loading,
        error,
        getUniversityById
    };
};

export default useUniversities;
