import React, { useEffect } from 'react';
import { authService } from '../services/authService';
import useClerkAuth from '../hooks/useClerkAuth';

// This component initializes the auth service with the Clerk hook
const AuthServiceInitializer = ({ children }) => {
  const clerkAuth = useClerkAuth();
  
  useEffect(() => {
    // Initialize the auth service with the Clerk hook
    authService.initialize(clerkAuth);
  }, [clerkAuth]);
  
  return <>{children}</>;
};

export default AuthServiceInitializer; 