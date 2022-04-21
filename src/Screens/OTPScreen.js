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
} from "react-native";
import * as Animatable from "react-native-animatable";
import axios from "axios";
import { useRoute } from "@react-navigation/native";
export default function OTP({ navigation }) {
  const route = useRoute();
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

  const verifyotp = () => {
    if(route.params.otp==data.email){
        navigation.navigate("Homestack")
    }
    else{
        console.log("ERROR")
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#42c0fb" barStyle="light-Content" />
      <View style={styles.header}>
        <Text style={styles.text_header}>Enter The OTP</Text>
      </View>
      <Animatable.View style={styles.footer} animation="fadeInUpBig">
        <Text style={styles.text_footer}>OTP</Text>
        <View style={styles.action}>
          <Icon name="envelope" />
          <TextInput
            placeholder="Enter OTP"
            style={styles.textInput}
            autoCapitalize="none"
            onChangeText={(val) => textInputChange(val)}
          />
        </View>

        <View style={styles.button}>
          <TouchableOpacity
            onPress={verifyotp}
            style={[styles.signIn, { backgroundColor: "#42c0fb" }]}
          >
            <Text style={[styles.textSign, { color: "white" }]}>Veify OTP</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate("Signin")}
            style={[styles.signIn, { borderColor: "#42c0fb", borderWidth: 2 }]}
          >
            <Text style={[styles.textSign, { color: "#42c0fb" }]}>Go Back</Text>
          </TouchableOpacity>
        </View>
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
