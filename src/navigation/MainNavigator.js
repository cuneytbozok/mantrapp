import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { useTheme } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import HomeScreen from '../screens/main/HomeScreen';
import FavoritesScreen from '../screens/main/FavoritesScreen';
import RandomScreen from '../screens/main/RandomScreen';
import JournalScreen from '../screens/main/JournalScreen';
import AddJournalScreen from '../screens/main/AddJournalScreen';
import JournalDetailScreen from '../screens/main/JournalDetailScreen';
import MantraDetailScreen from '../screens/main/MantraDetailScreen';
import ProfileScreen from '../screens/main/ProfileScreen';
import { COLORS, SHADOWS, BORDER_RADIUS, gradients } from '../constants/theme';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Stack navigators for each tab
const HomeStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="HomeMain" component={HomeScreen} />
    <Stack.Screen name="MantraDetail" component={MantraDetailScreen} />
  </Stack.Navigator>
);

const FavoritesStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="FavoritesMain" component={FavoritesScreen} />
    <Stack.Screen name="MantraDetail" component={MantraDetailScreen} />
  </Stack.Navigator>
);

const RandomStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="RandomMain" component={RandomScreen} />
    <Stack.Screen name="MantraDetail" component={MantraDetailScreen} />
  </Stack.Navigator>
);

const JournalStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="JournalMain" component={JournalScreen} />
    <Stack.Screen name="AddJournal" component={AddJournalScreen} />
    <Stack.Screen name="JournalDetail" component={JournalDetailScreen} />
  </Stack.Navigator>
);

const ProfileStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="ProfileMain" component={ProfileScreen} />
  </Stack.Navigator>
);

const MainNavigator = () => {
  const theme = useTheme();

  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Favorites') {
            iconName = focused ? 'heart' : 'heart-outline';
          } else if (route.name === 'Random') {
            iconName = focused ? 'shuffle' : 'shuffle-outline';
          } else if (route.name === 'Journal') {
            iconName = focused ? 'book' : 'book-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: COLORS.sereneBlue,
        tabBarInactiveTintColor: COLORS.warmGray,
        tabBarStyle: {
          backgroundColor: COLORS.softWhite,
          borderTopWidth: 0,
          elevation: 0,
          height: 60,
          paddingBottom: 5,
          ...SHADOWS.light,
        },
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={HomeStack} />
      <Tab.Screen name="Favorites" component={FavoritesStack} />
      <Tab.Screen 
        name="Random" 
        component={RandomStack} 
        options={{
          tabBarButton: (props) => (
            <TabBarCenterButton {...props} />
          ),
        }}
      />
      <Tab.Screen name="Journal" component={JournalStack} />
      <Tab.Screen name="Profile" component={ProfileStack} />
    </Tab.Navigator>
  );
};

// Custom center button component
const TabBarCenterButton = (props) => {
  const { children, onPress } = props;
  
  return (
    <TouchableOpacity
      style={{
        top: -20,
        justifyContent: 'center',
        alignItems: 'center',
      }}
      onPress={onPress}
    >
      <LinearGradient
        colors={gradients.button}
        style={{
          width: 60,
          height: 60,
          borderRadius: 30,
          justifyContent: 'center',
          alignItems: 'center',
          ...SHADOWS.medium,
        }}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {React.isValidElement(children) ? children : <Text>{children}</Text>}
      </LinearGradient>
    </TouchableOpacity>
  );
};

export default MainNavigator; 