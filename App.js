import "react-native-gesture-handler";
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import MainWelcomePage from "./src/Screens/MainWelcomePage";
import MainLoginPage from "./src/Screens/MainLoginPage";
import MainSignupPage from "./src/Screens/MainSignupPage";
import MainHomePage from "./src/Screens/MainHomePage";
import { createDrawerNavigator } from "@react-navigation/drawer";
import TimerPage from "./src/Screens/TimerPage";
import VideosPage from "./src/Screens/VideosPage";
import GymManagerLoginPage from "./src/Screens/GymManagerLoginPage";
import GymManagerHomePage from "./src/Screens/GymManagerHomePage";
import GymManagerSignupGym from "./src/Screens/GymManagerSignupGym";

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

const HomeDrawer = () => (
  <Drawer.Navigator>
    <Drawer.Screen name="Main Page" component={MainHomePage} />
    <Drawer.Screen name="Training Timer" component={TimerPage} />
    <Drawer.Screen name="My Workouts" component={VideosPage} />
  </Drawer.Navigator>
);

const GymHomeDrawer = () => (
  <Drawer.Navigator>
    <Drawer.Screen name="Your Gyms" component={GymManagerHomePage} />
    <Drawer.Screen name="Register Gym" component={GymManagerSignupGym} />
  </Drawer.Navigator>
);

const App = () => (
  <NavigationContainer>
    <Stack.Navigator initialRouteName="WelcomePage">
      <Stack.Screen name="WelcomePage" component={MainWelcomePage} />
      <Stack.Screen name="LoginPage" component={MainLoginPage} />
      <Stack.Screen name="SignupPage" component={MainSignupPage} />
      <Stack.Screen name="GymLoginPage" component={GymManagerLoginPage} />
      <Stack.Screen
        name="HomePage"
        component={HomeDrawer}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="GymManagerHomePage"
        component={GymHomeDrawer}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  </NavigationContainer>
);

export default App;
