import React, { Component } from "react";
import {
  Button,
  SafeAreaView,
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
  Text,
  StatusBar,
} from "react-native";
import { Card } from "react-native-paper";

export default function HomeComponent(props) {
  return (
    <TouchableOpacity onPress={(async) => props.openPressed(props.index)}>
      <Card
        style={styles.cards}
      >
        <Card.Title
          title={props.title}
        />
        <View style={styles.textView}>
          <Text style={styles.text2}>
            Result: {props.index[2]}
          </Text>
          <Text style={styles.text}>
            Date Added: {props.index[1]}
          </Text>
        </View>
        {/* <Card.Actions style={{ justifyContent: "space-between" }}>
          <TouchableOpacity
            style={styles.buttons}
            onPress={(async) => props.openPressed(props.index)}
          >
            <Text style={styles.buttonText}>Open</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.buttons}
            onPress={(async) => props.deletePressed(props.index)}
          >
            <Text style={styles.buttonText}>Delete</Text>
          </TouchableOpacity>
        </Card.Actions> */}
      </Card>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  cards: {
    padding: 10,
    margin: 10,
    marginHorizontal: 20,
    justifyContent: "center",
    flexDirection: "column",
    alignContent: "center",
    elevation: 10,
    backgroundColor: "#0098db"
  },
  buttons: {
    backgroundColor: "white",
  },
  buttonText: {
    color: "black",
    padding: 7,
  },
  textView:{
    marginHorizontal:10,
    alignItems:"flex-end"
  },
  text:{
    fontSize:15,
  },
  text2:{
    fontSize:15,
    fontWeight:"bold"
  }
});
