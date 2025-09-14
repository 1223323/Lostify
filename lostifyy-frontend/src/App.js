import React, { useContext } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';
import { UniversityContext } from './context/UniversityContext';
import { ThemeProvider } from './context/ThemeContext';
import { MessagingProvider } from './context/MessagingContext';
import { GlobalStyles } from './styles/GlobalStyles';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import ItemsList from './pages/ItemsList';
import ItemDetail from './pages/ItemDetail';
import SubmitLostItem from './pages/SubmitLostItem';
import SubmitFoundItem from './pages/SubmitFoundItem';
import LandingPage from './pages/LandingPage';
import UniversityList from './pages/UniversityList';
import AddUniversity from './pages/AddUniversity';
import Messages from './pages/Messages';
import LoadingSpinner from './components/LoadingSpinner';
import NotFound from './pages/NotFound';
import FloatingChatButton from './components/messaging/FloatingChatButton';
import styled from 'styled-components';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user, isLoading } = useContext(AuthContext);
  const location = useLocation();

  if (isLoading) {
    return <LoadingSpinner fullPage />;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  return children;
};

// University Route Component
const UniversityRoute = ({ children }) => {
  const { selectedUniversityId } = useContext(UniversityContext);
  const location = useLocation();

  if (!selectedUniversityId) {
    return <Navigate to="/universities" state={{ from: location }} replace />;
  }
  
  return children;
};

// Styled components
const AppContainer = styled.div`
  min-height: 100vh;
  background-color: ${({ theme }) => theme.background.default};
  color: ${({ theme }) => theme.text.primary};
  display: flex;
  flex-direction: column;
`;

const MainContent = styled.main`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

// Main App component
function AppContent() {
  const { user } = useContext(AuthContext);
  
  return (
    <AppContainer>
      <GlobalStyles />
      <Navbar />
      <MainContent>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          <Route
            path="/universities"
            element={
              <ProtectedRoute>
                <UniversityList />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/universities/add"
            element={
              <ProtectedRoute>
                <AddUniversity />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/items"
            element={
              <ProtectedRoute>
                <UniversityRoute>
                  <ItemsList />
                </UniversityRoute>
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/items/lost"
            element={
              <ProtectedRoute>
                <UniversityRoute>
                  <SubmitLostItem />
                </UniversityRoute>
              </ProtectedRoute>
            }
          />
              
          <Route
            path="/items/found"
            element={
              <ProtectedRoute>
                <UniversityRoute>
                  <SubmitFoundItem />
                </UniversityRoute>
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/items/:id"
            element={
              <ProtectedRoute>
                <UniversityRoute>
                  <ItemDetail />
                </UniversityRoute>
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/messages"
            element={
              <ProtectedRoute>
                <Messages />
              </ProtectedRoute>
            }
          />
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </MainContent>
      
      {/* Floating Chat Button - only show for authenticated users */}
      {user && <FloatingChatButton />}
    </AppContainer>
  );
}

function App() {
  return (
    <ThemeProvider>
      <MessagingProvider>
        <AppContent />
      </MessagingProvider>
    </ThemeProvider>
  );
}

export default App;
