import React from 'react';
import { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Dimensions, TextInput } from 'react-native';


const HEIGHT_MODAL=140;
const ErrorModal=({changeModalVisible})=>{


    return(
        <View style={styles.container}>
            <View style={styles.modal}>
                <Text style={styles.nameContainer}>ERROR</Text>
                <Text style={styles.nameContainer}>The Email entered is invalid!</Text>
                <View style={styles.modalButtons}>
                    <TouchableOpacity style={styles.button} onPress={changeModalVisible}>
                        <Text style={{color:"white"}}>
                            OK    
                        </Text> 
                    </TouchableOpacity>
                </View>
            </View>

        </View>
    )
}

const styles=StyleSheet.create({
    container:{
        flex:1,
        alignItems:'center',
        justifyContent:'center',
        backgroundColor:'#000000AA'
    },
    modal:{
        height: HEIGHT_MODAL,
        width: 300,
        paddingTop:10,
        backgroundColor:'#42c0fb',
        borderRadius:10,
        // alignItems:'center',
        // justifyContent:'center',
        padding:10
        // borderColor:'black',
        // borderWidth:5
    },
    nameContainer:{
        fontSize:20,
        padding:5,
        alignSelf:"center",
        color:"white"
    },
      modalButtons:{
          flexDirection:"row",
          paddingTop:10,
          alignSelf:"center",
          marginHorizontal:25,
      },
      button:{
        backgroundColor:"transparent",
        padding:7,
        paddingHorizontal:20,
        borderColor:"white",
        borderWidth:2,
        borderRadius:5
      }
})

export default ErrorModal;