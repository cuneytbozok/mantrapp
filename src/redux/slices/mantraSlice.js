import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  mantras: [],
  favorites: [],
  currentMantra: null,
  loading: false,
  error: null,
  dailyLimit: 3,
  usedToday: 0,
};

const mantraSlice = createSlice({
  name: 'mantra',
  initialState,
  reducers: {
    fetchMantrasStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchMantrasSuccess: (state, action) => {
      state.loading = false;
      state.mantras = action.payload;
      state.error = null;
    },
    fetchMantrasFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    setCurrentMantra: (state, action) => {
      state.currentMantra = action.payload;
    },
    addToFavorites: (state, action) => {
      const mantra = action.payload;
      const exists = state.favorites.some(fav => fav.id === mantra.id);
      if (!exists) {
        state.favorites = [mantra, ...state.favorites];
      }
    },
    removeFromFavorites: (state, action) => {
      state.favorites = state.favorites.filter(
        (mantra) => mantra.id !== action.payload
      );
    },
    generateRandomMantra: (state, action) => {
      state.currentMantra = action.payload;
      if (state.usedToday < state.dailyLimit) {
        state.usedToday += 1;
      }
    },
    resetDailyLimit: (state) => {
      state.usedToday = 0;
    },
  },
});

export const {
  fetchMantrasStart,
  fetchMantrasSuccess,
  fetchMantrasFailure,
  setCurrentMantra,
  addToFavorites,
  removeFromFavorites,
  generateRandomMantra,
  resetDailyLimit,
} = mantraSlice.actions;

export default mantraSlice.reducer; 