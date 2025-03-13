import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { Button as PaperButton, Text } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SHADOWS, BORDER_RADIUS, gradients } from '../constants/theme';

const Button = ({ 
  mode = 'contained', 
  onPress, 
  style, 
  labelStyle, 
  children,
  loading = false,
  disabled = false,
  color,
  gradient = mode === 'contained',
  gradientColors,
  icon,
  ...props 
}) => {
  // Ensure children is wrapped in a Text component
  const renderChildren = () => {
    if (React.isValidElement(children)) {
      // If it's already a valid React element, return it
      return children;
    }
    
    // For strings, numbers, or any other type, wrap in Text
    return <Text style={[styles.label, mode === 'contained' ? styles.containedLabel : (mode === 'outlined' ? styles.outlinedLabel : styles.textLabel), labelStyle]}>{children}</Text>;
  };

  // If gradient is enabled and it's a contained button, use LinearGradient
  if (gradient && mode === 'contained' && !disabled) {
    const buttonGradient = gradientColors || gradients.button;
    
    return (
      <TouchableOpacity 
        onPress={disabled ? null : onPress}
        style={[
          styles.button,
          styles.gradientButtonContainer,
          disabled ? styles.disabledButton : null,
          style
        ]}
        disabled={disabled || loading}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={buttonGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradient}
        >
          <View style={styles.buttonContent}>
            {loading ? (
              <Text style={[styles.label, styles.containedLabel, labelStyle]}>Loading...</Text>
            ) : (
              <>
                {icon ? <View style={styles.iconContainer}>{icon}</View> : null}
                {renderChildren()}
              </>
            )}
          </View>
        </LinearGradient>
      </TouchableOpacity>
    );
  }
  
  // For outlined buttons
  if (mode === 'outlined') {
    return (
      <TouchableOpacity
        onPress={disabled ? null : onPress}
        style={[
          styles.button,
          styles.outlinedButton,
          disabled ? styles.disabledOutlinedButton : null,
          style
        ]}
        disabled={disabled || loading}
        activeOpacity={0.8}
      >
        <View style={styles.buttonContent}>
          {loading ? (
            <Text style={[styles.label, styles.outlinedLabel, labelStyle]}>Loading...</Text>
          ) : (
            <>
              {icon ? <View style={styles.iconContainer}>{icon}</View> : null}
              {renderChildren()}
            </>
          )}
        </View>
      </TouchableOpacity>
    );
  }
  
  // For text buttons
  if (mode === 'text') {
    return (
      <TouchableOpacity
        onPress={disabled ? null : onPress}
        style={[
          styles.button,
          styles.textButton,
          disabled ? styles.disabledTextButton : null,
          style
        ]}
        disabled={disabled || loading}
        activeOpacity={0.8}
      >
        <View style={styles.buttonContent}>
          {loading ? (
            <Text style={[styles.label, styles.textLabel, labelStyle]}>Loading...</Text>
          ) : (
            <>
              {icon ? <View style={styles.iconContainer}>{icon}</View> : null}
              {renderChildren()}
            </>
          )}
        </View>
      </TouchableOpacity>
    );
  }
  
  // Fallback to PaperButton for other modes
  // Wrap the children in a View to ensure proper rendering
  return (
    <PaperButton
      mode={mode}
      onPress={onPress}
      style={[
        styles.button,
        style
      ]}
      labelStyle={[
        styles.label,
        labelStyle
      ]}
      loading={loading}
      disabled={disabled}
      color={color || COLORS.buttonPrimary}
      icon={icon}
      {...props}
    >
      <View>
        {renderChildren()}
      </View>
    </PaperButton>
  );
};

const styles = StyleSheet.create({
  button: {
    marginVertical: 10,
    borderRadius: BORDER_RADIUS.md,
  },
  gradientButtonContainer: {
    overflow: 'hidden',
    borderRadius: BORDER_RADIUS.md,
    ...SHADOWS.medium,
  },
  gradient: {
    borderRadius: BORDER_RADIUS.md,
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    marginRight: 8,
  },
  outlinedButton: {
    borderColor: COLORS.primary,
    borderWidth: 2,
    paddingVertical: 10,
    paddingHorizontal: 18,
    backgroundColor: 'transparent',
    ...SHADOWS.light,
  },
  textButton: {
    backgroundColor: 'transparent',
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  disabledButton: {
    opacity: 0.6,
  },
  disabledOutlinedButton: {
    borderColor: COLORS.textTertiary,
    opacity: 0.6,
  },
  disabledTextButton: {
    opacity: 0.6,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  containedLabel: {
    color: COLORS.buttonText,
  },
  outlinedLabel: {
    color: COLORS.primary,
  },
  textLabel: {
    color: COLORS.primary,
  },
});

export default Button; 