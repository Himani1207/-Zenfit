import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ToastContainer from './components/Toast';

import HomePage from './Home';
import SignUp from './signup';
import Login from './login';
import MyJourney from './MyJourney';
import WorkoutPage from './workout';
import Mealplan from './mealplan';
import Membership from './Membership';
import Profile from './Profile';

// Protected Route component to secure user spaces
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#0F172A',
        color: '#FFFFFF',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'system-ui, sans-serif'
      }}>
        Loading ZenFit session...
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/login" element={<Login />} />
      
      {/* Protected routes mapping */}
      <Route path="/journey" element={
        <ProtectedRoute>
          <MyJourney />
        </ProtectedRoute>
      } />
      <Route path="/workout" element={
        <ProtectedRoute>
          <WorkoutPage />
        </ProtectedRoute>
      } />
      <Route path="/mealplan" element={
        <ProtectedRoute>
          <Mealplan />
        </ProtectedRoute>
      } />
      <Route path="/membership" element={
        <ProtectedRoute>
          <Membership />
        </ProtectedRoute>
      } />
      <Route path="/profile" element={
        <ProtectedRoute>
          <Profile />
        </ProtectedRoute>
      } />
      
      {/* Catch-all redirect to Home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
        <ToastContainer />
      </Router>
    </AuthProvider>
  );
}

export default App;
