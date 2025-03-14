import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as authService from '../../services/authService';

// Async thunks for authentication
export const loginUser = createAsyncThunk(
  'auth/login',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const userData = await authService.login(email, password);
      return userData;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      console.log('Auth slice: registering user with data:', JSON.stringify({
        email: userData.email,
        name: userData.name,
        surname: userData.surname,
        // Don't log password for security reasons
      }));
      
      const newUser = await authService.register(userData);
      return newUser;
    } catch (error) {
      console.error('Auth slice: registration error:', error);
      return rejectWithValue(error.message);
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logout',
  async () => {
    await authService.logout();
  }
);

export const checkAuthStatus = createAsyncThunk(
  'auth/checkStatus',
  async (_, { rejectWithValue }) => {
    try {
      // Get user data from auth service
      const userData = await authService.checkAuth();
      
      // Log the user data for debugging
      console.log('checkAuthStatus thunk - User data from authService:', JSON.stringify(userData));
      
      return userData;
    } catch (error) {
      console.error('Error in checkAuthStatus thunk:', error);
      return rejectWithValue(error.message);
    }
  }
);

export const updateUserPreferences = createAsyncThunk(
  'auth/updatePreferences',
  async (updateData, { rejectWithValue }) => {
    try {
      const updatedUser = await authService.updateUserPreferences(updateData);
      return updatedUser;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  motivationCategories: [
    { id: 1, name: 'Career' },
    { id: 2, name: 'Parenting' },
    { id: 3, name: 'Healthy Living' },
    { id: 4, name: 'Self-confidence' },
    { id: 5, name: 'Romantic Relationships' },
  ],
  selectedCategory: null,
  notificationTime: null,
  selectedFocus: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login cases
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        console.log('Redux: Login fulfilled with payload:', JSON.stringify(action.payload));
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
        state.error = null;
        if (action.payload.categories && action.payload.categories.length > 0) {
          state.selectedCategory = action.payload.categories[0];
        }
        if (action.payload.notificationTime) {
          state.notificationTime = action.payload.notificationTime;
        }
        if (action.payload.focus) {
          state.selectedFocus = action.payload.focus;
        }
        console.log('Redux: Updated auth state after login:', JSON.stringify({
          isAuthenticated: state.isAuthenticated,
          user: state.user
        }));
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Login failed';
      })
      
      // Register cases
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        console.log('Redux: Register fulfilled with payload:', JSON.stringify(action.payload));
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
        state.error = null;
        if (action.payload.categories && action.payload.categories.length > 0) {
          state.selectedCategory = action.payload.categories[0];
        }
        if (action.payload.notificationTime) {
          state.notificationTime = action.payload.notificationTime;
        }
        if (action.payload.focus) {
          state.selectedFocus = action.payload.focus;
        }
        console.log('Redux: Updated auth state after register:', JSON.stringify({
          isAuthenticated: state.isAuthenticated,
          user: state.user
        }));
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Registration failed';
      })
      
      // Logout case
      .addCase(logoutUser.fulfilled, (state) => {
        state.isAuthenticated = false;
        state.user = null;
        state.selectedCategory = null;
        state.notificationTime = null;
        state.selectedFocus = null;
      })
      
      // Check auth status cases
      .addCase(checkAuthStatus.pending, (state) => {
        state.loading = true;
      })
      .addCase(checkAuthStatus.fulfilled, (state, action) => {
        console.log('Redux: checkAuthStatus fulfilled with payload:', JSON.stringify(action.payload));
        state.loading = false;
        if (action.payload) {
          state.isAuthenticated = true;
          state.user = action.payload;
          if (action.payload.categories && action.payload.categories.length > 0) {
            state.selectedCategory = action.payload.categories[0];
          }
          if (action.payload.notificationTime) {
            state.notificationTime = action.payload.notificationTime;
          }
          if (action.payload.focus) {
            state.selectedFocus = action.payload.focus;
          }
          console.log('Redux: Updated auth state after checkAuthStatus:', JSON.stringify({
            isAuthenticated: state.isAuthenticated,
            user: state.user
          }));
        }
      })
      .addCase(checkAuthStatus.rejected, (state) => {
        state.loading = false;
      })
      
      // Update preferences cases
      .addCase(updateUserPreferences.fulfilled, (state, action) => {
        state.user = action.payload;
        if (action.payload.categories && action.payload.categories.length > 0) {
          state.selectedCategory = action.payload.categories[0];
        }
        if (action.payload.notificationTime) {
          state.notificationTime = action.payload.notificationTime;
        }
        if (action.payload.focus) {
          state.selectedFocus = action.payload.focus;
        }
      });
  },
});

export const { clearError } = authSlice.actions;

export default authSlice.reducer; 