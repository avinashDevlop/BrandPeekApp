import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './screens/HomeScreen';
import BrandDetailScreen from './screens/BrandDetailScreen';

// Create stack navigator
const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: '#667eea', // Matching the gradient
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen 
          name="Home" 
          component={HomeScreen} 
          options={{ title: 'Top Brands' }}
        />
        <Stack.Screen 
          name="BrandDetail" 
          component={BrandDetailScreen} 
          options={({ route }) => ({ title: route.params.brand.name })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}