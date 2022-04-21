import React from "react";
import { StyleSheet, Text,TextInput, View, Keyboard, Button , SafeAreaView,StatusBar, TouchableOpacity} from "react-native";
import { Feather, Entypo } from "@expo/vector-icons";

const SearchBar = ({clicked, searchPhrase, setSearchPhrase, setClicked}) => {
  
  return (
    <SafeAreaView style={styles.container}>
      <View
        style={
          clicked
            ? styles.searchBar__clicked
            : styles.searchBar__unclicked
        }
      >
        {/* search Icon */}
        <Feather
          name="search"
          size={20}
          color="black"
          style={{ marginLeft: 1 }}
        />
        {/* Input field */}
        <TextInput
          style={styles.input}
          placeholder="Search"
          value={searchPhrase}
          onChangeText={setSearchPhrase}
          onFocus={() => {
            setClicked(true);
          }}
        />
        {/* cross Icon, depending on whether the search bar is clicked or not */}
        {clicked && (
          <Entypo name="cross" size={20} color="black" style={{ padding: 1 }} onPress={() => {
              setSearchPhrase("")
          }}/>
        )}
      </View>
      {/* cancel button, depending on whether the search bar is clicked or not */}
      {clicked && (
        <View>
          <TouchableOpacity
            onPress={() => {
              Keyboard.dismiss();
              setClicked(false);
            }}
            style={styles.cancelButton}
          >

            <Text>
              CANCEL
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};
export default SearchBar;

// styles
const styles = StyleSheet.create({
  container: {
    marginLeft: 15,
    // marginTop:10,
    justifyContent: "space-evenly",
    alignItems: "center",
    flexDirection: "row",
    width: "95%",
    // paddingTop:StatusBar.currentHeight 

  },
  searchBar__unclicked: {
    padding: 10,
    flexDirection: "row",
    width: "95%",
    backgroundColor: "#d9dbda",
    borderRadius: 15,
    alignItems: "center",
  },
  searchBar__clicked: {
    padding: 10,
    flexDirection: "row",
    width: "80%",
    backgroundColor: "#d9dbda",
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "space-evenly",
  },
  input: {
    fontSize: 20,
    marginLeft: 10,
    width: "90%",
  },
  cancelButton:{
    backgroundColor:"#d9dbda",
    padding:10,
    borderRadius:5
  }
});