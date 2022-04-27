import { useIsFocused } from "@react-navigation/native";
import React, { useState } from "react";
import Icon from "react-native-vector-icons/FontAwesome5";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Modal,
  TextInput,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import * as Animatable from "react-native-animatable";
import axios from "axios";
import ErrorModal from "../Components/Modal/ErrorModal";
import { useSetAuth } from "../Context/AuthContext";

export default function Signin({ navigation }) {
  const [data, setData] = useState({
    email: "",
    password: "",
    check_textInputChange: false,
    secureTextEntry: true,
  });

  const [isModalVisible, setIsModalVisible] = useState(false);

  const [showActBar, setShowActBar] = useState(false);
  const textInputChange = (val) => {
    if (val.length != 0) {
      setData({
        ...data,
        email: val,
        check_textInputChange: true,
      });
    } else {
      setData({
        ...data,
        email: val,
        check_textInputChange: false,
      });
    }
  };

  const handlePasswordChange = (val) => {
    setData({
      ...data,
      password: val,
    });
  };

  const updateSecureTextEntry = () => {
    setData({
      ...data,
      secureTextEntry: !data.secureTextEntry,
    });
  };

  const changeModalVisible = (bool) => {
    setIsModalVisible(bool);
  };

  const setAuth= useSetAuth()

  const signinnow = async () => {
    setShowActBar(true);
    let response = await axios
      .post("http://172.26.12.119:5000/signin", { data })
      .then((res) => {
        if (res.data == "NO") {
          setShowActBar(false);
          setIsModalVisible(true);
        } else {
          console.log(res.data);
          setAuth(res.data["name"])
          navigation.navigate("OTP", {
            otp: res.data["otp"],
          });
          setShowActBar(false);
        }
      });
    // return response.data
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#42c0fb" barStyle="light-Content" />

      <Modal
        transparent={true}
        animationType="fade"
        visible={isModalVisible}
        nRequestClose={() => changeModalVisible(false)}
      >
        <ErrorModal changeModalVisible={changeModalVisible} />
      </Modal>

      <View style={styles.header}>
        <Text style={styles.text_header}>Welcome!</Text>
      </View>
      <Animatable.View style={styles.footer} animation="fadeInUpBig">
        {showActBar === true ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          <>
            <Text style={styles.text_footer}>Email</Text>
            <View style={styles.action}>
              <Icon name="envelope" />
              <TextInput
                placeholder="Enter Email"
                style={styles.textInput}
                autoCapitalize="none"
                onChangeText={(val) => textInputChange(val)}
              />
            </View>

            <View style={styles.button}>
              <TouchableOpacity
                onPress={signinnow}
                style={[styles.signIn, { backgroundColor: "#42c0fb" }]}
              >
                <Text style={[styles.textSign, { color: "white" }]}>
                  Sign In
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => navigation.navigate("Signup")}
                style={[
                  styles.signIn,
                  { borderColor: "#42c0fb", borderWidth: 2 },
                ]}
              >
                <Text style={[styles.textSign, { color: "#42c0fb" }]}>
                  Sign Up
                </Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </Animatable.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#42c0fb",
  },
  header: {
    flex: 1,
    justifyContent: "flex-end",
    paddingHorizontal: 20,
    paddingBottom: 50,
  },
  footer: {
    flex: 3,
    backgroundColor: "#fff",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  text_header: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 30,
  },
  text_footer: {
    color: "#05375a",
    fontSize: 18,
  },
  action: {
    flexDirection: "row",
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f2f2f2",
    paddingBottom: 5,
    paddingTop:5
  },
  actionError: {
    flexDirection: "row",
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#FF0000",
    paddingBottom: 5,
  },
  textInput: {
    flex: 1,
    marginTop: Platform.OS === "ios" ? 0 : -12,
    paddingLeft: 10,
    color: "#05375a",
  },
  errorMsg: {
    color: "#FF0000",
    fontSize: 14,
  },
  button: {
    alignItems: "center",
    marginTop: 70,
  },
  signIn: {
    width: "100%",
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    marginBottom: 20,
  },
  textSign: {
    fontSize: 18,
    fontWeight: "bold",
  },
});
