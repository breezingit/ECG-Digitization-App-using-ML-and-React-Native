import React from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  SafeAreaView,
} from "react-native";
import SearchHomeComponent from "./SearchHomeComponent";
// definition of the Item, which will be rendered in the FlatList
const Item = (props) => (
  <View style={styles.item}>
    <Text style={styles.title}>{props.name}</Text>
  </View>
);

// the filter
const List = ({ searchPhrase, setClicked, data }) => {
  const renderItem = ({ item }) => {
    // when no input, show all
    if (searchPhrase === "") {
      return <SearchHomeComponent title={item} 
          index={item.key}
      />;
    }
    // filter of the name
    if (item.toUpperCase().includes(searchPhrase.toUpperCase().trim().replace(/\s/g, ""))) {
      return <SearchHomeComponent title={item} 
          index={item.key}
      />;
    }
    // filter of the description
  };

  return (
    <SafeAreaView style={styles.list__container}>
      <View
        onStartShouldSetResponder={() => {
          setClicked(false);
        }}
      >
        <FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
        />
      </View>
    </SafeAreaView>
  );
};

export default List;

const styles = StyleSheet.create({
  list__container: {
    width: "100%",
  },
  item: {
    margin: 15,
    borderBottomWidth: 2,
    borderBottomColor: "lightgrey"
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 5,
    color:"blue"
  },
});