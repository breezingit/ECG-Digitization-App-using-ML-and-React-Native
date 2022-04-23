import React from "react";
import {
  Dimensions,
  Image,
  StyleSheet,
  TouchableOpacity,
  Text,
  View,
} from "react-native";
import { Card } from "react-native-paper";
const { width } = Dimensions.get("window");
const ratio = 228 / 362;
export const CARD_WIDTH = width * 0.8;
export const CARD_HEIGHT = CARD_WIDTH * ratio;
const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT - 30,
    // height:250,
    justifyContent: "flex-end",
    flexDirection: "column",
    alignContent: "flex-end",
    elevation: 10,
  },
  buttons: {
    padding: 3,
    // alignSelf: "flex-end",
    // marginBottom: 7,
  },
  buttonText: {
    padding: 7,
    fontFamily: "sans-serif",
    fontSize: 15,
  },
  title: {
    fontSize: 25,
    flex:1,
    // flex:0.8,
    paddingTop:5,
    // borderBottomWidth:1
  },
});

export default function MyCard(props) {
  // const title=props.title
  // const upperTitle= title.toUpper()
  // return (<Image style={styles.card} source={require("../../../assets/backim.jpg")}/>)
  return (
    <Card
      style={[
        props.index % 2 == 0
          ? [styles.card, { backgroundColor: "#0098db" }]
          : [styles.card, { backgroundColor: "#303030" }],
      ]}
    >
      <View style={{ flex: 1, justifyContent:"space-between" }}>
        <Card.Title
          title={props.title.toUpperCase()}
          titleStyle={[
            props.index % 2 == 0
              ? [styles.title, { color: "white" }]
              : [styles.title, { color: "#0098db" }],
          ]}
        />
        <Card.Actions style={{ justifyContent: "space-between", padding: 10, borderTopWidth:1 }}>
          <TouchableOpacity
            style={[
              props.index % 2 == 0
                ? [styles.buttons, { backgroundColor: "#303030" }]
                : [styles.buttons, { backgroundColor: "#0098db" }],
            ]}
            onPress={(async) => props.openPressed(props.index)}
          >
            <Text
              style={[
                props.index % 2 == 0
                  ? [styles.buttonText, { color: "#0098db" }]
                  : [styles.buttonText, { color: "#303030" }],
              ]}
            >
              Open
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              props.index % 2 == 0
                ? [styles.buttons, { backgroundColor: "#303030" }]
                : [styles.buttons, { backgroundColor: "#0098db" }],
            ]}
            onPress={(async) => props.deletePressed(props.index)}
          >
            <Text
              style={[
                props.index % 2 == 0
                  ? [styles.buttonText, { color: "#0098db" }]
                  : [styles.buttonText, { color: "#303030" }],
              ]}
            >
              Delete
            </Text>
          </TouchableOpacity>
        </Card.Actions>
      </View>
    </Card>
  );
}
