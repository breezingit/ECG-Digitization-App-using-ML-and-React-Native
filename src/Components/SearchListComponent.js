import React, { Component } from "react";
import { StyleSheet, Text, StatusBar, TouchableOpacity } from "react-native";
import { Card } from "react-native-paper";
import {useNavigation} from '@react-navigation/native';
import { useNameDateData } from "../Context/PeopleContext";
export default function SearchListComponent({ title, cardIndex }) {
  const navigation = useNavigation();
  const nameDateData=useNameDateData()

  const openPressed = () => {

    var data=null

    for(var i=0;i<nameDateData.length;i++){
      if(nameDateData[i][0]==title){
        data= nameDateData[i]
        break
      }
    }

    console.log(data)

    navigation.navigate("Image", {
      pname: data,
    });
  };

  return (
    <TouchableOpacity onPress={openPressed}>
      <Card style={styles.cards}>
        <Card.Title
          title={title}
          titleStyle={{ marginBottom: 30, alignSelf: "center" }}
        />
        <Card.Actions
          style={{ justifyContent: "space-between" }}
        ></Card.Actions>
      </Card>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  cards: {
    padding: 10,
    backgroundColor: "#0098db",
    margin: 10,
    marginHorizontal: 20,
    // height:250,
    justifyContent: "center",
    flexDirection: "column",
    alignContent: "center",
    elevation: 10,
    height: 40,
  },
});
