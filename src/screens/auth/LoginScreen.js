import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, Dimensions } from 'react-native';
import { TextInput, Text, Title, useTheme } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSignIn } from '@clerk/clerk-expo';

import { loginUser, clearError } from '../../redux/slices/authSlice';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS, SHADOWS, gradients } from '../../constants/theme';
import Button from '../../components/Button';

// Get screen dimensions
const { height } = Dimensions.get('window');

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const [errors, setErrors] = useState({});
  
  const dispatch = useDispatch();
  const theme = useTheme();
  const { loading, error } = useSelector((state) => state.auth);
  const { isLoaded: isSignInLoaded, signIn } = useSignIn();

  // Clear any auth errors when component mounts or unmounts
  useEffect(() => {
    dispatch(clearError());
    return () => dispatch(clearError());
  }, [dispatch]);

  // Update form errors if there's an auth error
  useEffect(() => {
    if (error) {
      setErrors({ auth: error });
    }
  }, [error]);

  const validateForm = () => {
    let formErrors = {};
    let isValid = true;

    if (!email) {
      formErrors.email = 'Email is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      formErrors.email = 'Email is invalid';
      isValid = false;
    }

    if (!password) {
      formErrors.password = 'Password is required';
      isValid = false;
    } else if (password.length < 6) {
      formErrors.password = 'Password must be at least 6 characters';
      isValid = false;
    }

    setErrors(formErrors);
    return isValid;
  };

  const handleLogin = async () => {
    if (!isSignInLoaded) {
      setErrors({ auth: 'Authentication system is not ready yet. Please try again.' });
      return;
    }
    
    if (validateForm()) {
      // Clear any previous errors
      setErrors({});
      
      try {
        // Use Clerk's signIn hook directly
        const result = await signIn.create({
          identifier: email,
          password,
        });
        
        console.log('Clerk signin result:', result.status);
        
        if (result.status === 'complete') {
          // Set the active session
          await signIn.setActive({ session: result.createdSessionId });
          
          // Now update Redux state
          dispatch(loginUser({ email, password }))
            .unwrap()
            .then(user => {
              console.log('Login successful:', user.id);
            })
            .catch(error => {
              console.error('Login failed:', error);
              setErrors({ auth: error || 'Login failed. Please try again.' });
            });
        } else {
          setErrors({ auth: 'Sign in is not complete. Please try again.' });
        }
      } catch (err) {
        console.error('Login error:', err);
        setErrors({ auth: err.message || 'Login failed. Please try again.' });
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={gradients.primary}
        style={styles.gradientBackground}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardAvoidingView}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
        >
          <ScrollView 
            contentContainerStyle={styles.scrollView}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.logoContainer}>
              <MaterialCommunityIcons name="meditation" size={60} color={COLORS.sereneBlue} />
              <Title style={styles.appTitle}>Mantra App</Title>
              <Text style={styles.tagline}>Empower your mind, one mantra at a time</Text>
            </View>

            <View style={styles.formContainer}>
              {errors.auth && (
                <View style={styles.errorContainer}>
                  <Text style={styles.errorText}>{errors.auth}</Text>
                </View>
              )}

              <TextInput
                label="Email"
                value={email}
                onChangeText={setEmail}
                mode="outlined"
                style={styles.input}
                keyboardType="email-address"
                autoCapitalize="none"
                error={!!errors.email}
                theme={{ colors: { primary: COLORS.sereneBlue } }}
                dense
              />
              {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

              <TextInput
                label="Password"
                value={password}
                onChangeText={setPassword}
                mode="outlined"
                style={styles.input}
                secureTextEntry={secureTextEntry}
                right={
                  <TextInput.Icon
                    icon={secureTextEntry ? 'eye-off' : 'eye'}
                    onPress={() => setSecureTextEntry(!secureTextEntry)}
                    color={COLORS.warmGray}
                  />
                }
                error={!!errors.password}
                theme={{ colors: { primary: COLORS.sereneBlue } }}
                dense
              />
              {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}

              <Button
                mode="contained"
                onPress={handleLogin}
                style={styles.button}
                loading={loading}
                disabled={loading}
                gradient={true}
              >
                Login
              </Button>

              <View style={styles.signupContainer}>
                <Text style={styles.signupText}>Don't have an account?</Text>
                <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
                  <Text style={styles.signupLink}>Sign Up</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradientBackground: {
    flex: 1,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollView: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  appTitle: {
    fontSize: TYPOGRAPHY.fontSizes.xxl,
    fontWeight: TYPOGRAPHY.fontWeights.bold,
    color: COLORS.warmGray,
    marginBottom: SPACING.xs,
  },
  tagline: {
    fontSize: TYPOGRAPHY.fontSizes.sm,
    color: COLORS.mutedLilac,
    textAlign: 'center',
  },
  formContainer: {
    width: '100%',
    backgroundColor: COLORS.softWhite,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    ...SHADOWS.medium,
  },
  errorContainer: {
    backgroundColor: 'rgba(255, 0, 0, 0.1)',
    padding: SPACING.sm,
    borderRadius: BORDER_RADIUS.sm,
    marginBottom: SPACING.sm,
  },
  input: {
    marginBottom: SPACING.xs,
    backgroundColor: COLORS.softWhite,
    height: 50,
  },
  button: {
    marginTop: SPACING.md,
    height: 45,
  },
  errorText: {
    color: COLORS.error,
    fontSize: TYPOGRAPHY.fontSizes.xxs,
    marginBottom: SPACING.xs,
    marginLeft: SPACING.xs,
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: SPACING.md,
  },
  signupText: {
    color: COLORS.warmGray,
  },
  signupLink: {
    color: COLORS.sereneBlue,
    fontWeight: TYPOGRAPHY.fontWeights.bold,
    marginLeft: SPACING.xs,
  },
});

export default LoginScreen; 