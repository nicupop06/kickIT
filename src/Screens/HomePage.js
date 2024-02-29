import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, Button } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../Config/firebaseConfig";

const usersRef = collection(db, "users");

export default function HomePage({ navigation }) {
  const [email, setEmail] = useState("");
  const [user, setUser] = useState(null);

  //Get email from localstorage (login placed it there)
  useEffect(() => {
    AsyncStorage.getItem("email")
      .then((storedEmail) => {
        setEmail(storedEmail);
        if (storedEmail) {
          getUserFromFirestore(storedEmail);
        }
      })
      .catch((error) => {
        alert("Error retrieving email from AsyncStorage:", error);
      });
  }, []);

  //Collect the whole user after email is taken from localstorage
  const getUserFromFirestore = async (email) => {
    try {
      const q = query(usersRef, where("email", "==", email));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        setUser(doc.data());
      });
    } catch (error) {
      console.error("Error getting user from Firestore:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text>
        {email ? `${JSON.stringify(email)} You are in!` : "It did not work"}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  userInfo: {
    marginTop: 20,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
  },
});

