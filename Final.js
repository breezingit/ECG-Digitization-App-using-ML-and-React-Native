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
import SimpleModal from "./src/Components/Modal/SimpleModal";
// import { useRoute } from "@react-navigation/native";
import toServer from "./src/Components/toServer";
export default class Results extends Component {
  constructor(props) {
    super(props);

    this.state = {
      imageData: null,
      disableButton: false,
      isModalVisible: false,
      personName: "",
    };
  }

  async componentDidMount() {
    // const route = useconst Route();
    // const result= this.props.navigation.getParam("image")
    // const result = route.image;

    // await toServer({
    //   type: result.type,
    //   base64: result.base64,
    //   uri: result.uri,
    // });

    const data = await this.getImage();
    this.setState({ imageData: data, disableButton: true });
  }

  getImage = async () => {
    let response = await axios.get("http://172.21.12.205:5000/final");
    // let response = await axios.get("https://dep-ecg.herokuapp.com/final");
    // console.log(response.data)

    return response.data;
  };

  saveImage = async (searchPhrase) => {
    let response = await axios
      .post("http://172.21.12.205:5000/savename", { searchPhrase })
      // .post("https://dep-ecg.herokuapp.com/savename", { searchPhrase })
      .then((res) => {
        // console.log(res.data);
      });
    // console.log(response.data)
    // return response.data
    this.props.navigation.navigate("Home");
  };

  changeModalVisible = (bool) => {
    this.setState({ isModalVisible: bool });
  };

  // fetch("http://192.168.75.4:5000/final")
  //     .then(function (response) {
  //         return response.text();
  //     }).then(function (text) {
  //         setData(text)
  //     });
  render() {
    return (
      <SafeAreaView style={styles.container}>
        {/* <BlurView intensity={90} tint="dark" style={styles.blurContainer}> */}

        <Modal
          transparent={true}
          animationType="fade"
          visible={this.state.isModalVisible}
          nRequestClose={() => this.changeModalVisible(false)}
        >
          <SimpleModal
            searchPhrase={this.personName}
            saveImage={this.saveImage}
            changeModalVisible={this.changeModalVisible}
          />
        </Modal>

        {this.state.disableButton === false ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          <View>
            <Image
              source={{ uri: "data:image/jpeg;base64," + this.state.imageData }}
              style={styles.image}
            />

            <View style={styles.buttons}>
              <TouchableOpacity
                onPress={async () => this.props.navigation.navigate("Home")}
                style={styles.button}
              >
                <Text>CANCEL</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={async () => this.changeModalVisible(true)}
                style={styles.button}
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
    padding: 35,
    justifyContent: "space-between",
  },
  button: {
    // backgroundColor:"#FB3E00",
    backgroundColor: "#42c0fb",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
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
