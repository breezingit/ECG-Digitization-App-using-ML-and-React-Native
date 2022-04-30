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
} from "../Context/PeopleContext";
import axios from "axios";
import { useIsFocused } from "@react-navigation/native";
import OptionsModal from "./Modal/OptionsModal";
import AddPatientModal from "./Modal/AddPatientModal";

export default function SearchArea({ navigation }) {
  const [searchPhrase, setSearchPhrase] = useState("");
  const [clicked, setClicked] = useState(false);

  const [dataLength, setDataLength] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isPatientModalVisible, setIsPatientModalVisible] = useState(true);
  const [sortBy, setSortBy] = useState("");
  const people = usePeople();
  const setPeople = useSetPeopleContext();
  const nameDateData = useNameDateData();
  const setNameDateData = useSetNameDateData();
  const isFocused = useIsFocused();

  // let clicked= false
  // const setClicked=()=>{
  //   clicked=!clicked
  // }

  const generateKey = (pre) => {
    return `${pre}_${new Date().getTime()}`;
  };

  function myFunction(value, index, array) {
    return value[0];
  }

  const getData = async () => {
    // let response = await axios.get("https://dep-ecg.herokuapp.com/getdata");
    let response = await axios.get("http://172.21.12.205:5000/getdata");
    const result = Object.values(response.data);
    // console.log(response.data)
    const resultFinal = result.map(myFunction);
    // for(var i=0; i< result.length; i++){
    //   resultFinal[i]=resultFinal[i]
    // }
    console.log(sortBy)
    if(sortBy==="Name"){
      result.sort(compare)
    }

    console.log(resultFinal)
    setPeople(resultFinal);
    setDataLength(result.length);
    setNameDateData(result);


    // generateArray()
    // return response.data
  };

  function compare( a, b ) {
    if ( a[0] < b[0] ){
      return -1;
    }
    if ( a[0] > b[0] ){
      return 1;
    }
    return 0;
  }


  useEffect(() => {
    if (isFocused) {
      setIsLoading(true);
      getData();
      console.log(sortBy)
      if(sortBy==="Name"){
        console.log("sortBy")
        
      }

      setTimeout(() => {
        setIsLoading(false);
      }, 5000);
    }
  }, [isFocused, sortBy]);

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
        <OptionsModal changeModalVisible={changeModalVisible} setSortBy={setSortBy} />
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
          <Icon name="sun" size={20} />
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
