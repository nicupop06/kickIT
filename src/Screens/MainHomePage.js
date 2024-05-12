import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Button,
  Modal,
  ActivityIndicator,
  FlatList,
  TextInput,
} from "react-native";
import { AirbnbRating } from "react-native-ratings";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { db } from "../Config/firebaseConfig";
import MapView, { Marker, Callout, PROVIDER_GOOGLE } from "react-native-maps";
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
  const [modalVisible, setModalVisible] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [selectedGym, setSelectedGym] = useState("");
  const [reviewText, setReviewText] = useState("");
  const [starRating, setStarRating] = useState(0);

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

  useEffect(() => {
  }, [starRating, reviewText]);

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
    const sendURL = config.getRouteUrl(config.SERVER_ROUTES.REVIEWS);
    const response = await axios.get(sendURL, {
      params: {
        gymId: gymId,
      },
    });

    return response.data;
  };

  const handleCreateReview = async () => {
    console.log(selectedGym);
    const reviewData = {
      name: user.firstName,
      stars: starRating,
      gymId: selectedGym,
      text: reviewText,
    };
    const sendURL = config.getRouteUrl(config.SERVER_ROUTES.REVIEWS);
    const response = await axios.post(sendURL, {
      reviewData: reviewData,
    });
    alert("Thanks for the review!");
    setReviewText("");
  };

  const handleCalloutPress = async (gymId) => {
    // Fetch reviews from Firebase when callout is pressed
    setSelectedGym(gymId);
    setLoadingReviews(true);
    try {
      const gymReviews = await fetchReviewsForGym(gymId);
      setReviews(gymReviews.reviews);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    } finally {
      setLoadingReviews(false);
      setModalVisible(true);
    }
  };

  const renderReviews = ({ item }) => (
    <View style={styles.reviewItem}>
      <Text style={styles.reviewText}>{item.date}</Text>
      <Text style={styles.reviewText}>{item.name}</Text>
      <Text style={styles.reviewText}>{item.text}</Text>
      <AirbnbRating
        count={5}
        defaultRating={item.stars}
        size={20}
        showRating={true}
        isDisabled
      />
    </View>
  );

  const handleStarRatingChange = (rating) => {
    setStarRating(rating);
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

  //Collect the whole user after email is taken from localstorage
  const getUserFromFirestore = async (fncEmail) => {
    try {
      const sendURL = config.getRouteUrl(config.SERVER_ROUTES.USERS);
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
      {errorMsg ? (
        <Text>{errorMsg}</Text>
      ) : location ? (
        <MapView
          provider={PROVIDER_GOOGLE}
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
            tracksViewChanges={false}
          >
            <FontAwesomeIcon name="user" size={30} color="blue" />
          </Marker>
          {kbgyms.map((loc) => {
            return (
              <Marker
                key={`${loc.id}`}
                coordinate={{
                  latitude: parseFloat(loc.coords.latitude),
                  longitude: parseFloat(loc.coords.longitude),
                }}
                tracksViewChanges={false}
                title={loc.name}
              >
                <MaterialCommunityIcons
                  name="boxing-glove"
                  size={30}
                  color={loc.type === "workout" ? "red" : "black"}
                />
                <Callout
                  style={{ width: 120 }}
                  onPress={() => handleCalloutPress(loc.id)}
                >
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontWeight: "bold", textAlign: "center" }}>
                      {loc.name}
                    </Text>
                    <Text style={{ textAlign: "center" }}>
                      Price: {loc.entryPrice}
                    </Text>
                    <Text style={{ textAlign: "center", color: "blue" }}>
                      press for reviews
                    </Text>
                  </View>
                </Callout>
              </Marker>
            );
          })}
        </MapView>
      ) : (
        <Text style={styles.loading}>Loading...</Text>
      )}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {loadingReviews ? (
              <ActivityIndicator size="large" color="#0000ff" />
            ) : (
              <>
                <FlatList
                  data={reviews}
                  keyExtractor={(item) => item.text}
                  renderItem={renderReviews}
                />
                <View style={styles.reviewForm}>
                  <TextInput
                    placeholder="Enter your review..."
                    style={styles.input}
                    onChangeText={setReviewText}
                    value={reviewText}
                  />
                  <AirbnbRating
                    count={5}
                    defaultRating={0}
                    size={20}
                    showRating={true}
                    onFinishRating={handleStarRatingChange}
                  />
                  <Button
                    title="Submit Review"
                    onPress={handleCreateReview}
                    disabled={!reviewText || starRating === 0}
                  />
                </View>
              </>
            )}
            <Button title="Close" onPress={() => setModalVisible(false)} />
          </View>
        </View>
      </Modal>
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
    right: 15,
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
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    flex: 1,
    marginTop: 100,
    marginBottom: 100,
    marginHorizontal: 20,
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    elevation: 5,
    alignItems: "center",
    width: "90%",
    alignSelf: "center",
  },
  reviewItem: {
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    paddingBottom: 10,
  },
  reviewText: {
    fontSize: 16,
    marginBottom: 5,
  },
  reviewForm: {
    width: "100%",
    alignItems: "center",
    marginTop: 20,
  },
});
