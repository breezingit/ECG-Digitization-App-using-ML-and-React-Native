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
  Modal,
} from "react-native";
import { NavigationContainer, useFocusEffect } from "@react-navigation/native";
import PersonList from "./PersonList";
import Icon from "react-native-vector-icons/FontAwesome5";
import {
  usePeople,
  useSetPeopleContext,
  useNameDateData,
  useSetNameDateData,
  useIncrement,
} from "../Context/PeopleContext";
import axios from "axios";
import { useIsFocused } from "@react-navigation/native";
import OptionsModal from "./Modal/OptionsModal";
import { useAuth, useEmail } from "../Context/AuthContext";

const customData = require("../data.json");

export default function SearchArea({ navigation }) {
  const IP = customData["IP"];

  const [dataLength, setDataLength] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [sortBy, setSortBy] = useState("");
  const people = usePeople();
  const setPeople = useSetPeopleContext();
  const setNameDateData = useSetNameDateData();
  const increment = useIncrement();
  const isFocused = useIsFocused();

  const generateKey = (pre) => {
    return `${pre}_${new Date().getTime()}`;
  };

  function myFunction(value, index, array) {
    return value[0];
  }

  const email= useEmail()

  const getData = async () => {
    setIsLoading(true);

    const href = ["" + IP + "getdata"];
    let response = await axios.post(`${href}`, { email });
    const result = Object.values(response.data);

    const resultFinal = result.map(myFunction);
    setPeople(resultFinal);
    setDataLength(result.length);
    setNameDateData(result);

    setIsLoading(false);
  };

  useEffect(() => {
    getData();
  }, [increment]);

  const changeModalVisible = (bool) => {
    setIsModalVisible(bool);
  };

  return (
    <View style={{ flex: 1 }}>
      <Modal
        transparent={true}
        animationType="fade"
        visible={isModalVisible}
        nRequestClose={() => changeModalVisible(false)}
      >
        <OptionsModal
          changeModalVisible={changeModalVisible}
          setSortBy={setSortBy}
        />
      </Modal>

      <View style={styles.topBar}>
        <View style={{ flex: 1, flexDirection: "row" }}>
          <TouchableOpacity
            style={{ paddingHorizontal: 10, marginTop: 5 }}
            onPress={() => navigation.openDrawer()}
          >
            <Icon name="list" size={20} />
          </TouchableOpacity>
          <Text style={{ fontSize: 20, marginLeft: 10 }}>Home</Text>
        </View>
        <TouchableOpacity
          style={{ paddingLeft: 12 }}
          onPress={() => navigation.navigate("Search")}
        >
          <Icon name="search" size={20} />
        </TouchableOpacity>
        <TouchableOpacity
          style={{ paddingHorizontal: 15 }}
          onPress={() => changeModalVisible(true)}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text style={{ fontSize: 20, marginRight: 3 }}>SortBy</Text>
            <Icon name="angle-down" size={20} />
          </View>
        </TouchableOpacity>
      </View>
      {isLoading === true ? (
        <ActivityIndicator
          size="large"
          color="#0000ff"
          style={{ flex: 1, justifyContent: "center" }}
        />
      ) : people.length === 0 ? (
        <View style={styles.imgContainer}>
          <Icon name="plus" size={100} />
          <Text style={{ fontSize: 30, paddingTop: 10 }}> Add ECG</Text>
        </View>
      ) : (
        <PersonList sortBy={sortBy} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  topBar: {
    flexDirection: "row",
    alignContent: "space-around",
    // padding: 15,
    paddingHorizontal: 15,
    paddingTop: 10,
  },
  imgContainer: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
  },
});
