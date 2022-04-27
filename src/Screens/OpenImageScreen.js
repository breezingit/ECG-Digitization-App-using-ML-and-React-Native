import React, {useEffect, useState} from "react";
import { View,Dimensions, SafeAreaView, StyleSheet, TouchableOpacity, Text , Image, ActivityIndicator} from "react-native";
import {useNavigation} from '@react-navigation/native';
import { useRoute } from "@react-navigation/native";
import axios from "axios";

function OpenScreen() {
  const navigation = useNavigation();
  const route = useRoute();

  const [imageData, setImageData]=useState(null)

  getImage =async (name)=>{
        let response =await  axios.post('http://172.26.12.119:5000/openimage', { name })
          .then(res => {
            // console.log(res.data)
            setImageData(res.data)      
          })    
        // return response.data
    }

    useEffect(()=>{
      getImage(route.params.pname)
    },[])

  return (
    <SafeAreaView style={styles.container}>
      <View>
        {
          imageData === null
          ?
          (<ActivityIndicator size={50} color="#0000ff"/>)
          :
          <Image
            source={{ uri: "data:image/jpeg;base64," + imageData }}
            style={styles.image}
          />
        }


        <View style={styles.buttons}>
          <TouchableOpacity
            onPress={async () => navigation.navigate("Home")}
            style={styles.button}
          >
            <Text>GO BACK</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button}>
            <Text>DELETE</Text>
          </TouchableOpacity>
        </View>
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
    padding: 35,
    justifyContent: "space-between",
    paddingHorizontal:50
    // position:"absolute",
    // bottom:10
  },
  button: {
    // backgroundColor:"#FB3E00",
    backgroundColor: "#42c0fb",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    // position:"absolute"
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

export default OpenScreen