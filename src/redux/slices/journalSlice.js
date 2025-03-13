import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Storage key
const JOURNAL_STORAGE_KEY = '@mantra_app_journals';

// Async thunks for journal operations
export const fetchJournalEntries = createAsyncThunk(
  'journal/fetchEntries',
  async (_, { rejectWithValue }) => {
    try {
      const journalData = await AsyncStorage.getItem(JOURNAL_STORAGE_KEY);
      return journalData ? JSON.parse(journalData) : [];
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const saveJournalEntry = createAsyncThunk(
  'journal/saveEntry',
  async (entry, { getState, rejectWithValue }) => {
    try {
      const { journal } = getState();
      let updatedEntries;
      
      // Check if entry already exists (update) or is new (add)
      const existingEntryIndex = journal.entries.findIndex(e => e.id === entry.id);
      
      if (existingEntryIndex !== -1) {
        // Update existing entry
        updatedEntries = [...journal.entries];
        updatedEntries[existingEntryIndex] = {
          ...entry,
          updatedAt: new Date().toISOString()
        };
      } else {
        // Add new entry
        updatedEntries = [
          {
            ...entry,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          },
          ...journal.entries
        ];
      }
      
      // Save to AsyncStorage
      await AsyncStorage.setItem(JOURNAL_STORAGE_KEY, JSON.stringify(updatedEntries));
      
      return updatedEntries;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteJournalEntry = createAsyncThunk(
  'journal/deleteEntry',
  async (entryId, { getState, rejectWithValue }) => {
    try {
      const { journal } = getState();
      const updatedEntries = journal.entries.filter(entry => entry.id !== entryId);
      
      // Save to AsyncStorage
      await AsyncStorage.setItem(JOURNAL_STORAGE_KEY, JSON.stringify(updatedEntries));
      
      return entryId;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  entries: [],
  filteredEntries: [],
  loading: false,
  error: null,
  filters: {
    searchText: '',
    mood: null,
    dateRange: null,
    tags: []
  }
};

const journalSlice = createSlice({
  name: 'journal',
  initialState,
  reducers: {
    setSearchFilter: (state, action) => {
      state.filters.searchText = action.payload;
      applyFilters(state);
    },
    setMoodFilter: (state, action) => {
      state.filters.mood = action.payload;
      applyFilters(state);
    },
    setDateRangeFilter: (state, action) => {
      state.filters.dateRange = action.payload;
      applyFilters(state);
    },
    addTagFilter: (state, action) => {
      if (!state.filters.tags.includes(action.payload)) {
        state.filters.tags.push(action.payload);
        applyFilters(state);
      }
    },
    removeTagFilter: (state, action) => {
      state.filters.tags = state.filters.tags.filter(tag => tag !== action.payload);
      applyFilters(state);
    },
    clearFilters: (state) => {
      state.filters = {
        searchText: '',
        mood: null,
        dateRange: null,
        tags: []
      };
      state.filteredEntries = state.entries;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch entries cases
      .addCase(fetchJournalEntries.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchJournalEntries.fulfilled, (state, action) => {
        state.loading = false;
        state.entries = action.payload;
        state.filteredEntries = action.payload;
        state.error = null;
      })
      .addCase(fetchJournalEntries.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Save entry cases
      .addCase(saveJournalEntry.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(saveJournalEntry.fulfilled, (state, action) => {
        state.loading = false;
        state.entries = action.payload;
        applyFilters(state);
        state.error = null;
      })
      .addCase(saveJournalEntry.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Delete entry cases
      .addCase(deleteJournalEntry.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteJournalEntry.fulfilled, (state, action) => {
        state.loading = false;
        state.entries = state.entries.filter(entry => entry.id !== action.payload);
        applyFilters(state);
        state.error = null;
      })
      .addCase(deleteJournalEntry.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

// Helper function to apply filters
const applyFilters = (state) => {
  let filtered = [...state.entries];
  
  // Apply text search filter
  if (state.filters.searchText) {
    const searchText = state.filters.searchText.toLowerCase();
    filtered = filtered.filter(entry => 
      entry.text.toLowerCase().includes(searchText)
    );
  }
  
  // Apply mood filter
  if (state.filters.mood) {
    filtered = filtered.filter(entry => entry.mood === state.filters.mood);
  }
  
  // Apply date range filter
  if (state.filters.dateRange) {
    const { startDate, endDate } = state.filters.dateRange;
    if (startDate && endDate) {
      filtered = filtered.filter(entry => {
        const entryDate = new Date(entry.date);
        return entryDate >= new Date(startDate) && entryDate <= new Date(endDate);
      });
    }
  }
  
  // Apply tags filter
  if (state.filters.tags.length > 0) {
    filtered = filtered.filter(entry => {
      if (!entry.tags) return false;
      return state.filters.tags.some(tag => entry.tags.includes(tag));
    });
  }
  
  state.filteredEntries = filtered;
};

export const {
  setSearchFilter,
  setMoodFilter,
  setDateRangeFilter,
  addTagFilter,
  removeTagFilter,
  clearFilters
} = journalSlice.actions;

export default journalSlice.reducer; 