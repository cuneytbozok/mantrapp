import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { Provider as PaperProvider } from 'react-native-paper';
import { Provider as ReduxProvider, useDispatch } from 'react-redux';

import AppNavigator from './src/navigation/AppNavigator';
import { store } from './src/redux/store';
import { theme } from './src/constants/theme';
import { checkAuthStatus } from './src/redux/slices/authSlice';

// Main app component that wraps everything with providers
export default function App() {
  return (
    <ReduxProvider store={store}>
      <PaperProvider theme={theme}>
        <SafeAreaProvider>
          <NavigationContainer>
            <AppContent />
            <StatusBar style="auto" />
          </NavigationContainer>
        </SafeAreaProvider>
      </PaperProvider>
    </ReduxProvider>
  );
}

// Inner component that can use hooks
function AppContent() {
  const dispatch = useDispatch();

  // Check if user is already logged in when app starts
  useEffect(() => {
    dispatch(checkAuthStatus());
  }, [dispatch]);

  return <AppNavigator />;
}
