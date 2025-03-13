import React from 'react';
import { ClerkProvider as NativeClerkProvider } from '@clerk/clerk-expo';
import * as SecureStore from 'expo-secure-store';
import { CLERK_PUBLISHABLE_KEY } from '../config/clerk';

// Token cache for Clerk
const tokenCache = {
  async getToken(key) {
    try {
      return SecureStore.getItemAsync(key);
    } catch (err) {
      return null;
    }
  },
  async saveToken(key, value) {
    try {
      return SecureStore.setItemAsync(key, value);
    } catch (err) {
      return;
    }
  },
};

const ClerkProvider = ({ children }) => {
  console.log("Using publishable key:", CLERK_PUBLISHABLE_KEY); // Add logging
  
  return (
    <NativeClerkProvider 
      publishableKey={CLERK_PUBLISHABLE_KEY}
      tokenCache={tokenCache}
    >
      {children}
    </NativeClerkProvider>
  );
};

export default ClerkProvider; 