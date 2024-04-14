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
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  button: {
    marginTop: 20,
    paddingVertical: 15,
    paddingHorizontal: 40,
    backgroundColor: "#4CAF50", // Green color
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    elevation: 3, // Add shadow
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold", // Add bold font weight
  },
  manageGymsButton: {
    marginTop: 20,
    paddingVertical: 15,
    paddingHorizontal: 40,
    backgroundColor: "#2196F3", // Blue color
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    elevation: 3,
  },
});
