import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Button,
  FlatList,
  ActivityIndicator,
} from "react-native";
import config from "../Config/config";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { TouchableOpacity } from "react-native-gesture-handler";
import { LinearGradient } from "expo-linear-gradient";

export default function GymManagerHomePage({ navigation }) {
  const [email, setEmail] = useState("");
  const [user, setUser] = useState(null);
  const [adminGyms, setAdminGyms] = useState([]);
  const [loading, setLoading] = useState(true);

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
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    const sendURL = config.getRouteUrl(config.SERVER_ROUTES.LOGOUT);
    try {
      await axios.post(sendURL);
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
      try {
        const storedEmail = await AsyncStorage.getItem("email");
        if (storedEmail) {
          setEmail(storedEmail);
          console.log(`${storedEmail} logged in`);
          getUserFromFirestore(storedEmail);
        }
      } catch (error) {
        alert("Error retrieving email from AsyncStorage:", error);
      }
    }
    fetchEmail();
  }, []);

  useEffect(() => {
    if (email) {
      fetchAdminGyms();
    }
  }, [email]);

  // Collect the whole user after email is taken from local storage
  const getUserFromFirestore = async (fncEmail) => {
    try {
      const sendURL = config.getRouteUrl(config.SERVER_ROUTES.USERS);
      const response = await axios.get(sendURL, {
        params: {
          email: fncEmail,
        },
      });
      setUser(response.data.user);
      await AsyncStorage.setItem("user", JSON.stringify(response.data.user));
    } catch (error) {
      console.error("Error getting user from Firestore:", error);
    }
  };

  return (
    <LinearGradient colors={["#4CAF50", "#2196F3"]} style={styles.gradient}>
      <View style={styles.container}>
        {loading ? (
          <ActivityIndicator size="large" color="#fff" />
        ) : (
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
                <Text style={{ textAlign: "center" }}>{item.name}</Text>
                <Text style={{ textAlign: "center" }}>
                  Money generated: {item.noEntries * item.entryPrice} RON
                </Text>
                <Text style={{ color: "blue", textAlign: "center" }}>
                  Click for details
                </Text>
              </TouchableOpacity>
            )}
          />
        )}
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
    left: "50%",
  },
  item: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
});
