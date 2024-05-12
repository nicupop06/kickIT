import React, { useState, useEffect } from "react";
import { View, TextInput, StyleSheet, Button } from "react-native";
import {
  StripeProvider,
  CardField,
  useConfirmPayment,
} from "@stripe/stripe-react-native";
import config from "../Config/config";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";

export default function StripePaymentPage({ route, navigation }) {
  const [cardDetails, setCardDetails] = useState(null);
  const { confirmPayment, loading } = useConfirmPayment();
  const { qrData } = route.params;
  const [gym, setGym] = useState("");
  const [uuid, setUUID] = useState("");
  const [userEmail, setUserEmail] = useState("");

  //Get email from localstorage (login placed it there)
  useEffect(() => {
    AsyncStorage.getItem("email")
      .then((storedEmail) => {
        if (storedEmail) {
          setUserEmail(storedEmail);
        }
      })
      .catch((error) => {
        alert("Error retrieving email from AsyncStorage:", error);
      });
  }, [userEmail]);

  useEffect(() => {
    if (qrData) {
      const [gym, uuid] = qrData.split("|");
      setGym(JSON.parse(gym));
      setUUID(uuid);
    }
  }, [qrData]);

  const fetchPaymentIntentClientSecret = async () => {
    const sendURL = config.getRouteUrl(config.SERVER_ROUTES.STRIPE_SECRET);
    const response = await axios.post(
      sendURL,
      {
        gymId: uuid,
        email: userEmail,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const { clientSecret, error } = response.data;
    return { clientSecret, error };
  };

  const handlePayment = async () => {
    //1.Gather the customer's billing information (e.g., email)
    if (!cardDetails || !cardDetails.complete || !gym.owner) {
      alert("Please enter Complete card details and Email");
      return;
    }
    const billingDetails = {
      email: gym.owner,
    };
    //2.Fetch the intent client secret from the backend
    try {
      const { clientSecret, error } = await fetchPaymentIntentClientSecret();
      //2. confirm the payment
      if (error) {
        console.log("Unable to process payment");
      } else {
        const { paymentIntent, error } = await confirmPayment(clientSecret, {
          type: "Card",
          paymentMethodType: "Card",
          billingDetails: billingDetails,
        });
        if (error) {
          console.log(cardDetails);
          alert(`Payment Confirmation Error ${error.message}`);
        } else if (paymentIntent) {
          alert("Payment Successful");
          console.log("Payment successful ", paymentIntent);
          navigation.navigate("Main Page");
        }
      }
    } catch (e) {
      console.log(e);
    }
    //3.Confirm the payment with the card details
  };

  return (
    <StripeProvider publishableKey={config.STRIPE_PUBLISHABLE_KEY}>
      <View style={styles.container}>
        <TextInput
          autoCapitalize="none"
          placeholder="E-mail"
          keyboardType="email-address"
          value={gym.owner}
          editable={false}
          style={styles.input}
        />
        <TextInput
          autoCapitalize="none"
          placeholder="Price"
          value={`${gym.entryPrice} RON`}
          editable={false}
          style={styles.input}
        />
        <CardField
          postalCodeEnabled={true}
          onCardChange={(cardDetails) => setCardDetails(cardDetails)}
          style={styles.cardContainer}
        />
        <Button onPress={handlePayment} title="Pay" disabled={loading} />
      </View>
    </StripeProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "turquoise"
  },
  input: {
    width: "80%",
    height: 40,
    borderWidth: 1,
    borderColor: "black",
    borderRadius: 5,
    paddingLeft: 10,
    marginBottom: 20,
  },
  cardContainer: {
    width: "80%",
    height: 50,
    marginBottom: 20,
  },
});
