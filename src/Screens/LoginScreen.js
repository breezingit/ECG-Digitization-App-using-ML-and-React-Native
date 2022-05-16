import React from "react";
import {Image, View, Text, StyleSheet, TextInput , Dimensions, TouchableOpacity} from "react-native";

const colorData=require("../colors.json")
export default function LoginScreen({navigation}){
    return(
        <View style={styles.container}>
            <View style={styles.header}>
                <Image source={require('../../assets/ECG.png')} 
                    style={styles.logo}
                    resizeMode="stretch"
                />
            </View>
            <View style={styles.footer}>
                <Text style={styles.title}> Stay Healthy!</Text>
                <Text style={styles.text}> Sign in with an account</Text>
                <View style={styles.button}>
                    <TouchableOpacity onPress={()=>navigation.navigate('Signin')} style={styles.signIn}>
                            <Text style={styles.textSign}>LOGIN / SIGN IN</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
}


const {height}= Dimensions.get("screen")
const height_logo= height*0.28


const styles = StyleSheet.create({
    container: {
      flex: 1, 
      backgroundColor: 'white'
    },
    header: {
        flex: 2,
        justifyContent: 'center',
        alignItems: 'center'
    },
    footer: {
        flex: 1,
        backgroundColor: colorData["primary"],
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingVertical: 50,
        paddingHorizontal: 30
    },
    logo: {
        width: height_logo,
        height: height_logo
    },
    title: {
        color: 'white',
        fontSize: 30,
        fontWeight: 'bold'
    },
    text: {
        color: 'white',
        marginTop:5
    },
    button: {
        alignItems: 'flex-end',
        marginTop: 30
    },
    signIn: {
        width: 150,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 50,
        flexDirection: 'row',
        backgroundColor:"white"
    },
    textSign: {
        color: '#0077b6',
        fontWeight: 'bold'
    }
  });


