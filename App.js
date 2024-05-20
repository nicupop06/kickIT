import "react-native-gesture-handler";
import React from "react";
import { Image } from "react-native";
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
import QRScannerPage from "./src/Screens/QRScannerPage";
import StripePaymentPage from "./src/Screens/StripePaymentPage";
import GymStatsPage from "./src/Screens/GymStatsPage";
import MyProfilePage from "./src/Screens/MyProfilePage";
import GymLogsPage from "./src/Screens/GymLogsPage";

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

const HomeDrawer = () => (
  <Drawer.Navigator>
    <Drawer.Screen
      name="Main Page"
      component={MainHomePage}
      options={{ title: "Available gyms", headerTitleAlign: "center" }}
    />
    <Drawer.Screen
      name="Profile"
      component={MyProfilePage}
      options={{ title: "Profile", headerTitleAlign: "center" }}
    />
    <Drawer.Screen
      name="Training Timer"
      component={TimerPage}
      options={{ title: "Training timer", headerTitleAlign: "center" }}
    />
    <Drawer.Screen
      name="My Workouts"
      component={VideosPage}
      options={{ title: "My Workouts", headerTitleAlign: "center" }}
    />
    <Drawer.Screen
      name="Scan Gym QR"
      component={QRScannerPage}
      options={{ title: "Scan Gym QR", headerTitleAlign: "center" }}
    />
  </Drawer.Navigator>
);

const GymHomeDrawer = () => (
  <Drawer.Navigator>
    <Drawer.Screen
      name="Your Gyms"
      component={GymManagerHomePage}
      options={{ title: "Your Gyms", headerTitleAlign: "center" }}
    />
    <Drawer.Screen
      name="Register Gym"
      component={GymManagerSignupGym}
      options={{ title: "Register Gym", headerTitleAlign: "center" }}
    />
  </Drawer.Navigator>
);

const App = () => (
  <NavigationContainer>
    <Stack.Navigator initialRouteName="WelcomePage">
      <Stack.Screen
        name="WelcomePage"
        component={MainWelcomePage}
        options={{
          title: "KickIT",
          headerTitleAlign: "center",
        }}
      />
      <Stack.Screen
        name="LoginPage"
        component={MainLoginPage}
        options={{ title: "", headerTitleAlign: "center" }}
      />
      <Stack.Screen
        name="SignupPage"
        component={MainSignupPage}
        options={{ title: "", headerTitleAlign: "center" }}
      />
      <Stack.Screen
        name="GymLoginPage"
        component={GymManagerLoginPage}
        options={{ title: "Administrator Portal", headerTitleAlign: "center" }}
      />
      <Stack.Screen
        name="PaymentPage"
        component={StripePaymentPage}
        options={{ title: "Pay with Stripe", headerTitleAlign: "center" }}
      />
      <Stack.Screen
        name="StatsPage"
        component={GymStatsPage}
        options={{ title: "Statistics", headerTitleAlign: "center" }}
      />
      <Stack.Screen
        name="LogsPage"
        component={GymLogsPage}
        options={{ title: "Administrator Logs", headerTitleAlign: "center" }}
      />
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
