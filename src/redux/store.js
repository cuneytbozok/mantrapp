import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import mantraReducer from './slices/mantraSlice';
import journalReducer from './slices/journalSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    mantra: mantraReducer,
    journal: journalReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
}); 