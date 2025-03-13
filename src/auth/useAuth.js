import { useDispatch } from 'react-redux';
import { loginUser, registerUser, logoutUser } from '../redux/slices/authSlice';

/**
 * Custom hook for authentication operations
 * @returns {Object} Authentication methods
 */
const useAuth = () => {
  const dispatch = useDispatch();

  /**
   * Sign in with email and password
   * @param {string} email User email
   * @param {string} password User password
   * @returns {Promise} Promise that resolves when login is complete
   */
  const signIn = async (email, password) => {
    try {
      const resultAction = await dispatch(loginUser({ email, password }));
      if (loginUser.rejected.match(resultAction)) {
        throw new Error(resultAction.payload || 'Login failed');
      }
      return resultAction.payload;
    } catch (error) {
      throw error;
    }
  };

  /**
   * Register a new user
   * @param {Object} userData User registration data
   * @returns {Promise} Promise that resolves when registration is complete
   */
  const signUp = async (userData) => {
    try {
      const resultAction = await dispatch(registerUser(userData));
      if (registerUser.rejected.match(resultAction)) {
        throw new Error(resultAction.payload || 'Registration failed');
      }
      return resultAction.payload;
    } catch (error) {
      throw error;
    }
  };

  /**
   * Sign out the current user
   * @returns {Promise} Promise that resolves when logout is complete
   */
  const signOut = async () => {
    try {
      await dispatch(logoutUser());
    } catch (error) {
      throw error;
    }
  };

  return {
    signIn,
    signUp,
    signOut,
  };
};

export default useAuth; 