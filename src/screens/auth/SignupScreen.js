import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, Dimensions } from 'react-native';
import { TextInput, Text, Title, useTheme } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSignUp, useUser } from '@clerk/clerk-expo';

import { registerUser, clearError } from '../../redux/slices/authSlice';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS, SHADOWS, gradients } from '../../constants/theme';
import Button from '../../components/Button';

// Get screen dimensions
const { height } = Dimensions.get('window');

const SignupScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [showVerification, setShowVerification] = useState(false);
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const [confirmSecureTextEntry, setConfirmSecureTextEntry] = useState(true);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  
  const dispatch = useDispatch();
  const theme = useTheme();
  const { loading: authLoading, error } = useSelector((state) => state.auth);
  const { isLoaded: isSignUpLoaded, signUp, setActive: setActiveSignUp } = useSignUp();
  const { user, isLoaded: isUserLoaded } = useUser();

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

    if (!name) {
      formErrors.name = 'First name is required';
      isValid = false;
    }

    if (!surname) {
      formErrors.surname = 'Last name is required';
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
    } else if (password.length < 8) {
      formErrors.password = 'Password must be at least 8 characters';
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

  // Update user profile with first and last name
  const updateUserProfile = async (userId) => {
    try {
      if (isUserLoaded && user) {
        await user.update({
          firstName: name,
          lastName: surname,
        });
        console.log('User profile updated with name and surname');
      }
    } catch (err) {
      console.error('Error updating user profile:', err);
    }
  };

  const handleVerifyEmail = async () => {
    if (!verificationCode) {
      setErrors({ verification: 'Please enter the verification code' });
      return;
    }

    try {
      setLoading(true);
      const result = await signUp.attemptEmailAddressVerification({
        code: verificationCode,
      });

      console.log('Verification result:', result.status);

      if (result.status === 'complete') {
        // Set the active session
        await setActiveSignUp({ session: result.createdSessionId });
        
        // Update user profile with first and last name
        await updateUserProfile(result.createdUserId);
        
        // Now update Redux state
        const userData = {
          id: result.createdUserId,
          email,
          name,
          surname,
        };
        
        dispatch(registerUser(userData));
        
        // Show success message and navigate to login
        alert('Account created successfully! You can now log in.');
        navigation.navigate('Login');
      } else {
        setErrors({ verification: `Verification failed. Status: ${result.status}` });
      }
    } catch (err) {
      console.error('Verification error:', err);
      setErrors({ verification: err.message || 'Verification failed. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async () => {
    if (!isSignUpLoaded) {
      setErrors({ auth: 'Authentication system is not ready yet. Please try again.' });
      return;
    }
    
    if (validateForm()) {
      // Clear any previous errors
      setErrors({});
      setLoading(true);
      
      try {
        // Use Clerk's signUp hook directly with only the required parameters
        const result = await signUp.create({
          emailAddress: email,
          password,
        });
        
        console.log('Clerk signup result:', result.status);
        
        if (result.status === 'complete') {
          // Set the active session
          await setActiveSignUp({ session: result.createdSessionId });
          
          // Update user profile with first and last name
          await updateUserProfile(result.createdUserId);
          
          // Now update Redux state
          const userData = {
            id: result.createdUserId,
            email,
            name,
            surname,
          };
          
          dispatch(registerUser(userData));
        } else if (result.status === 'missing_requirements') {
          // Handle the case where email verification is required
          if (result.verifications?.emailAddress?.status === 'unverified') {
            setErrors({ 
              auth: 'Please check your email and click the verification link to complete signup. You can close this screen after verifying.' 
            });
          } else {
            // Check if we need to prepare verification (send verification email)
            const verificationResult = await signUp.prepareVerification({
              strategy: 'email_code',
            });
            
            if (verificationResult) {
              setShowVerification(true);
              setErrors({ 
                auth: 'A verification code has been sent to your email. Please enter it below to complete signup.' 
              });
            } else {
              setErrors({ auth: 'Sign up requires additional verification. Please check your email.' });
            }
          }
        } else {
          setErrors({ auth: `Sign up status: ${result.status}. Additional steps may be required.` });
        }
      } catch (err) {
        console.error('Signup error:', err);
        setErrors({ auth: err.message || 'Registration failed. Please try again.' });
      } finally {
        setLoading(false);
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
              <MaterialCommunityIcons name="meditation" size={50} color={COLORS.sereneBlue} />
              <Title style={styles.appTitle}>Create Account</Title>
              <Text style={styles.tagline}>Join our community of mindfulness</Text>
            </View>

            <View style={styles.formContainer}>
              {errors.auth && (
                <View style={styles.errorContainer}>
                  <Text style={styles.errorText}>{errors.auth}</Text>
                </View>
              )}

              {!showVerification ? (
                <>
                  <View style={styles.nameRow}>
                    <TextInput
                      label="First Name"
                      value={name}
                      onChangeText={setName}
                      mode="outlined"
                      style={[styles.input, styles.nameInput, { marginRight: SPACING.sm }]}
                      error={!!errors.name}
                      theme={{ colors: { primary: COLORS.sereneBlue } }}
                      dense
                    />
                    
                    <TextInput
                      label="Last Name"
                      value={surname}
                      onChangeText={setSurname}
                      mode="outlined"
                      style={[styles.input, styles.nameInput]}
                      error={!!errors.surname}
                      theme={{ colors: { primary: COLORS.sereneBlue } }}
                      dense
                    />
                  </View>
                  
                  <View style={styles.errorRow}>
                    <Text style={[styles.errorText, styles.nameError]}>{errors.name || ' '}</Text>
                    <Text style={[styles.errorText, styles.nameError]}>{errors.surname || ' '}</Text>
                  </View>

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
                    dense
                  />
                  {errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword}</Text>}

                  <Button
                    mode="contained"
                    onPress={handleSignup}
                    style={styles.button}
                    loading={authLoading}
                    disabled={authLoading}
                    gradient={true}
                  >
                    Sign Up
                  </Button>
                </>
              ) : (
                <>
                  <Text style={styles.verificationText}>
                    Please enter the verification code sent to your email
                  </Text>
                  
                  <TextInput
                    label="Verification Code"
                    value={verificationCode}
                    onChangeText={setVerificationCode}
                    mode="outlined"
                    style={styles.input}
                    keyboardType="number-pad"
                    error={!!errors.verification}
                    theme={{ colors: { primary: COLORS.sereneBlue } }}
                    dense
                  />
                  {errors.verification && <Text style={styles.errorText}>{errors.verification}</Text>}

                  <Button
                    mode="contained"
                    onPress={handleVerifyEmail}
                    style={styles.button}
                    loading={loading}
                    disabled={loading}
                    gradient={true}
                  >
                    Verify Email
                  </Button>
                  
                  <Button
                    mode="outlined"
                    onPress={() => setShowVerification(false)}
                    style={[styles.button, styles.backButton]}
                    disabled={loading}
                  >
                    Back to Sign Up
                  </Button>
                </>
              )}

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
    justifyContent: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  appTitle: {
    fontSize: TYPOGRAPHY.fontSizes.xl,
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
  nameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  nameInput: {
    flex: 1,
    height: 50,
  },
  errorRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 0,
  },
  nameError: {
    width: '48%',
    fontSize: TYPOGRAPHY.fontSizes.xxs,
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
  backButton: {
    marginTop: SPACING.sm,
    backgroundColor: 'transparent',
    borderColor: COLORS.sereneBlue,
  },
  errorText: {
    color: COLORS.error,
    fontSize: TYPOGRAPHY.fontSizes.xxs,
    marginBottom: SPACING.xs,
    marginLeft: SPACING.xs,
  },
  verificationText: {
    fontSize: TYPOGRAPHY.fontSizes.sm,
    color: COLORS.warmGray,
    textAlign: 'center',
    marginBottom: SPACING.md,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: SPACING.md,
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