import React, { useState, useRef } from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";
import { Audio } from "expo-av";
import { TouchableOpacity } from "react-native-gesture-handler";

export default function TimerPage() {
  const [roundLength, setRoundLength] = useState("3"); // Default round length in minutes
  const [pauseLength, setPauseLength] = useState("60"); // Default pause length in seconds
  const [numRounds, setNumRounds] = useState("3"); // Default number of rounds
  const [timerText, setTimerText] = useState(""); // Timer display text
  const [isRunning, setIsRunning] = useState(false); // Timer running flag
  const sound = new Audio.Sound();

  const intervalRef = useRef(); // Reference to interval

  // Function to start the timer
  const startTimer = async () => {
    const totalSeconds = parseFloat(roundLength) * 60; // Convert round length to seconds
    let secondsRemaining = totalSeconds;

    setIsRunning(true); // Set timer running flag

    intervalRef.current = setInterval(() => {
      const minutes = Math.floor(secondsRemaining / 60);
      const seconds = secondsRemaining % 60;
      setTimerText(
        `${minutes.toString().padStart(2, "0")}:${seconds
          .toString()
          .padStart(2, "0")}`
      );

      if (secondsRemaining <= 0) {
        clearInterval(intervalRef.current);
        setIsRunning(false);
        playSound(); // Play bell ring sound
        // If there are remaining rounds, start the pause timer
        if (parseInt(numRounds) > 1) {
          setTimeout(startPauseTimer, 1000);
        } else {
          resetTimer(); // If no remaining rounds, reset the timer
        }
      } else {
        secondsRemaining--;
      }
    }, 1000);
  };

  // Function to start the pause timer
  const startPauseTimer = () => {
    const totalSeconds = parseInt(pauseLength); // Convert pause length to seconds
    let secondsRemaining = totalSeconds;

    setTimerText("Pause"); // Display "Pause" text during pause

    intervalRef.current = setInterval(() => {
      const minutes = Math.floor(secondsRemaining / 60);
      const seconds = secondsRemaining % 60;
      setTimerText(
        `${minutes.toString().padStart(2, "0")}:${seconds
          .toString()
          .padStart(2, "0")}`
      );

      if (secondsRemaining <= 0) {
        clearInterval(intervalRef.current);
        setIsRunning(false);
        setNumRounds((prevNumRounds) =>
          Math.max(parseInt(prevNumRounds) - 1, 0).toString()
        ); // Ensure numRounds doesn't go below zero
        // If there are remaining rounds, start the next round timer
        if (parseInt(numRounds) > 0) {
          setTimeout(startTimer, 1000);
        } else {
          resetTimer(); // If no remaining rounds, reset the timer
        }
      } else {
        secondsRemaining--;
      }
    }, 1000);
  };

  // Function to play bell ring sound
  const playSound = async () => {
    try {
      if (sound._loaded) {
        await sound.replayAsync(); // If loaded, replay the sound
      } else {
        await sound.loadAsync(require("../Config/boxing-bell.mp3"));
        await sound.playAsync();
      }
    } catch (error) {
      console.error("Failed to play sound", error);
    }
  };

  // Function to stop the timer
  const stopTimer = () => {
    clearInterval(intervalRef.current);
    setIsRunning(false);
  };

  // Function to reset the timer
  const resetTimer = () => {
    clearInterval(intervalRef.current);
    setIsRunning(false);
    setTimerText("");
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Round Length (minutes):</Text>
        <TextInput
          style={styles.input}
          value={roundLength}
          onChangeText={setRoundLength}
          keyboardType="numeric"
        />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Pause Length (seconds):</Text>
        <TextInput
          style={styles.input}
          value={pauseLength}
          onChangeText={setPauseLength}
          keyboardType="numeric"
        />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Number of Rounds:</Text>
        <TextInput
          style={styles.input}
          value={numRounds}
          onChangeText={setNumRounds}
          keyboardType="numeric"
        />
      </View>
      <Text style={styles.timerText}>{timerText}</Text>
      <View style={styles.buttonContainer}>
        {!isRunning ? (
          <TouchableOpacity style={styles.button} onPress={startTimer}>
            <Text style={styles.buttonText}>Start Timer</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.button} onPress={stopTimer}>
            <Text style={styles.buttonText}>Stop Timer</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity style={styles.button} onPress={resetTimer}>
          <Text style={styles.buttonText}>Reset Timer</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    backgroundColor: "#f0f0f0",
  },
  inputContainer: {
    marginBottom: 20,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginRight: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    paddingHorizontal: 15,
    paddingVertical: 10,
    width: "45%",
    backgroundColor: "#fff",
    color: "#333",
    fontSize: 16,
    textAlign: "center",
  },
  timerText: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
  },
  button: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    backgroundColor: "#007bff",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
  },
});
