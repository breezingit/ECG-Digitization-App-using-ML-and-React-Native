import React, { useEffect, useState } from "react";
import {
  View,
  Dimensions,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  Text,
  Image,
  ActivityIndicator,
  ImageBackground,
  Modal
} from "react-native";
import { Card } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { useRoute } from "@react-navigation/native";
import axios from "axios";
import DeleteModal from "../Components/Modal/DeleteModal";

const customData = require("../data.json")

function OpenScreen() {
  const navigation = useNavigation();
  const route = useRoute();

  const [imageData, setImageData] = useState(null);
  const [personData, setPersonData] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const IP = customData["IP"]

  getImage = async (pdata) => {
    setPersonData(pdata);
    const name = pdata[0];

    const href= [IP + "openImage"]

    let response = await axios
      .post("http://172.21.12.205:5000/openimage", { name })
      // .post(`${href}`, { name })
      // let response =await  axios.post('https://dep-ecg.herokuapp.com/openimage', { name })
      .then((res) => {
        // console.log(res.data)
        setImageData(res.data);
      });
    // return response.data
    
  };

  useEffect(() => {
    getImage(route.params.pname);
  }, []);

  const deletePressed = async () => {
    const name = personData[0];
    const href= [IP + "delete"]

    let response = await axios
      .post(`${href}`, { name })
      // let response =await  axios.post('https://dep-ecg.herokuapp.com/openimage', { name })
      .then((res) => {});

    navigation.navigate("Home")
  };

  const changeModalVisible = (bool) => {
    setIsModalVisible(bool);
  };

  return (
    <SafeAreaView style={styles.container}>
        <Modal
        transparent={true}
        animationType="fade"
        visible={isModalVisible}
        nRequestClose={() => changeModalVisible(false)}
      >
      <DeleteModal changeModalVisible={changeModalVisible} deletePressed={deletePressed} />
    </Modal>
      {imageData === null ? (
        <ActivityIndicator size={50} color="#0000ff" />
      ) : (
        <View>
          <View style={styles.nameText}>
            <Text style={styles.actualText}>Name: {personData[0]}</Text>
            <Text style={styles.actualText}>Date Added: {personData[1]}</Text>
          </View>
          <View style={styles.imageWrapper}>
            {/* <View style={styles.content}> */}
            <ImageBackground
              style={styles.theImage}
              source={{ uri: "data:image/jpeg;base64," + imageData }}
            />
          </View>
          <View style={styles.nameText2}>
            <Text style={styles.actualText2}>Result: {personData[2]}</Text>
          </View>
        </View>
      )}

      <View style={styles.buttons}>
        <TouchableOpacity
          onPress={async () => navigation.navigate("Home")}
          style={styles.button1}
        >
          <Text>GO BACK</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button2} onPress={()=>changeModalVisible(true)}>
          <Text>DELETE</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
  },
  buttons: {
    flexDirection: "row",
    position: "absolute",
    bottom: 50,
  },
  button1: {
    // backgroundColor:"#FB3E00",
    backgroundColor: "#42c0fb",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    position: "absolute",
    left: 30,
    bottom: 10,
  },
  button2: {
    // backgroundColor:"#FB3E00",
    backgroundColor: "#42c0fb",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    position: "absolute",
    right: 30,
    bottom: 10,
  },

  image: {
    width: 500,
    height: 500,
    resizeMode: "contain",
  },
  modalBackGround: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "80%",
    backgroundColor: "white",
    paddingHorizontal: 20,
    paddingVertical: 30,
    borderRadius: 20,
    elevation: 20,
  },
  header: {
    width: "100%",
    height: 40,
    alignItems: "flex-end",
    justifyContent: "center",
  },
  blurContainer: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
  },
  nameText: {
    alignSelf: "center",
    marginBottom: 50,
    borderRadius: 15,
    borderWidth: 5,
    borderBottomColor: "#42c0fb",
    borderLeftColor:"transparent",
    borderTopColor:"#42c0fb",
    borderRightColor:"transparent"
  },
  nameText2: {
    alignSelf: "center",
    marginTop: 30,
    borderRadius: 15,
    borderWidth: 5,
    borderBottomColor: "#42c0fb",
    borderLeftColor:"transparent",
    borderTopColor:"#42c0fb",
    borderRightColor:"transparent"
  },
  content: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  imageWrapper: {
    height: 300,
    width: 500,
    overflow: "hidden",
  },
  theImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  actualText: {
    fontSize: 20,
    color: "#42c0fb",
    fontWeight: "bold",
    padding: 10,
  },
  actualText2: { fontSize: 40, color: "#42c0fb", padding: 10, },
});

export default OpenScreen;
