import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { TextInput, Text, Title, useTheme } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import { registerUser, clearError } from '../../redux/slices/authSlice';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS, SHADOWS, gradients } from '../../constants/theme';
import Button from '../../components/Button';

const SignupScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const [confirmSecureTextEntry, setConfirmSecureTextEntry] = useState(true);
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

    if (!name.trim()) {
      formErrors.name = 'Name is required';
      isValid = false;
    }

    if (!surname.trim()) {
      formErrors.surname = 'Surname is required';
      isValid = false;
    }

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

    if (!confirmPassword) {
      formErrors.confirmPassword = 'Please confirm your password';
      isValid = false;
    } else if (password !== confirmPassword) {
      formErrors.confirmPassword = 'Passwords do not match';
      isValid = false;
    }

    setErrors(formErrors);
    return isValid;
  };

  const handleSignup = () => {
    if (validateForm()) {
      // Navigate to category selection screen
      navigation.navigate('CategorySelection', {
        userData: { name, surname, email, password }
      });
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
        >
          <ScrollView contentContainerStyle={styles.scrollView}>
            <View style={styles.headerContainer}>
              <MaterialCommunityIcons name="account-plus" size={40} color={COLORS.sereneBlue} />
              <Title style={styles.title}>Create Account</Title>
              <Text style={styles.subtitle}>Join Mantra App for daily motivation</Text>
            </View>

            <View style={styles.formContainer}>
              {errors.auth && (
                <View style={styles.errorContainer}>
                  <Text style={styles.errorText}>{errors.auth}</Text>
                </View>
              )}

              <TextInput
                label="Name"
                value={name}
                onChangeText={setName}
                mode="outlined"
                style={styles.input}
                error={!!errors.name}
                theme={{ colors: { primary: COLORS.sereneBlue } }}
              />
              {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}

              <TextInput
                label="Surname"
                value={surname}
                onChangeText={setSurname}
                mode="outlined"
                style={styles.input}
                error={!!errors.surname}
                theme={{ colors: { primary: COLORS.sereneBlue } }}
              />
              {errors.surname && <Text style={styles.errorText}>{errors.surname}</Text>}

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

              <TextInput
                label="Confirm Password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                mode="outlined"
                style={styles.input}
                secureTextEntry={confirmSecureTextEntry}
                right={
                  <TextInput.Icon
                    icon={confirmSecureTextEntry ? 'eye-off' : 'eye'}
                    onPress={() => setConfirmSecureTextEntry(!confirmSecureTextEntry)}
                    color={COLORS.warmGray}
                  />
                }
                error={!!errors.confirmPassword}
                theme={{ colors: { primary: COLORS.sereneBlue } }}
              />
              {errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword}</Text>}

              <Button
                mode="contained"
                onPress={handleSignup}
                style={styles.button}
                loading={loading}
                disabled={loading}
                gradient={true}
              >
                Continue
              </Button>

              <View style={styles.loginContainer}>
                <Text style={styles.loginText}>Already have an account?</Text>
                <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                  <Text style={styles.loginLink}>Login</Text>
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
    padding: SPACING.xl,
  },
  headerContainer: {
    alignItems: 'center',
    marginVertical: SPACING.xl,
  },
  title: {
    fontSize: TYPOGRAPHY.fontSizes.xxl,
    fontWeight: TYPOGRAPHY.fontWeights.bold,
    color: COLORS.warmGray,
    marginTop: SPACING.sm,
  },
  subtitle: {
    fontSize: TYPOGRAPHY.fontSizes.md,
    color: COLORS.mutedLilac,
    marginTop: SPACING.xs,
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
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: SPACING.lg,
  },
  loginText: {
    color: COLORS.warmGray,
  },
  loginLink: {
    color: COLORS.sereneBlue,
    fontWeight: TYPOGRAPHY.fontWeights.bold,
    marginLeft: SPACING.xs,
  },
});

export default SignupScreen; 