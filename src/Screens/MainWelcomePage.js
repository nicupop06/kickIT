import React, { useState } from "react";
import {
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function MainWelcomePage({ navigation }) {
  const [loginPressed, setLoginPressed] = useState(false);
  const [signUpPressed, setSignUpPressed] = useState(false);

  const handleLoginPress = () => {
    navigation.navigate("LoginPage");
  };

  const handleSignUpPress = () => {
    navigation.navigate("SignupPage");
  };

  const handleManageGymsPress = () => {
    navigation.navigate("GymLoginPage");
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.button, loginPressed && styles.buttonPressed]}
        onPress={handleLoginPress}
        onPressIn={() => setLoginPressed(true)}
        onPressOut={() => setLoginPressed(false)}
      >
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.button, signUpPressed && styles.buttonPressed]}
        onPress={handleSignUpPress}
        onPressIn={() => setSignUpPressed(true)}
        onPressOut={() => setSignUpPressed(false)}
      >
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.button, styles.manageGymsButton]}
        onPress={handleManageGymsPress}
      >
        <Text style={styles.buttonText}>Manage Your Gyms</Text>
      </TouchableOpacity>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "blue",
    borderRadius: 5,
  },
  buttonPressed: {
    backgroundColor: "darkblue",
  },
  manageGymsButton: {
    marginTop: 20,
    backgroundColor: "green", // Example color, adjust as needed
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
  },
});
