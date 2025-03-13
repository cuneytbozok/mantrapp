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
      const newUser = await authService.register(userData);
      return newUser;
    } catch (error) {
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
  async () => {
    const userData = await authService.checkAuth();
    return userData;
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