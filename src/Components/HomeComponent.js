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
    <Card
      style={[
        props.index % 2 == 0
          ? [styles.cards, { backgroundColor: "#0098db" }]
          : [styles.cards, { backgroundColor: "white" }],
      ]}
    >
      <Card.Title
        title={props.title}
        titleStyle={[
          props.index % 2 == 0
            ? {color: "white"}
            : {color:"#0098db"},
        ]}
      />
      <Card.Actions style={{ justifyContent: "space-between" }}>
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
      </Card.Actions>
    </Card>
  );
}

const styles = StyleSheet.create({
  cards: {
    padding: 10,
    margin: 10,
    marginHorizontal: 20,
    // height:250,
    justifyContent: "center",
    flexDirection: "column",
    alignContent: "center",
    elevation: 10,
  },
  buttons: {
    backgroundColor: "white",
  },
  buttonText: {
    color: "black",
    padding: 7,
  },
});
