import React, { Component } from "react";
import {  StyleSheet, Text, StatusBar, TouchableOpacity} from "react-native";
import {Card} from 'react-native-paper' 

export default function LeadListComponent({title, setShowImage,setImageIndex, cardIndex}){


    const cardPress=()=>{
        setShowImage(true)
        setImageIndex(cardIndex)
    }

    return(
   <TouchableOpacity onPress={cardPress}>

    <Card style={styles.cards}>
      <Card.Title title={title} titleStyle={{marginBottom:30, alignSelf:"center"}} />
      <Card.Actions style={{justifyContent:"space-between"}}>
      </Card.Actions>
    </Card>
   </TouchableOpacity>    
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
        height: 40
    },
})