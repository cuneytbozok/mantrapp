import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text, IconButton } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, TYPOGRAPHY, SPACING, gradients } from '../constants/theme';

const Header = ({ 
  title, 
  showBackButton = false, 
  rightIcon, 
  onRightIconPress,
  useGradient = false,
  gradientColors = gradients.primary,
  style
}) => {
  const navigation = useNavigation();

  if (useGradient) {
    return (
      <LinearGradient
        colors={gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.container, style]}
      >
        <View style={styles.leftContainer}>
          {showBackButton ? (
            <IconButton
              icon="arrow-left"
              iconColor={COLORS.warmGray}
              size={24}
              onPress={() => navigation.goBack()}
              style={styles.backButton}
            />
          ) : null}
          <Text style={styles.title}>{title}</Text>
        </View>
        {rightIcon ? (
          <IconButton
            icon={rightIcon}
            iconColor={COLORS.warmGray}
            size={24}
            onPress={onRightIconPress}
          />
        ) : null}
      </LinearGradient>
    );
  }

  return (
    <View style={[styles.container, style]}>
      <View style={styles.leftContainer}>
        {showBackButton ? (
          <IconButton
            icon="arrow-left"
            iconColor={COLORS.warmGray}
            size={24}
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          />
        ) : null}
        <Text style={styles.title}>{title}</Text>
      </View>
      {rightIcon ? (
        <IconButton
          icon={rightIcon}
          iconColor={COLORS.warmGray}
          size={24}
          onPress={onRightIconPress}
        />
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    backgroundColor: COLORS.softWhite,
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: SPACING.sm,
  },
  title: {
    fontSize: TYPOGRAPHY.fontSizes.xl,
    fontWeight: TYPOGRAPHY.fontWeights.bold,
    color: COLORS.warmGray,
  },
});

export default Header; 