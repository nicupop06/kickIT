import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../Config/firebaseConfig";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import FontAwesomeIcon from "react-native-vector-icons/FontAwesome";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { createDrawerNavigator } from "@react-navigation/drawer";

const usersRef = collection(db, "users");

export default function HomePage() {
  //For local storage
  const [email, setEmail] = useState("");
  const [user, setUser] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [kbgyms, setKbGyms] = useState([]);

  //For map
  const [location, setLocation] = useState(null);

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

  //Ask for map permissions in order to show it from where the user is
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      try {
        let location = await Location.getCurrentPositionAsync({});
        setLocation(location);
        console.log(status);
      } catch (error) {
        setErrorMsg("Error getting current location");
      }
    })();

    // Get all kick-boxing gyms in Firestore collection
    db.collection("kbgyms")
      .get()
      .then((querySnapshot) => {
        const updatedLocations = querySnapshot.docs.map((doc) => {
          if (doc.data().coords) {
            return { ...doc.data(), id: doc.id };
          }
        });
        setKbGyms(updatedLocations);
      })
      .catch((error) => {
        console.log("Error getting documents: ", error);
      });

    // Set up listener to Firestore collection
    const unsubscribe = db.collection("kbgyms").onSnapshot((snapshot) => {
      const updatedLocations = snapshot.docs.map((doc) => {
        if (doc.data().coords) {
          return { ...doc.data(), id: doc.id };
        }
      });
      setKbGyms(updatedLocations);
    });

    // Clean up listener on unmount
    return () => unsubscribe();
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
      {errorMsg ? (
        <Text>{errorMsg}</Text>
      ) : location ? (
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: 0.09,
            longitudeDelta: 0.04,
          }}
        >
          <Marker
            coordinate={location.coords}
            title="You are here"
            description="Your current location"
          >
            <FontAwesomeIcon name="user" size={30} color="blue" />
          </Marker>
          {kbgyms.map((loc) => (
            <Marker
              key={`${loc.id}`}
              coordinate={{
                latitude: parseFloat(loc.coords.latitude),
                longitude: parseFloat(loc.coords.longitude),
              }}
              title={loc.name}
            >
              <MaterialCommunityIcons
                name="boxing-glove"
                size={30}
                color={loc.type === "workout" ? "red" : "black"}
              />
            </Marker>
          ))}
        </MapView>
      ) : (
        <Text style={styles.loading}>Loading...</Text>
      )}
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
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  loading: {
    fontWeight: "bold",
    fontSize: 30,
    color: "orange",
    textAlign: "center",
  },
});
