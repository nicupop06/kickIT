import React, { useState } from "react";
import {
  TouchableOpacity,
  View,
  TextInput,
  StyleSheet,
  Text,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import config from "../Config/config";
import axios from "axios";
import { LinearGradient } from "expo-linear-gradient";

export default function MainSignupPage({ navigation }) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleSignUp = async () => {
    try {
      const userData = {
        email: email,
        password: password,
        firstName: firstName,
        lastName: lastName,
        dateOfBirth: dateOfBirth.toLocaleDateString(),
        memberSince: new Date().toLocaleDateString(),
        noEntries: 0,
      };

      const sendURL = config.getRouteUrl(config.SERVER_ROUTES.SIGNUP_USER);
      const response = await axios.post(sendURL, {
        userData: userData,
      });

      navigation.navigate("WelcomePage");
    } catch (error) {
      if (error.response) {
        alert(error.response.data.error);
      } else if (error.request) {
        console.error(error.request);
      } else {
        console.error("Error", error.message);
      }
    }
  };

  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || dateOfBirth;
    setShowDatePicker(false);
    setDateOfBirth(currentDate);
  };

  return (
    <LinearGradient colors={["#4CAF50", "#2196F3"]} style={styles.container}>
      <View style={styles.innerContainer}>
        <Text style={styles.title}>Sign Up</Text>
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={true}
        />
        <TextInput
          style={styles.input}
          placeholder="First Name"
          value={firstName}
          onChangeText={setFirstName}
        />
        <TextInput
          style={styles.input}
          placeholder="Last Name"
          value={lastName}
          onChangeText={setLastName}
        />
        <TouchableOpacity
          style={styles.dateButton}
          onPress={() => setShowDatePicker(true)}
        >
          <Text style={styles.buttonText}>Choose Date</Text>
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            testID="datePicker"
            value={dateOfBirth}
            mode="date"
            is24Hour={true}
            display="default"
            onChange={onDateChange}
          />
        )}
        <TouchableOpacity style={styles.signUpButton} onPress={handleSignUp}>
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  innerContainer: {
    width: "80%",
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  input: {
    width: "100%",
    height: 40,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  dateButton: {
    backgroundColor: "green",
    width: "100%",
    height: 40,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
  signUpButton: {
    backgroundColor: "blue",
    width: "100%",
    height: 40,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 50,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
  },
});
