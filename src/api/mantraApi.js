// This is a mock API service for the MVP
// In a real app, this would connect to a backend server

// Sample categories
const categories = [
  'Career',
  'Self-Love',
  'Confidence',
  'Relationships',
  'Health',
  'Mindfulness',
  'Success',
  'Gratitude',
];

// Sample mantras for each category
const mantraSamples = {
  Career: [
    "I am capable of achieving my professional goals.",
    "My work brings value to others and fulfillment to me.",
    "I embrace challenges as opportunities for growth.",
    "I am worthy of success and recognition.",
    "My career path is unfolding perfectly for me.",
  ],
  'Self-Love': [
    "I am worthy of love and respect.",
    "I accept myself completely as I am.",
    "I honor my needs and take care of myself.",
    "I am enough, just as I am.",
    "I treat myself with kindness and compassion.",
  ],
  Confidence: [
    "I believe in myself and my abilities.",
    "I am confident in my decisions.",
    "I speak with confidence and clarity.",
    "I am becoming more confident every day.",
    "I trust my intuition and inner wisdom.",
  ],
  Relationships: [
    "I attract healthy and loving relationships.",
    "I communicate openly and honestly with others.",
    "I set healthy boundaries in my relationships.",
    "I am worthy of deep connection and love.",
    "My relationships are sources of joy and growth.",
  ],
  Health: [
    "My body is strong, healthy, and full of energy.",
    "I make choices that support my wellbeing.",
    "I listen to my body's wisdom.",
    "I am committed to my health and vitality.",
    "Each day, I grow stronger and healthier.",
  ],
  Mindfulness: [
    "I am present in this moment.",
    "I observe my thoughts without judgment.",
    "I find peace in the present moment.",
    "I am aware of my breath and my body.",
    "I release what I cannot control.",
  ],
  Success: [
    "I am creating the success I desire.",
    "I am worthy of abundance and prosperity.",
    "I attract opportunities for success.",
    "I celebrate my achievements, big and small.",
    "My potential for success is limitless.",
  ],
  Gratitude: [
    "I am grateful for all that I have.",
    "I find joy in the simple things.",
    "My life is filled with blessings.",
    "I appreciate the beauty around me.",
    "Gratitude opens my heart to abundance.",
  ],
};

/**
 * Generate random mantras
 * @param {string|number} categoryOrCount - Either a category name or the number of mantras to generate
 * @returns {Promise<Object|Array>} - A single mantra object or an array of mantra objects
 */
export const generateMantra = (categoryOrCount = null) => {
  return new Promise((resolve) => {
    // Simulate API delay
    setTimeout(() => {
      // Check if the parameter is a number (count of mantras to generate)
      if (typeof categoryOrCount === 'number' && categoryOrCount > 0) {
        const count = categoryOrCount;
        const mantras = [];
        
        // Generate the requested number of mantras
        for (let i = 0; i < count; i++) {
          // Select a random category
          const randomCategory = categories[Math.floor(Math.random() * categories.length)];
          // Get mantras for the selected category
          const categoryMantras = mantraSamples[randomCategory];
          // Select a random mantra from the category
          const randomMantra = categoryMantras[Math.floor(Math.random() * categoryMantras.length)];
          
          // Add to results with a unique ID
          mantras.push({
            id: `${Date.now()}-${i}`,
            text: randomMantra,
            category: randomCategory,
            createdAt: new Date().toISOString(),
          });
        }
        
        resolve(mantras);
      } else {
        // Original behavior for a single mantra
        // If no category is provided, select a random one
        const selectedCategory = (typeof categoryOrCount === 'string') ? 
          categoryOrCount : 
          categories[Math.floor(Math.random() * categories.length)];
        
        // Get mantras for the selected category
        const mantras = mantraSamples[selectedCategory];
        
        // Select a random mantra from the category
        const randomMantra = mantras[Math.floor(Math.random() * mantras.length)];
        
        resolve({
          id: Date.now().toString(),
          text: randomMantra,
          category: selectedCategory,
          createdAt: new Date().toISOString(),
        });
      }
    }, 500); // 500ms delay to simulate network request
  });
};

// Get all available categories
export const getCategories = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(categories);
    }, 300);
  });
}; 