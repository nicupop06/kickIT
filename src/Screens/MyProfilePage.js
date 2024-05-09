import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import config from "../Config/config";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function MyProfilePage() {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState("");
  const [rank, setRank] = useState(-1);
  const [noUsers, setNoUsers] = useState(-1);

  useEffect(() => {
    async function fetchUserRank() {
      const sendURL = config.getRouteUrl(config.SERVER_ROUTES.USER_RANK);
      const response = await axios.get(sendURL, {
        params: {
          email: email,
        },
      });
      if (response.data.rank >= 0 && response.data.noUsers >= 0) {
        setRank(response.data.rank);
        setNoUsers(response.data.noUsers);
      } else {
        console.log("Error receiving rank");
      }
    }

    fetchUserRank();
  }, [email]); // Fetch rank when email changes

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
        console.error("Error retrieving email from AsyncStorage:", error);
        alert("Error retrieving email from AsyncStorage:", error);
      }
    }
    fetchEmail();
  }, []); // Fetch email only once on component mount

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
    <View style={styles.container}>
      {user && (
        <>
          <View style={styles.profileHeader}>
            <Text style={styles.fullName}>{user.firstName} {user.lastName} #{rank}/{noUsers}</Text>
          </View>
          <View style={styles.profileInfo}>
            <View style={styles.infoField}>
              <Text style={styles.label}>Email:</Text>
              <Text style={styles.value}>{user.email}</Text>
            </View>
            <View style={styles.infoField}>
              <Text style={styles.label}>Date of Birth:</Text>
              <Text style={styles.value}>{user.dateOfBirth}</Text>
            </View>
            <View style={styles.infoField}>
              <Text style={styles.label}>Member Since:</Text>
              <Text style={styles.value}>{user.memberSince}</Text>
            </View>
            <View style={styles.infoField}>
              <Text style={styles.label}>Number of entries:</Text>
              <Text style={styles.value}>{user.noEntries}</Text>
            </View>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
  },
  profileHeader: {
    alignItems: "center",
    marginBottom: 20,
  },
  fullName: {
    fontSize: 24,
    fontWeight: "bold",
  },
  profileInfo: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  infoField: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  label: {
    fontWeight: "bold",
    marginRight: 5,
  },
  value: {
    flexShrink: 1,
  },
});
