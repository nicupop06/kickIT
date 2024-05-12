import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
} from "react-native";
import RNPickerSelect from "react-native-picker-select";
import config from "../Config/config";
import axios from "axios";
import { firebase } from "../Config/firebaseConfig";
import { LinearGradient } from "expo-linear-gradient";

export default function GymManagerSignupGym() {
  const [name, setName] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [entryPrice, setEntryPrice] = useState("");
  const [gymType, setGymType] = useState("");
  const [administrator, setAdministrator] = useState("");

  useEffect(() => {
    async function fetchAdministrator() {
      const administratorValue = await AsyncStorage.getItem("user");
      const parsedAdministrator = JSON.parse(administratorValue);
      setAdministrator(parsedAdministrator);
    }
    fetchAdministrator();
  }, []);

  const createGym = async () => {
    try {
      let gymData = {};

      if (name && latitude && longitude && entryPrice && gymType) {
        gymData = {
          name: name,
          coords: new firebase.firestore.GeoPoint(latitude, longitude),
          entryPrice: entryPrice,
          type: gymType,
          owner: administrator.email,
        };

        const sendURL = config.getRouteUrl(config.SERVER_ROUTES.SIGNUP_GYM);
        const response = await axios.post(sendURL, {
          gymData: gymData,
        });
        alert("Gym registered successfully!");
      } else {
        alert("Required fields are missing!");
      }
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

  return (
    <LinearGradient colors={["#4CAF50", "#2196F3"]} style={styles.gradient}>
      <View style={styles.container}>
        <View style={styles.innerContainer}>
          <View style={styles.inputContainer}>
            <Text style={styles.title}>Create Gym</Text>
          </View>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Name"
              value={name}
              onChangeText={setName}
            />
          </View>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Latitude"
              value={latitude}
              onChangeText={setLatitude}
              keyboardType="numeric"
            />
          </View>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Longitude"
              value={longitude}
              onChangeText={setLongitude}
              keyboardType="numeric"
            />
          </View>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Entry Price"
              value={entryPrice}
              onChangeText={setEntryPrice}
              keyboardType="numeric"
            />
          </View>
          <RNPickerSelect
            style={pickerSelectStyles}
            onValueChange={(value) => setGymType(value)}
            placeholder={{ label: "Select Gym Type", value: null }}
            items={[
              { label: "Workout", value: "workout" },
              { label: "Training", value: "training" },
            ]}
          />
          <TouchableOpacity style={styles.button} onPress={createGym}>
            <Text style={styles.buttonText}>Create Gym</Text>
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  );
}

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    color: "black",
    paddingRight: 30,
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    color: "black",
    paddingRight: 30,
  },
});

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  innerContainer: {
    width: "95%",
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
  },
  inputContainer: {
    marginBottom: 20,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    height: 40,
    width: "80%", // Set width to 80% of the container
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#4CAF50",
    borderRadius: 25,
    paddingVertical: 15,
    paddingHorizontal: 40,
    elevation: 3,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
