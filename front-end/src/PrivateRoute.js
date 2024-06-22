import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const PrivateRoute = ({ children }) => {
  const { loggedIn } = useAuth();

  if (!loggedIn) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default PrivateRoute;
