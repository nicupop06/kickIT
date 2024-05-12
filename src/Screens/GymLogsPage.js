import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import config from "../Config/config";
import axios from "axios";
import { LinearGradient } from "expo-linear-gradient";

export default function GymLogsPage({ route }) {
  const [paymentIntents, setPaymentIntents] = useState([]);
  const [loading, setLoading] = useState(true);
  const { gymName } = route.params;

  useEffect(() => {
    async function fetchPaymentIntents() {
      const sendURL = config.getRouteUrl(config.SERVER_ROUTES.PAYMENTS);
      const response = await axios.get(sendURL, {
        params: {
          gymName: gymName,
        },
      });
      if (response.data.paymentIntents) {
        setPaymentIntents(response.data.paymentIntents);
        console.log(response.data.paymentIntents);
      } else {
        console.log("No payment intents available");
      }
      setLoading(false);
    }

    fetchPaymentIntents();
  }, []);

  return (
    <LinearGradient colors={["#4CAF50", "#2196F3"]} style={styles.gradient}>
      <View style={styles.container}>
        <Text style={styles.title}>Logs for {gymName}</Text>
        <View style={styles.logsContainer}>
          {paymentIntents.map((paymentIntent, index) => (
            <View key={index} style={styles.logItem}>
              <Text style={styles.logText}>
                Date: {new Date(paymentIntent.created * 1000).toLocaleString()}
              </Text>
              <Text style={styles.logText}>
                User: {paymentIntent.metadata.userEmail}
              </Text>
            </View>
          ))}
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
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  logsContainer: {
    flex: 1,
    width: "100%",
    padding: 10,
  },
  logItem: {
    marginBottom: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
  },
  logText: {
    fontSize: 16,
  },
});
