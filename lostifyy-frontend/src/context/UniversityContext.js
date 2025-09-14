import React, { createContext, useState, useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';

export const UniversityContext = createContext();

export const UniversityProvider = ({ children }) => {
    const [selectedUniversityId, setSelectedUniversityId] = useState(
        () => localStorage.getItem('selectedUniversityId') || null
    );
    const location = useLocation();

    // Sync with URL params if universityId is present
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const urlUniversityId = params.get('universityId');

        if (urlUniversityId && urlUniversityId !== selectedUniversityId) {
            setSelectedUniversityId(urlUniversityId);
        }
    }, [location.search, selectedUniversityId]);

    // Persist to localStorage
    useEffect(() => {
        if (selectedUniversityId) {
            localStorage.setItem('selectedUniversityId', selectedUniversityId);
        } else {
            localStorage.removeItem('selectedUniversityId');
        }
    }, [selectedUniversityId]);

    const contextValue = useMemo(() => ({
        selectedUniversityId,
        setSelectedUniversityId,
    }), [selectedUniversityId]);

    return (
        <UniversityContext.Provider value={contextValue}>
            {children}
        </UniversityContext.Provider>
    );
};
