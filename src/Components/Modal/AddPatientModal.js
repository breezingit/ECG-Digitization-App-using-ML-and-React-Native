import React from "react";
import { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  TextInput,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

const HEIGHT_MODAL = 140;
const AddPatientModal = ({ changeModalVisible , modalFunc}) => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <View style={styles.modal}>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("Camera")}>
          <Text style={{ color: "white", alignSelf: "center" }}>Choose From Camera</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => modalFunc}>
          <Text style={{ color: "white" }}>Choose From Gallery</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.button} onPress={() => changeModalVisible}>
          <Text style={{ color: "white" }}>CANCEL</Text>
        </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "#000000AA",
    },
    modal: {
      backgroundColor: "#42c0fb",
      borderRadius: 10,
      // alignItems:'center',
      // justifyContent:'center',
      padding: 10,
  
      // borderColor:'black',
      // borderWidth:5
    },
    nameContainer: {
      fontSize: 20,
      alignSelf: "center",
      color: "white",
    },
    modalButtons: {
      flexDirection: "row",
      alignSelf: "center",
    },
    button: {
      backgroundColor: "transparent",
      padding: 7,
      paddingHorizontal: 40,
      borderColor: "white",
      borderWidth: 2,
      borderRadius: 5,
      marginVertical: 5,
    },
  });

export default AddPatientModal;
