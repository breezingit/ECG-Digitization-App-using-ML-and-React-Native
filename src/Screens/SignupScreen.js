import { useIsFocused } from "@react-navigation/native";
import React, { useState } from "react";
import Icon from "react-native-vector-icons/FontAwesome5";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TextInput,
  TouchableOpacity,
  StatusBar,
  Modal,
} from "react-native";
import * as Animatable from "react-native-animatable";
import axios from "axios";
import { useSetAuth, useSetEmail } from "../Context/AuthContext";
import ErrorModal from "../Components/Modal/ErrorModal";

const customData = require("../data.json");
const colorData=require("../colors.json")

export default function Signup({ navigation }) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [data, setData] = useState({
    email: "",
    password: "",
    check_textInputChange: false,
    secureTextEntry: true,
  });

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

  const setAuth = useSetAuth();
  const setEmail = useSetEmail();

  const changeModalVisible = (bool) => {
    setIsModalVisible(bool);
  };

  const signupnow = async () => {
    const IP = customData["IP"];
    const href = [IP + "signup"];

    let response = await axios
      .post(`${href}`, { data })
      // .post("https://dep-ecg.herokuapp.com/signin", { data })
      .then((res) => {
        if (res.data == "NO"){
          setIsModalVisible(true);
        } else {
          navigation.navigate("OTP", {
            otp: res.data["otp"],
          });
        setAuth(res.data["name"]);
        setEmail(data["email"]);
        navigation.navigate("OTP", {
          otp: res.data["otp"],
        });
        }
    // return response.data
    });
    }

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#42c0fb" barStyle="light-Content" />
      <Modal
        transparent={true}
        animationType="fade"
        visible={isModalVisible}
        nRequestClose={() => changeModalVisible(false)}
      >
        <ErrorModal changeModalVisible={changeModalVisible} emailText={"This Email is already in use!"} />
      </Modal>
      <View style={styles.header}>
        <Text style={styles.text_header}>Create an Account!</Text>
      </View>
      <Animatable.View style={styles.footer} animation="fadeInUpBig">
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
        <Text style={[styles.text_footer, { marginTop: 35 }]}>Name</Text>
        <View style={styles.action}>
          <Icon name="grin" />
          <TextInput
            placeholder="Enter Name"
            style={styles.textInput}
            autoCapitalize="none"
            secureTextEntry={data.secureTextEntry ? true : false}
            onChangeText={(val) => handlePasswordChange(val)}
          />
          <TouchableOpacity onPress={updateSecureTextEntry}>
            {data.secureTextEntry == true ? (
              <Icon name="eye" size={15} />
            ) : (
              <Icon name="eye-slash" size={15} />
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.button}>
          <TouchableOpacity
            onPress={signupnow}
            style={[styles.signIn, { backgroundColor: colorData["primary"] }]}
          >
            <Text style={[styles.textSign, { color: "white" }]}>Sign Up</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate("Signin")}
            style={[styles.signIn, { borderColor: colorData["primary"], borderWidth: 2 }]}
          >
            <Text style={[styles.textSign, { color: colorData["primary"] }]}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </Animatable.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colorData["primary"]
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
    paddingTop: 5,
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
    marginTop: 50,
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
