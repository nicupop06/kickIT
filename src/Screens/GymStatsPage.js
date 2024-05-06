import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import config from "../Config/config";
import axios from "axios";

export default function GymStatsPage({ route }) {
  const [paymentIntents, setPaymentIntents] = useState([]);
  const { gymName } = route.params;

  useEffect(() => {
    async function fetchPaymentIntents() {
      const sendURL = config.getRouteUrl(config.SERVER_ROUTES.PAYMENTS);
      const response = await axios.get(sendURL, {
        params: {
          gymName: gymName,
        },
      });
      setPaymentIntents(response.data);
      console.log(response.data);
    }

    fetchPaymentIntents();
  }, []);

  return (
    <View style={styles.container}>
      <Text>Hello, Expo!</Text>
      <Text>Gym ID: {gymName}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
});
