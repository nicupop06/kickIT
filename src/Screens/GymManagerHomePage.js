import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, Button } from "react-native";
import config from "../Config/config";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function GymManagerHomePage({ navigation }) {
  const [email, setEmail] = useState("");
  const [user, setUser] = useState(null);

  const handleLogout = async () => {
    const sendURL = config.getRouteUrl(config.SERVER_ROUTES.LOGOUT);
    try {
      const response = await axios.post(sendURL);
      AsyncStorage.removeItem("email");
      console.log(`${email} logged out`);
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

  useEffect(() => {
    AsyncStorage.getItem("email")
      .then((storedEmail) => {
        if (storedEmail) {
          setEmail(storedEmail);
          console.log(`${email} logged in`);
          getUserFromFirestore(storedEmail);
        }
      })
      .catch((error) => {
        alert("Error retrieving email from AsyncStorage:", error);
      });
  }, [email]);

  //Collect the whole user after email is taken from localstorage
  const getUserFromFirestore = async (fncEmail) => {
    try {
      const sendURL = config.getRouteUrl(config.SERVER_ROUTES.USERS);
      console.log(`!!!!!${fncEmail}`);
      const response = await axios.get(sendURL, {
        params: {
          email: fncEmail,
        },
      });
      console.log(response.data.user);
      setUser(response.data.user);
    } catch (error) {
      console.error("Error getting user from Firestore:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Hello, React Native!</Text>
      <View style={styles.buttonContainer}>
        <Button title="Log Out" onPress={handleLogout} />
      </View>
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
  text: {
    fontSize: 24,
    fontWeight: "bold",
  },
  buttonContainer: {
    position: "absolute",
    bottom: 20,
    right: 20,
  },
});
