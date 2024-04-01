import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useState, useEffect } from "react";
import { StyleSheet, Text, TextInput, View, Button } from "react-native";
import RNPickerSelect from "react-native-picker-select";
import config from "../Config/config";
import axios from "axios";
import { firebase } from "../Config/firebaseConfig";

export default function GymManagerSignupGym() {
  const [name, setName] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [gymType, setGymType] = useState("");
  const [administrator, setAdministrator] = useState("");

  useEffect(() => {
    async function fetchAdministrator() {
      const administratorValue = await AsyncStorage.getItem("user");
      const parsedAdministrator = JSON.parse(administratorValue);
      setAdministrator(parsedAdministrator);
      console.log(administrator);
    }
    fetchAdministrator();
  }, []);

  const createGym = async () => {
    try {
      let gymData = {};

      if (name && latitude && longitude && gymType) {
        gymData = {
          name: name,
          coords: new firebase.firestore.GeoPoint(latitude, longitude),
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
    <View style={styles.container}>
      <Text style={styles.text}>Create Gym</Text>
      <TextInput
        style={styles.input}
        placeholder="Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Latitude"
        value={latitude}
        onChangeText={setLatitude}
      />
      <TextInput
        style={styles.input}
        placeholder="Longitude"
        value={longitude}
        onChangeText={setLongitude}
      />
      <RNPickerSelect
        style={pickerSelectStyles}
        onValueChange={(value) => setGymType(value)}
        placeholder={{ label: "Select Gym Type", value: null }}
        items={[
          { label: "Workout", value: "workout" },
          { label: "Training", value: "training" },
        ]}
      />
      <Button title="Create Gym" onPress={createGym} />
    </View>
  );
}

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 4,
    color: "black",
    paddingRight: 30, // to ensure the text is never behind the icon
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 0.5,
    borderColor: "purple",
    borderRadius: 8,
    color: "black",
    paddingRight: 30, // to ensure the text is never behind the icon
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    height: 40,
    width: 300,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
});
