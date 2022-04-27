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
} from "react-native";
import { NavigationContainer, useFocusEffect } from "@react-navigation/native";
import PersonList from "./PersonList";
import Icon from "react-native-vector-icons/FontAwesome5";
import { usePeople, useSetPeopleContext } from "../Context/PeopleContext";
import axios from "axios";
import { useIsFocused } from "@react-navigation/native";

export default function SearchArea({navigation}) {
  const [searchPhrase, setSearchPhrase] = useState("");
  const [clicked, setClicked] = useState(false);

  const [dataLength, setDataLength] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const people = usePeople();
  const setPeople = useSetPeopleContext();

  const isFocused = useIsFocused();

  // let clicked= false
  // const setClicked=()=>{
  //   clicked=!clicked
  // }

  const generateKey = (pre) => {
    return `${ pre }_${ new Date().getTime() }`;
  }

  const getData = async () => {
    let response = await axios.get("http://172.26.12.119:5000/getdata");
    const result = Object.values(response.data);
    setPeople(result);
    setDataLength(result.length);
    // generateArray()
    // return response.data
  };

  const changeList = () => {
    setPeople([...people, { Name: "HELLO" }]);
    // console.log(people)
  };
  const loggit = () => {
    console.log(people);
  };

  useEffect(() => {
    if (isFocused) {
      setIsLoading(true);
      getData();

      setTimeout(() => {
        setIsLoading(false);
      }, 5000);
    }
  }, [isFocused]);

  // useFocusEffect(
  //   React.useCallback(() => {
  //     const onBackPress = () => {
  //       if (clicked) {
  //         setClicked(false);
  //         return true;
  //       } else {
  //         return false;
  //       }
  //     };

  //     BackHandler.addEventListener("hardwareBackPress", onBackPress);

  //     return () =>
  //       BackHandler.removeEventListener("hardwareBackPress", onBackPress);
  //   }, [clicked])
  // );

  return (
    <View style={{ flex: 1 }}>
      {/* <SearchBar
        searchPhrase={searchPhrase}
        setSearchPhrase={setSearchPhrase}
        clicked={clicked}
        setClicked={setClicked}
      /> */}
      <View style={styles.topBar}>
        <View style={{ flex: 1 , flexDirection:"row"}}>
          <TouchableOpacity style={{ marginLeft:7, marginTop:2 }} onPress={()=>navigation.openDrawer()}>
            <Icon name="list" size={20} />
          </TouchableOpacity>
          <Text style={{ fontSize: 20 , marginLeft:10}}>Home</Text>
        </View>
        <TouchableOpacity style={{ marginRight: 12}} onPress={()=>navigation.navigate("Search")}>
          <Icon name="search" size={20} />
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
        <PersonList personLength={dataLength} />
      )}
      {/* {clicked ? (
        <List
          searchPhrase={searchPhrase}
          data={usePeople()}
          setClicked={setClicked}
        />
      ) : isLoading === true ? (
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
        <PersonList personLength={dataLength} />
      )} */}
    </View>
  );
}

const styles = StyleSheet.create({
  topBar: {
    flexDirection: "row",
    alignContent: "space-around",
    // padding: 15,
    paddingHorizontal:15
  },
  imgContainer: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
  },
});
