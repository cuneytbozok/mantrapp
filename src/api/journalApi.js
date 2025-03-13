// This is a mock API service for the MVP
// In a real app, this would connect to a backend server

// Sample mood emojis
export const moodEmojis = [
  { label: 'Happy', emoji: '😊' },
  { label: 'Excited', emoji: '🤩' },
  { label: 'Calm', emoji: '😌' },
  { label: 'Sad', emoji: '😔' },
  { label: 'Anxious', emoji: '😰' },
  { label: 'Angry', emoji: '😠' },
  { label: 'Tired', emoji: '😴' },
  { label: 'Grateful', emoji: '🙏' },
];

// Sample journal entries
let journalEntries = [
  {
    id: '1',
    text: "Today I practiced mindfulness for 10 minutes and felt much more centered afterward. I'm going to try to make this a daily habit.",
    mood: '😌',
    date: new Date(Date.now() - 86400000).toISOString(), // Yesterday
  },
  {
    id: '2',
    text: "I received a compliment at work today that made me feel really appreciated. It's nice to know my efforts are being recognized.",
    mood: '😊',
    date: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
  },
];

// Get all journal entries
export const getJournalEntries = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([...journalEntries].sort((a, b) => new Date(b.date) - new Date(a.date)));
    }, 300);
  });
};

// Get a single journal entry by ID
export const getJournalEntry = (id) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const entry = journalEntries.find(entry => entry.id === id);
      if (entry) {
        resolve(entry);
      } else {
        reject(new Error('Journal entry not found'));
      }
    }, 300);
  });
};

// Add a new journal entry
export const addJournalEntry = (entry) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newEntry = {
        id: Date.now().toString(),
        ...entry,
        date: entry.date || new Date().toISOString(),
      };
      journalEntries.push(newEntry);
      resolve(newEntry);
    }, 300);
  });
};

// Update an existing journal entry
export const updateJournalEntry = (id, updatedEntry) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = journalEntries.findIndex(entry => entry.id === id);
      if (index !== -1) {
        journalEntries[index] = {
          ...journalEntries[index],
          ...updatedEntry,
        };
        resolve(journalEntries[index]);
      } else {
        reject(new Error('Journal entry not found'));
      }
    }, 300);
  });
};

// Delete a journal entry
export const deleteJournalEntry = (id) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = journalEntries.findIndex(entry => entry.id === id);
      if (index !== -1) {
        const deletedEntry = journalEntries[index];
        journalEntries = journalEntries.filter(entry => entry.id !== id);
        resolve(deletedEntry);
      } else {
        reject(new Error('Journal entry not found'));
      }
    }, 300);
  });
}; 