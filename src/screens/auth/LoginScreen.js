import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Image, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { TextInput, Text, Title, useTheme } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import { loginUser, clearError } from '../../redux/slices/authSlice';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS, SHADOWS, gradients } from '../../constants/theme';
import Button from '../../components/Button';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const [errors, setErrors] = useState({});
  
  const dispatch = useDispatch();
  const theme = useTheme();
  const { loading, error } = useSelector((state) => state.auth);

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

  const handleLogin = () => {
    if (validateForm()) {
      dispatch(loginUser({ email, password }));
    }
  };

  // For demo purposes, prefill with test account
  const fillTestAccount = () => {
    setEmail('john@example.com');
    setPassword('password123');
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
        >
          <ScrollView contentContainerStyle={styles.scrollView}>
            <View style={styles.logoContainer}>
              <MaterialCommunityIcons name="meditation" size={80} color={COLORS.sereneBlue} />
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

              <TouchableOpacity onPress={fillTestAccount} style={styles.testAccountButton}>
                <Text style={styles.testAccountText}>Use Test Account</Text>
              </TouchableOpacity>

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
    padding: SPACING.xl,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: SPACING.xxl,
  },
  appTitle: {
    fontSize: TYPOGRAPHY.fontSizes.xxxl,
    fontWeight: TYPOGRAPHY.fontWeights.bold,
    color: COLORS.warmGray,
    marginBottom: SPACING.sm,
  },
  tagline: {
    fontSize: TYPOGRAPHY.fontSizes.md,
    color: COLORS.mutedLilac,
    textAlign: 'center',
  },
  formContainer: {
    width: '100%',
    backgroundColor: COLORS.softWhite,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.lg,
    ...SHADOWS.medium,
  },
  errorContainer: {
    backgroundColor: 'rgba(255, 0, 0, 0.1)',
    padding: SPACING.sm,
    borderRadius: BORDER_RADIUS.sm,
    marginBottom: SPACING.md,
  },
  input: {
    marginBottom: SPACING.sm,
    backgroundColor: COLORS.softWhite,
  },
  button: {
    marginTop: SPACING.lg,
  },
  errorText: {
    color: COLORS.error,
    fontSize: TYPOGRAPHY.fontSizes.xs,
    marginBottom: SPACING.sm,
    marginLeft: SPACING.xs,
  },
  testAccountButton: {
    alignItems: 'center',
    marginTop: SPACING.md,
  },
  testAccountText: {
    color: COLORS.sereneBlue,
    textDecorationLine: 'underline',
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: SPACING.lg,
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