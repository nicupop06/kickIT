import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import config from "../Config/config";
import axios from "axios";
import { LineChart } from "react-native-chart-kit";
import moment from "moment";

export default function GymStatsPage({ navigation, route }) {
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
      } else {
        alert("No payment intents available");
      }
      setLoading(false);
    }

    fetchPaymentIntents();
  }, []);

  function countEntriesForDay(day) {
    const no = paymentIntents.filter(
      (item) => moment(item.created * 1000).format("ddd") === day
    ).length;
    return parseInt(no);
  }

  return (
    <View style={styles.container}>
      <Text>No Entries / Week days</Text>
      <LineChart
        data={{
          labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
          datasets: [
            {
              data: [
                countEntriesForDay("Mon"),
                countEntriesForDay("Tue"),
                countEntriesForDay("Wed"),
                countEntriesForDay("Thu"),
                countEntriesForDay("Fri"),
                countEntriesForDay("Sat"),
                countEntriesForDay("Sun"),
              ],
            },
          ],
        }}
        width={Dimensions.get("window").width}
        height={300}
        yAxisInterval={1}
        chartConfig={{
          backgroundColor: "#e6ffff",
          backgroundGradientFrom: "#e6ffff",
          backgroundGradientTo: "#99e6e6",
          color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          style: {
            borderRadius: 16,
          },
          propsForDots: {
            r: "6",
            strokeWidth: "2",
            stroke: "blue",
          },
          propsForBackgroundLines: {
            strokeWidth: 0,
          },
        }}
        bezier
        style={{
          marginVertical: 8,
          borderRadius: 16,
        }}
      />
      {/* Button to check logs */}
      <TouchableOpacity
        style={styles.checkLogsButton}
        onPress={() => navigation.navigate("LogsPage", { gymName: gymName })}
      >
        <Text style={styles.checkLogsText}>Check Logs</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5fcff",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  checkLogsButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "blue",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  checkLogsText: {
    color: "white",
    fontSize: 16,
  },
});
