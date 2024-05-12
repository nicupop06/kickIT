import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, Button, FlatList } from "react-native";
import config from "../Config/config";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { TouchableOpacity } from "react-native-gesture-handler";
import { LinearGradient } from "expo-linear-gradient";

export default function GymManagerHomePage({ navigation }) {
  const [email, setEmail] = useState("");
  const [user, setUser] = useState(null);
  const [adminGyms, setAdminGyms] = useState([]);

  const fetchAdminGyms = async () => {
    try {
      const sendURL = config.getRouteUrl(config.SERVER_ROUTES.ADMIN_KGBYMS);
      const response = await axios.get(sendURL, {
        params: {
          email: email,
        },
      });

      setAdminGyms(response.data.adminGyms);
    } catch (error) {
      alert("Error fetching gyms");
    }
  };

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
    async function fetchEmail() {
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
    }
    fetchEmail();
    fetchAdminGyms();
  }, [email]);

  //Collect the whole user after email is taken from localstorage
  const getUserFromFirestore = async (fncEmail) => {
    try {
      const sendURL = config.getRouteUrl(config.SERVER_ROUTES.USERS);
      const response = await axios.get(sendURL, {
        params: {
          email: fncEmail,
        },
      });
      setUser(response.data.user);
      AsyncStorage.setItem("user", JSON.stringify(response.data.user));
    } catch (error) {
      console.error("Error getting user from Firestore:", error);
    }
  };

  return (
    <LinearGradient colors={["#4CAF50", "#2196F3"]} style={styles.gradient}>
      <View style={styles.container}>
        <FlatList
          data={adminGyms}
          keyExtractor={(item) => item.name}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.item}
              onPress={() =>
                navigation.navigate("StatsPage", { gymName: item.name })
              }
            >
              <Text>{item.name}</Text>
              <Text>{item.noEntries * item.entryPrice} RON</Text>
              <Text style={{ color: "blue" }}>Click for details</Text>
            </TouchableOpacity>
          )}
        />
        <View style={styles.buttonContainer}>
          <Button title="Log Out" onPress={handleLogout} color={"blue"} />
        </View>
      </View>
    </LinearGradient>
  );
}

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
  text: {
    fontSize: 24,
    fontWeight: "bold",
  },
  buttonContainer: {
    position: "absolute",
    bottom: 20,
    right: 20,
  },
  item: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
});
