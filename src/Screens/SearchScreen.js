import React, { Component, useState, useEffect } from "react";
import SearchBar from "../Components/Searchbar";
import List from "../Components/List";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  BackHandler,
  ActivityIndicator,
  SafeAreaView,
  StatusBar
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome5";
import { usePeople, useSetPeopleContext } from "../Context/PeopleContext";

export default function SearchScreen() {
  const [searchPhrase, setSearchPhrase] = useState("");
  const [clicked, setClicked] = useState(true);

  return (
    <SafeAreaView style={styles.homecontainer}>
      <SearchBar
        searchPhrase={searchPhrase}
        setSearchPhrase={setSearchPhrase}
        clicked={clicked}
        setClicked={setClicked}
      />
      <List
        searchPhrase={searchPhrase}
        data={usePeople()}
        setClicked={setClicked}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  imgContainer: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
  },
  homecontainer: {
    flex: 1,
    backgroundColor: "white",
    paddingTop: StatusBar.currentHeight + 10,
  },
});
