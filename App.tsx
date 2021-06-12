import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from './screens/Home';
import Profile from './screens/Profile';
import { Ionicons } from '@expo/vector-icons';
import Friends from './screens/Friends';
import FeedDetailScreen from './screens/FeedDetail';
import LoginScreen from './screens/Login';
import SignupScreen from './screens/Signup';

const FeedsStack = createStackNavigator();
const ProfileStack = createStackNavigator();
const FriendStack = createStackNavigator();
const Tab = createBottomTabNavigator();

const FeedsStackScreens = () => {
  const isSignedIn = false;
  return (
    <FeedsStack.Navigator
      screenOptions={{ headerBackTitleVisible: false }}
      initialRouteName={isSignedIn ? 'Home' : 'Login'}
    >
      {isSignedIn ? (
        <>
          <FeedsStack.Screen
            name='Home'
            component={HomeScreen}
            options={{ title: 'Twitter' }}
          />
          <FeedsStack.Screen
            name='FeedDetail'
            component={FeedDetailScreen}
            options={{ title: 'Details' }}
          />
        </>
      ) : (
        <>
          <FeedsStack.Screen
            name='Login'
            component={LoginScreen}
            options={{ headerTransparent: true, headerTitle: '' }}
          />
          <FeedsStack.Screen
            name='Signup'
            component={SignupScreen}
            options={{ headerTransparent: true, headerTitle: '' }}
          />
        </>
      )}
    </FeedsStack.Navigator>
  );
};

const ProfileStackScreens = () => (
  <ProfileStack.Navigator>
    <ProfileStack.Screen
      name='Profile'
      component={Profile}
      options={{ title: 'Profile' }}
    />
  </ProfileStack.Navigator>
);

const FriendStackScreens = () => (
  <FriendStack.Navigator>
    <FriendStack.Screen
      name='Friends'
      component={Friends}
      options={{ title: 'Friends' }}
    />
  </FriendStack.Navigator>
);

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName = 'ios=home-outline';
            switch (route.name) {
              case 'Feeds':
                iconName = focused ? 'home' : 'home-outline';
                break;
              case 'Profile':
                iconName = focused ? 'person-circle' : 'person-circle-outline';
                break;
              case 'Friends':
                iconName = focused ? 'people' : 'people-outline';
              default:
                break;
            }
            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarVisible: route.name !== 'Login',
        })}
        tabBarOptions={{
          activeTintColor: 'green',
          inactiveTintColor: 'gray',
        }}
      >
        <Tab.Screen
          options={(navigation) => ({
            tabBarVisible: navigation.route.key !== 'Login',
          })}
          name='Feeds'
          component={FeedsStackScreens}
        />
        <Tab.Screen name='Profile' component={ProfileStackScreens} />
        <Tab.Screen name='Friends' component={FriendStackScreens} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
