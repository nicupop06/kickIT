import React, { useState, useEffect } from "react";
import {
  TouchableOpacity,
  View,
  Text,
  TextInput,
  StyleSheet,
  SafeAreaView,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { ref, uploadBytes, listAll, getDownloadURL } from "@firebase/storage";
import * as DocumentPicker from "expo-document-picker";
import { storage } from "../Config/firebaseConfig";
import * as FileSystem from "expo-file-system";
import { Video } from "expo-av";

export default function VideosPage() {
  const [filePath, setFilePath] = useState({});

  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [videoName, setVideoName] = useState("");

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      const storageRef = ref(storage);
      const listResult = await listAll(storageRef);

      const videoUrls = await Promise.all(
        listResult.items.map(async (itemRef) => {
          const url = await getDownloadURL(itemRef);
          return { name: itemRef.name, url };
        })
      );

      setVideos(videoUrls);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching videos:", error);
      setLoading(false);
    }
  };

  const renderVideoItem = ({ item }) => (
    <View style={styles.videoItem}>
      <Text>{item.name}</Text>
      <Video
        source={{ uri: item.url }}
        style={{ width: 300, height: 200 }}
        useNativeControls
        resizeMode="contain"
      />
    </View>
  );

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

      // Convert the buffer to a blob

      const response = await fetch(fileUri);
      const blob = await response.blob();

      // Create a storage reference
      const storageRef = ref(storage, `${videoName}.mp4`);

      // Upload the file
      const uploadTask = uploadBytes(storageRef, blob);

      // Handle the upload task
      uploadTask
        .then(async (snapshot) => {
          // Upload completed successfully
          console.log("Upload complete:", snapshot);
          alert("File uploaded successfully");
          await fetchVideos();
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
          <TouchableOpacity
            activieOpacity={0.5}
            style={styles.buttonStyle}
            onPress={pickFiles}
          >
            <Text style={styles.buttonTextStyle}>Choose Video</Text>
          </TouchableOpacity>
          <Text>Video Name:</Text>
          <TextInput
            style={styles.input}
            value={videoName}
            onChangeText={setVideoName}
            placeholder="Enter video name"
          />
          <TouchableOpacity style={styles.buttonStyle} onPress={uploadVideos}>
            <Text style={styles.buttonTextStyle}>
              Upload File on FireStorage
            </Text>
          </TouchableOpacity>

          <Text style={{ marginTop: 20 }}>Videos from Firebase Storage:</Text>
          {loading ? (
            <ActivityIndicator style={{ marginTop: 10 }} />
          ) : (
            <FlatList
              data={videos}
              renderItem={renderVideoItem}
              keyExtractor={(item) => item.name}
              style={{ marginTop: 10 }}
            />
          )}
        </View>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f0f0",
    padding: 20,
    alignItems: "center",
  },
  buttonStyle: {
    backgroundColor: "#007bff",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 5,
    marginTop: 20,
  },
  buttonTextStyle: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    paddingHorizontal: 15,
    paddingVertical: 10,
    width: "100%",
    marginTop: 10,
    backgroundColor: "#fff",
    fontSize: 16,
  },
  videoItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    width: "100%",
    alignItems: "center",
  },
});
