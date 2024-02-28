import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import WelcomePage from './src/Screens/WelcomePage';
import LoginPage from './src/Screens/LoginPage';
import SignupPage from './src/Screens/SignupPage';
import HomePage from './src/Screens/HomePage';
const Stack = createNativeStackNavigator();

const App = () => (
  <NavigationContainer>
    <Stack.Navigator initialRouteName="WelcomePage">
    <Stack.Screen name="WelcomePage" component={WelcomePage} />
    <Stack.Screen name="LoginPage" component={LoginPage} />
    <Stack.Screen name="SignupPage" component={SignupPage} />
    <Stack.Screen name="HomePage" component={HomePage} />
    </Stack.Navigator>
  </NavigationContainer>
);

export default App;
