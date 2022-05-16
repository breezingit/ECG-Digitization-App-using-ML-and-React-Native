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
import { useRoute } from "@react-navigation/native";
import toServer from "../Components/toServer";
import Icon from "react-native-vector-icons/FontAwesome5";
import { useIncrement, useSetIncrement } from "../Context/PeopleContext";
import PlotList from "../Components/PlotListComponent";
import { useEmail } from "../Context/AuthContext";

const customData = require("../data.json");

export default function Results({ navigation }) {
  const [imageData, setImageData] = useState(null);
  const [disableButton, setDisableButton] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [personName, setPersonName] = useState("");
  const increment = useIncrement();
  const setIncrement = useSetIncrement();
  const route = useRoute();
  const [showImage, setShowImage] = useState(false);
  const [imageIndex, setImageIndex] = useState(0);
  const [imageName, setImageName] = useState("Lead1");
  const [plotData, setPlotData] = useState(customData["arr"]);
  
  const email=useEmail()

  useEffect(() => {
    getImage();
    // console.log(imageData)
  }, []);

  const getImage = async () => {
    await toServer({
      type: route.params.type,
      base64: route.params.base64,
      uri: route.params.uri,
    });

    const IP = customData["IP"];
    const href = [IP + "final"];

    let response = await axios.get(`${href}`);
    setImageData(response.data);
    // setImageData(response.data)
    setDisableButton(true);
  };

  const saveImage = async (searchPhrase) => {

    if(imageData===null){
      return
    }

    const IP = customData["IP"];
    const href = [IP + "savename"];
    const data={searchPhrase, email}
    let response = await axios
      .post(`${href}`, { data })
      // .post("https://dep-ecg.herokuapp.com/savename", { searchPhrase })
      .then((res) => {

      });

    setIncrement(!increment);
    navigation.navigate("Home");
  };

  const changeModalVisible = (bool) => {
    setIsModalVisible(bool);
  };

  const nextImage = () => {
    if (imageIndex === 11) {
      return;
    } else {
      setImageIndex(imageIndex + 1);
      // setImageName(arr[imageIndex])

    }
  };

  const previousImage = () => {
    if (imageIndex === 0) {
      return;
    } else {
      setImageIndex(imageIndex - 1);
      // setImageName(arr[imageIndex])
    }
  };
  

  return (
    <SafeAreaView style={styles.container}>
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
      ) : showImage === false ? (
        <View style={{ flex: 1 }}>
          <View style={styles.nameText}>
            <Text style={styles.actualText}>ECG DIGITIZED!</Text>
          </View>
          <View style={{ flex: 0.65, paddingBottom: 10, alignSelf: "stretch" }}>
            <PlotList
              data={plotData}
              setShowImage={setShowImage}
              setImageIndex={setImageIndex}
            />
          </View>

          <View style={styles.nameText2}>
            <Text style={styles.actualText2}>Result: ISCHEMIC</Text>
          </View>
        </View>
      ) : (
        // null
        <View style={{flex:0.9}}>
          {/* <View style={styles.nameText}>
            <Text style={styles.actualText}>{arr[imageIndex]}</Text>
          </View> */}
          <Image
            source={{ uri: "data:image/jpeg;base64," + imageData[imageIndex] }}
            style={styles.image}
          />
          <View
            style={{
              position: "absolute",
              flexDirection: "row",
              alignItems: "flex-end",
              bottom: 130,
            }}
          >
            <TouchableOpacity
              onPress={previousImage}
              style={{ position: "absolute", left: 70 }}
            >
              <Icon name="arrow-circle-left" color="#42c0fb" size={70} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={nextImage}
              style={{ position: "absolute", left: 360 }}
            >
              <Icon name="arrow-circle-right" color="#42c0fb" size={70} />
            </TouchableOpacity>
          </View>
          {/* <TouchableOpacity onPress={previousImage}>
            <Icon name="sun" backgroundColor="blue" size={50} />
          </TouchableOpacity> */}
        </View>
      )}
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
  },
  button1: {
    backgroundColor: "#42c0fb",
    padding: 15,
    borderRadius: 20,
    alignItems: "center",
    position: "absolute",
    left: 30,
    bottom: 1,
  },
  button2: {
    backgroundColor: "#42c0fb",
    padding: 15,
    borderRadius: 20,
    alignItems: "center",
    position: "absolute",
    right: 30,
    bottom: 1,
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
  actualText: {
    fontSize: 50,
    color: "#42c0fb",
    fontWeight: "bold",
    padding: 5,
  },
  actualText2: { fontSize: 40, color: "#42c0fb", padding: 10 },
  nameText: {
    alignSelf: "center",
    borderRadius: 15,
    borderWidth: 5,
    borderBottomColor: "#42c0fb",
    borderLeftColor: "transparent",
    borderTopColor: "#42c0fb",
    borderRightColor: "transparent",
    flex: 0.09,
    marginBottom: 20,
    // position:"absolute",
    // top:50

    // marginTop:50
  },
  nameText2: {
    alignSelf: "center",
    borderRadius: 15,
    borderWidth: 5,
    borderBottomColor: "#42c0fb",
    borderLeftColor: "transparent",
    borderTopColor: "#42c0fb",
    borderRightColor: "transparent",
    flex: 0.09,
  },
});
