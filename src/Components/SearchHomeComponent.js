import React, { Component } from "react";
import { Button,SafeAreaView, View , Image, TouchableOpacity, StyleSheet, Text, StatusBar} from "react-native";
import {Card} from 'react-native-paper' 

export default function SearchHomeComponent(props){

    return(
    <Card style={styles.cards}>
      <Card.Title title={props.title} />
      <Card.Actions style={{justifyContent:"space-between"}}>
      </Card.Actions>
    </Card>
    )
}


const styles=StyleSheet.create({
    cards:{
        padding:10,
        backgroundColor:"#0098db",
        margin:10,
        marginHorizontal:20,
        // height:250,
        justifyContent:"center",
        flexDirection:"column",
        alignContent:"center",
        elevation:10,
    },
})