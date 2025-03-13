# Mantra App - Authentication Setup

This document provides instructions on how to set up and use the authentication system for the Mantra App.

## Prerequisites

- Node.js and npm installed
- Expo CLI installed (`npm install -g expo-cli`)
- A Clerk account (https://clerk.dev)

## Setup

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Create a Clerk application:
   - Sign up for a Clerk account at https://clerk.dev
   - Create a new application
   - Configure your application settings (authentication methods, appearance, etc.)
   - Get your publishable key from the Clerk dashboard

4. Set up environment variables:
   - Rename `.env.example` to `.env` (if it exists) or create a new `.env` file
   - Add your Clerk publishable key:
     ```
     EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key_here
     ```

5. Start the application:
   ```
   npm start
   ```

## Authentication Flow

The authentication flow in the Mantra App is as follows:

1. **Login**: Users can log in with their email and password.
2. **Signup**: New users can create an account with their name, email, and password.
3. **Authentication State**: The app maintains the authentication state using Redux and Clerk.
4. **User Preferences**: User preferences are stored separately from authentication data.

## Implementation Details

The authentication system is implemented using the following components:

- **Clerk**: Provides authentication services (login, signup, session management).
- **Redux**: Manages application state, including authentication state.
- **AsyncStorage**: Stores user preferences locally.
- **React Navigation**: Handles navigation between authenticated and unauthenticated screens.

## Folder Structure

- `src/providers/ClerkProvider.js`: Provides Clerk authentication to the app.
- `src/providers/AuthServiceInitializer.js`: Initializes the auth service with the Clerk hook.
- `src/hooks/useClerkAuth.js`: Custom hook for Clerk authentication.
- `src/services/authService.js`: Service for authentication operations.
- `src/redux/slices/authSlice.js`: Redux slice for authentication state.
- `src/screens/auth/`: Authentication screens (login, signup, etc.).

## API Reference

### Authentication Service

- `login(email, password)`: Logs in a user with email and password.
- `register(userData)`: Registers a new user.
- `logout()`: Logs out the current user.
- `checkAuth()`: Checks if a user is already logged in.
- `updateUserPreferences(updateData)`: Updates user preferences.

### Redux Actions

- `loginUser({ email, password })`: Dispatches a login action.
- `registerUser(userData)`: Dispatches a registration action.
- `logoutUser()`: Dispatches a logout action.
- `checkAuthStatus()`: Checks the authentication status.
- `updateUserPreferences(updateData)`: Updates user preferences.

## Troubleshooting

- **Authentication Issues**: Make sure your Clerk publishable key is correct.
- **Environment Variables**: Ensure that the `.env` file is properly set up.
- **Clerk Configuration**: Verify that your Clerk application is configured correctly.

## Additional Resources

- [Clerk Documentation](https://clerk.dev/docs)
- [Expo Documentation](https://docs.expo.dev)
- [React Navigation Documentation](https://reactnavigation.org/docs/getting-started) 