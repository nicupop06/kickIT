import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, Button } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { db } from "../Config/firebaseConfig";
import MapView, { Marker, Callout } from "react-native-maps";
import * as Location from "expo-location";
import FontAwesomeIcon from "react-native-vector-icons/FontAwesome";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import config from "../Config/config";
import axios from "axios";

export default function MainHomePage({ navigation }) {
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
        if (storedEmail) {
          setEmail(storedEmail);
          getUserFromFirestore(storedEmail);
        }
      })
      .catch((error) => {
        alert("Error retrieving email from AsyncStorage:", error);
      });
  }, [email]);

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

  const fetchReviewsForGym = async (gymId) => {
    console.log(gymId);
    const sendURL = config.getRouteUrl(config.SERVER_ROUTES.REVIEWS);
      const response = await axios.get(sendURL, {
        params: {
          gymId: gymId,
        },
      });

    return response.data;
  }

  const handleReviews = async (gymId) => {
    fetchReviewsForGym(gymId);
    
  }

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
      // console.log(user);
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
          {kbgyms.map((loc) => {
            // console.log(loc);
            return (
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
                <Callout style={{ width: 120 }} onPress={() => handleReviews(loc.id)}>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontWeight: "bold", textAlign: 'center' }}>
                      {loc.name}
                    </Text>
                    <Text style={{ textAlign: 'center' }}>Price: {loc.entryPrice}</Text>
                    <Text style={{ textAlign: 'center', color: 'blue' }}>press for reviews</Text>
                  </View>
                </Callout>
              </Marker>
            );
          })}
        </MapView>
      ) : (
        <Text style={styles.loading}>Loading...</Text>
      )}
      <View style={styles.buttonContainer}>
        <Button title="Log Out" onPress={handleLogout} />
      </View>
      <View style={styles.legendContainer}>
        <View style={styles.legendBox}>
          <View style={[styles.colorSquare, { backgroundColor: "red" }]} />
          <Text style={styles.legendText}>Workout</Text>
        </View>
        <View style={styles.legendBox}>
          <View style={[styles.colorSquare, { backgroundColor: "black" }]} />
          <Text style={styles.legendText}>Training</Text>
        </View>
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
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  loading: {
    fontWeight: "bold",
    fontSize: 30,
    color: "orange",
    textAlign: "center",
  },
  buttonContainer: {
    position: "absolute",
    bottom: 20,
    right: 20,
  },
  legendContainer: {
    position: "absolute",
    bottom: 30,
    left: 20,
    flexDirection: "row",
  },
  legendBox: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 20,
  },
  colorSquare: {
    width: 20,
    height: 20,
    marginRight: 5,
  },
  legendText: {
    color: "black",
    fontWeight: "bold",
  },
});
