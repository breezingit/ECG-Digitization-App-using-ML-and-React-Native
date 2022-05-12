import React, { useState, useEffect, Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Modal,
  Animated,
  ImageBackground,
} from "react-native";
import { BlurView } from "expo-blur";
import { SafeAreaView } from "react-native-safe-area-context";
// import { BlurView } from "@react-native-community/blur";
// import LottieView from 'lottie-react-native'
import axios from "axios";
import SimpleModal from "../Components/Modal/SimpleModal";
// import { useRoute } from "@react-navigation/native";
import toServer from "../Components/toServer";
import { useIncrement, useSetIncrement } from "../Context/PeopleContext";

const customData=require("../data.json")


export default function Results({navigation}){

  const [imageData, setImageData] =useState(null)
  const [disableButton, setDisableButton] =useState(false)
  const [isModalVisible, setIsModalVisible] =useState(false)
  const [personName, setPersonName] =useState("")
  const increment=useIncrement()
  const setIncrement= useSetIncrement()

  useEffect(()=>{

      getImage()

  },[])

  const getImage = async () => {

    const IP = customData["IP"]
    const href= [IP + "final"]
    let response = await axios.get(`${href}`);
    // let response = await axios.get("https://dep-ecg.herokuapp.com/final");
    // console.log(response.data)

    // return response.data;
    setImageData(response.data)
    setDisableButton(true)
  };




  const saveImage = async (searchPhrase) => {
    const IP = customData["IP"]
    const href= [IP + "savename"]


    let response = await axios
      .post(`${href}`, { searchPhrase })
      // .post("https://dep-ecg.herokuapp.com/savename", { searchPhrase })
      .then((res) => {
        // console.log(res.data);
      });
    // console.log(response.data)
    // return response.data
    setIncrement(!increment)
    navigation.navigate("Home");
  };

  const changeModalVisible = (bool) => {
    setIsModalVisible(bool)
  };

    return (
      <SafeAreaView style={styles.container}>
        {/* <BlurView intensity={90} tint="dark" style={styles.blurContainer}> */}

        <Modal
          transparent={true}
          animationType="fade"
          visible={isModalVisible}
          nRequestClose={() => changeModalVisible(false)}
        >
          <SimpleModal
            saveImage={saveImage}
            changeModalVisible={changeModalVisible}
          />
        </Modal>

        {disableButton === false ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          <View style={{justifyContent:"center", alignContent:"center"}}>
            <Image
              source={{ uri: "data:image/jpeg;base64," + imageData }}
              style={styles.image}
            />

            <View style={styles.buttons}>
              <TouchableOpacity
                onPress={async () => navigation.navigate("Home")}
                style={styles.button1}
              >
                <Text>CANCEL</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={async () => changeModalVisible(true)}
                style={styles.button2}
              >
                <Text>Save ECG</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        {/* </BlurView> */}
      </SafeAreaView>
    );
  }


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
  },
  buttons: {
    flexDirection: "row",
    position: "absolute",
    bottom: 50,
    left : 150
  },
  button1: {
    // backgroundColor:"#FB3E00",
    backgroundColor: "#42c0fb",
    padding: 15,
    borderRadius: 20,
    marginHorizontal: 20
    // alignItems: "center",
    // position: "absolute",
    // left: 30,
    // bottom: 10,
  },
  button2: {
    // backgroundColor:"#FB3E00",
    backgroundColor: "#42c0fb",
    padding: 15,
    borderRadius: 20,
    // alignItems: "center",
    // position: "absolute",
    // right: 30,
    // bottom: 10,
  },

  image: {
    flex: 1,
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
});
