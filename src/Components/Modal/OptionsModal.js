import React from "react";
import { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  TextInput,
} from "react-native";

const HEIGHT_MODAL = 140;
const OptionsModal = ({ changeModalVisible, setSortBy }) => {
  const [sortVisible, setSortVisible] = useState(true);

  const setNamefunc=()=>{
    // setSortVisible(false)
    setSortBy("Name")
    changeModalVisible(false)
  }

  const setDateafunc=()=>{
    setSortBy("Datea")
    changeModalVisible(false)
  }
  const setDatedfunc=()=>{
    setSortBy("Dated")
    changeModalVisible(false)
  }
  const setIfunc=()=>{
    setSortBy("Ischemic")
    changeModalVisible(false)
  }
  const setNIfunc=()=>{
    setSortBy("NIschemic")
    changeModalVisible(false)
  }

  return (
    <View style={styles.container}>
      {sortVisible === true ? (
        <View style={styles.modal}>
          <View style={styles.modalButtons}>
            <TouchableOpacity
              style={styles.button}
              onPress={()=>setSortVisible(false)}
            >
              <Text style={{ color: "white" }}>Sort By...</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <View style={styles.modal}>
          <Text style={[styles.nameContainer, { paddingBottom: 10 }]}>
            Sort By
          </Text>
          <TouchableOpacity style={styles.button} onPress={setNamefunc}>
            <Text style={{ color: "white", alignSelf: "center" }}>Name</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={setDateafunc}>
            <Text style={{ color: "white" }}>Date (Descending)</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={setDatedfunc}>
            <Text style={{ color: "white" }}>Date (Ascending)</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={setIfunc}>
            <Text style={{ color: "white" }}>Ischemic</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={setNIfunc}>
            <Text style={{ color: "white" }}>Non-Ischemic</Text>
          </TouchableOpacity>
        </View>
      )}
    <TouchableOpacity style={styles.button} onPress={changeModalVisible}>
        <Text style={{ color: "white" }}>CANCEL</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#000000AA",
  },
  modal: {
    backgroundColor: "#42c0fb",
    borderRadius: 10,
    // alignItems:'center',
    // justifyContent:'center',
    padding: 10,

    // borderColor:'black',
    // borderWidth:5
  },
  nameContainer: {
    fontSize: 20,
    alignSelf: "center",
    color: "white",
  },
  modalButtons: {
    flexDirection: "row",
    alignSelf: "center",
  },
  button: {
    backgroundColor: "transparent",
    padding: 7,
    paddingHorizontal: 40,
    borderColor: "white",
    borderWidth: 2,
    borderRadius: 5,
    marginVertical: 5,
  },
});

export default OptionsModal;
