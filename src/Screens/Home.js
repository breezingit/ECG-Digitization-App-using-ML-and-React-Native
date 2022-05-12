import React, { Component, useState, useEffect } from "react";
import {
  Button,
  SafeAreaView,
  View,
  FlatList,
  StyleSheet,
  Text,
  StatusBar,
  ActivityIndicator,
  TouchableOpacity,
  Dimensions,
  Modal,
} from "react-native";

const { width } = Dimensions.get("window");

import { BackHandler } from "react-native";

import Icon from "react-native-vector-icons/FontAwesome5";
import HomeComp from "../Components/HomeComponent";
const src = "../../assets/plus.jpg";
import * as FS from "expo-file-system";
import * as ImagePicker from "expo-image-picker";
import SearchBar from "../Components/Searchbar";

import toServer from "../Components/toServer";
import List from "../Components/List";
import SearchArea from "../Components/SearchArea";
import OptionsModal from "../Components/Modal/OptionsModal";
import AddPatientModal from "../Components/Modal/AddPatientModal";

const styles = StyleSheet.create({
  homecontainer: {
    flex: 1,
    backgroundColor: "white",
    paddingTop: StatusBar.currentHeight,
  },
  imgContainer: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    height: null,
    width: null,
    resizeMode: "contain",
  },
  homebuttons: {
    flexDirection: "row",
    justifyContent: "flex-end",
    bottom: 50,
    // alignItems:"center",
    // paddingHorizontal:30,
    position: "absolute",
    right: 30,
    // alignContent:"flex-end"
  },

  container: {
    flex: 1,
    // backgroundColor: "black",
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    // backgroundColor:"#FB3E00",
    width: "60%",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  icons: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    width: 120,
  },
  cardContainer: {
    flex: 1,
    padding: 5,
  },
  patientButton: {
    position: "absolute",
    bottom: 40,
    // left:width/2?
    alignSelf: "center",
    backgroundColor: "white",
    width: width / 2,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#0098db",
  },
  homebutton: { padding: 15 },
});

export class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      cameraRollPer: null,
      disableButton: false,
      clicked: false,
      modalVisible: false,
    };
  }
  async componentDidMount() {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    this.setState((state, props) => {
      return {
        cameraRollPer: status === "granted",
        disableButton: false,
        isPatientModalVisible: false,
      };
    });
  }

  handleBackButtonClick() {
    BackHandler.exitApp();
    return true;
  }

  componentWillMount() {
    BackHandler.addEventListener(
      "hardwareBackPress",
      this.handleBackButtonClick
    );
  }

  componentWillUnmount() {
    BackHandler.removeEventListener(
      "hardwareBackPress",
      this.handleBackButtonClick
    );
  }

  uriToBase64 = async (uri) => {
    let base64 = await FS.readAsStringAsync(uri, {
      encoding: FS.EncodingType.Base64,
    });
    return base64;
  };

  pickMedia = async () => {
    this.setState((state, props) => {
      return {
        cameraRollPer: state.cameraRollPer,
        disableButton: true,
      };
    });
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      base64: true,
    });
    if (result.cancelled) {
      return;
    }
    if (result.type == "image") {
      // await this.toServer({
      // this.props.navigation.navigate("Results",{
      //   image:result
      // });
      await toServer({
        type: result.type,
        base64: result.base64,
        uri: result.uri,
      });
    } else {
      let base64 = await this.uriToBase64(result.uri);
      await toServer({
        type: result.type,
        base64: base64,
        uri: result.uri,
      });
    }

    this.props.navigation.navigate("Results");
  };

  changePatientModalVisible = () => {
    this.setState((prevState) => ({ 
      isPatientModalVisible: !prevState.isPatientModalVisible
   }))
  };

  render() {
    return (
      <SafeAreaView style={styles.homecontainer}>

        <SearchArea navigation={this.props.navigation} />

        <TouchableOpacity style={styles.patientButton} onPress={this.changePatientModalVisible}>
          {
          this.state.isPatientModalVisible === true ?
          
            (this.state.clicked === false ? (
              <View style={{flexDirection:"row"}}>
                <TouchableOpacity
                  style={styles.homebutton}
                  onPress={async () => this.props.navigation.navigate("Camera")}
                >
                  <Icon name="camera" backgroundColor="#42c0fb" size={30} />
                </TouchableOpacity>
    
    
                {this.state.cameraRollPer ? (
                  <TouchableOpacity
                  style={styles.homebutton}
                    onPress={async () => {
                      await this.pickMedia();
                      this.setState((s, p) => {
                        return {
                          cameraRollPer: s.cameraRollPer,
                          disableButton: false,
                          isPatientModalVisible: false
                        };
                      });
                    }}
                  >
                    <Icon name="image" backgroundColor="#42c0fb" size={30} />
                  </TouchableOpacity>
                ) : (
    
                  <Text style={styles.buttonText}>Pick Image</Text>
                )}
              </View>
            ) : null)
          
          :
          (
            <Text
            style={{ paddingVertical: 20, fontSize: 15, fontWeight: "bold" }}
          >
            ADD PATIENT
          </Text>
          )
        }
        </TouchableOpacity>

      </SafeAreaView>
    );
  }
}

export default App;

//
// {
//   (this.state.disableButton===false)
//   ? (<ActivityIndicator size="large" color="#0000ff"/>)
//   :
//   (<View>

//   </View>
//   )
// }
