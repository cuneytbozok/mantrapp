import { useSignIn, useSignUp, useAuth, useUser } from '@clerk/clerk-expo';
import { useState } from 'react';

export const useClerkAuth = () => {
  const { isLoaded: isSignInLoaded, signIn, setActive } = useSignIn();
  const { isLoaded: isSignUpLoaded, signUp, setActive: setActiveSignUp } = useSignUp();
  const { isSignedIn, isLoaded: isAuthLoaded, signOut } = useAuth();
  const { user, isLoaded: isUserLoaded } = useUser();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Helper function to ensure we're signed out before attempting a new sign in/up
  const ensureSignedOut = async () => {
    try {
      // Always try to sign out regardless of current state
      console.log('Signing out of any existing session before proceeding');
      await signOut();
      
      // Add a small delay to ensure the sign out is complete
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (err) {
      console.error('Error signing out:', err);
      // Continue anyway, as we want to attempt the new sign in/up
    }
  };

  // Sign in with email and password
  const login = async (email, password) => {
    if (!isSignInLoaded) return;
    
    setLoading(true);
    setError(null);
    
    try {
      // Ensure we're signed out first
      await ensureSignedOut();
      
      // Start the sign-in process
      const result = await signIn.create({
        identifier: email,
        password,
      });
      
      // Check if sign-in was successful
      if (result.status === 'complete') {
        // Set the active session using the destructured setActive function
        await setActive({ session: result.createdSessionId });
        
        // Get the user data after setting the active session
        const currentUser = await user;
        
        // Return user data
        return {
          id: currentUser?.id,
          email: currentUser?.primaryEmailAddress?.emailAddress,
          name: currentUser?.firstName || '',
          surname: currentUser?.lastName || '',
        };
      } else {
        throw new Error('Sign in failed');
      }
    } catch (err) {
      setError(err.message || 'An error occurred during sign in');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Sign up with email and password
  const register = async (userData) => {
    if (!isSignUpLoaded) return;
    
    const { email, password, name, surname } = userData;
    
    setLoading(true);
    setError(null);
    
    try {
      // Ensure we're signed out first
      await ensureSignedOut();
      
      console.log('Clerk signup with params:', {
        emailAddress: email,
        password: '********'
      });
      
      // Start the sign-up process with only required parameters
      const result = await signUp.create({
        emailAddress: email,
        password,
      });
      
      console.log('Signup status:', result.status);
      
      // Check sign-up status
      if (result.status === 'complete') {
        // Set the active session using the destructured setActiveSignUp function
        await setActiveSignUp({ session: result.createdSessionId });
        
        // Try to update the user profile with first and last name
        try {
          if (user) {
            await user.update({
              firstName: name,
              lastName: surname,
            });
            console.log('User profile updated with name and surname');
          }
        } catch (profileErr) {
          console.error('Error updating user profile:', profileErr);
          // Continue with registration even if profile update fails
        }
        
        // Return user data
        return {
          id: result.createdUserId,
          email,
          name,
          surname,
        };
      } else if (result.status === 'missing_requirements') {
        // Handle the case where email verification is required
        if (result.verifications?.emailAddress?.status === 'unverified') {
          const errorMsg = 'Please check your email and click the verification link to complete signup.';
          setError(errorMsg);
          throw new Error(errorMsg);
        } else {
          // Try to prepare verification (send verification email)
          try {
            await signUp.prepareVerification({
              strategy: 'email_code',
            });
            const errorMsg = 'A verification code has been sent to your email. Please check your inbox.';
            setError(errorMsg);
            throw new Error(errorMsg);
          } catch (verificationErr) {
            const errorMsg = 'Sign up requires additional verification. Please check your email.';
            setError(errorMsg);
            throw new Error(errorMsg);
          }
        }
      } else {
        const errorMsg = `Sign up status: ${result.status}. Additional steps may be required.`;
        setError(errorMsg);
        throw new Error(errorMsg);
      }
    } catch (err) {
      console.error('Signup error details:', err);
      setError(err.message || 'An error occurred during sign up');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Sign out
  const logout = async () => {
    if (!signOut) return false;
    
    try {
      await signOut();
      return true;
    } catch (err) {
      setError(err.message || 'An error occurred during sign out');
      return false;
    }
  };

  // Get current user
  const getCurrentUser = () => {
    if (!isUserLoaded || !user) return null;
    
    return {
      id: user.id,
      email: user.primaryEmailAddress?.emailAddress,
      name: user.firstName || '',
      surname: user.lastName || '',
    };
  };

  // Update user profile
  const updateUserProfile = async (userData) => {
    if (!isUserLoaded || !user) {
      throw new Error('User not loaded');
    }
    
    try {
      const { name, surname } = userData;
      
      await user.update({
        firstName: name,
        lastName: surname,
      });
      
      return {
        id: user.id,
        email: user.primaryEmailAddress?.emailAddress,
        name: user.firstName || '',
        surname: user.lastName || '',
      };
    } catch (err) {
      setError(err.message || 'An error occurred during profile update');
      throw err;
    }
  };

  return {
    login,
    register,
    logout,
    getCurrentUser,
    updateUserProfile,
    isAuthenticated: isSignedIn,
    loading,
    error,
    isLoaded: isAuthLoaded && isUserLoaded,
  };
};

export default useClerkAuth; 