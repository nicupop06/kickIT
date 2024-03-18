import React, { useState } from "react";
import {
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import { ref, uploadBytes } from "@firebase/storage";
import * as DocumentPicker from "expo-document-picker";
import { storage } from "../Config/firebaseConfig";
import * as FileSystem from "expo-file-system";

export default function VideosPage() {
  const [filePath, setFilePath] = useState({});
  const [process, setProcess] = useState("");

  const pickFiles = async () => {
    try {
      const fileDetails = await DocumentPicker.getDocumentAsync({
        type: "video/*",
        copyToCacheDirectory: true,
      });

      if (fileDetails) {
        console.log(fileDetails);
        setFilePath(fileDetails);
      } else {
        setFilePath({});
        alert(fileDetails.canceled === "true" ? "Canceled" : "Unknown Error");
      }
    } catch (error) {
      console.error("Error picking file: ", error);
      setFilePath({});
      alert("Unknown Error");
    }
  };

  const uploadVideos = async () => {
    try {
      // Get the file URI
      const fileUri = filePath.assets[0].uri;

      // Read the file from local filesystem using FileSystem module
      const fileInfo = await FileSystem.getInfoAsync(fileUri);
      if (!fileInfo.exists) {
        throw new Error("File does not exist.");
      }

      // Read the file as a buffer
      const fileBuffer = await FileSystem.readAsStringAsync(fileUri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      // Convert the buffer to a blob
      // const blob = new Blob([fileBuffer], { type: "video/mp4" }); //

      const response = await fetch(fileUri);
      const blob = await response.blob();

      // Create a storage reference
      const storageRef = ref(storage, `${filePath.assets[0].name}`);

      // Upload the file
      const uploadTask = uploadBytes(storageRef, blob);

      // Handle the upload task
      uploadTask
        .then((snapshot) => {
          // Upload completed successfully
          console.log("Upload complete:", snapshot);
          alert("File uploaded successfully");
          setProcess("");
        })
        .catch((error) => {
          // Handle unsuccessful uploads
          console.error("Upload failed:", error);
          alert(`Error uploading file: ${error.message}`);
        });
    } catch (error) {
      console.error("Error uploading file:", error);
      alert(`Error uploading file: ${error.message}`);
    }
  };

  return (
    <>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.container}>
          <Text>Choose Video</Text>
          <Text>{process}</Text>
          <TouchableOpacity
            activieOpacity={0.5}
            style={styles.buttonStyle}
            onPress={pickFiles}
          >
            <Text style={styles.buttonTextStyle}>Choose Video</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.buttonStyle} onPress={uploadVideos}>
            <Text style={styles.buttonTextStyle}>
              Upload File on FireStorage
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    padding: 10,
  },
  buttonStyle: {
    alignItems: "center",
    backgroundColor: "green",
    padding: 10,
    width: 300,
    marginTop: 16,
  },
  buttonTextStyle: {
    color: "white",
    fontWeight: "bold",
  },
});
