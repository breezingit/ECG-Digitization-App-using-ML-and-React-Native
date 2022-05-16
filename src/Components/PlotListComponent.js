import React from "react";
import { Card } from "react-native-paper";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import LeadListComponent from "./LeadListComponent";
import HomeComponent from "./HomeComponent";

export default function PlotList(props) {
  const plotData = props.data;

  return (


    <FlatList
      data={plotData}
      renderItem={({ index, item }) => (
        
        <LeadListComponent title={item} setShowImage={props.setShowImage} setImageIndex={props.setImageIndex} cardIndex={index} />
        )}
        keyExtractor={(item) => item}
        />

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
    backgroundColor: "#0098db",
  },
});
