import React, { useState } from 'react'
import {SafeAreaView,Image,Text,TouchableOpacity, StyleSheet,View} from 'react-native'
import { useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import toServer from '../Components/toServer';
import * as ImageManipulator from 'expo-image-manipulator';

export default function ImageScreen({navigation}){

    const route=useRoute();


    const resizeImage = async () => {
        const resizedPhoto = await ImageManipulator.manipulateAsync(
            route.params.imageData.uri,
            [{ resize: { width: 300 } }], // resize to width of 300 and preserve aspect ratio 
            { compress: 0.7, format: 'jpeg' },
           );
        return resizedPhoto;
      };
 
      const sendPicture=async()=>{
        let result= await resizeImage();

            await toServer({
                type: "image",
                base64: true,
                uri: result.uri
            });
        
            navigation.navigate("Results")
      }
    // const sendPicture = async () => {
    //     setImg('data:image/jpeg;base64,'+route.params.imageData)
    //     resizeImage();

    //     await toServer({
    //         type: "image",
    //         base64: true,
    //         uri: img
    //       });
    //   }

    return (
        <SafeAreaView style={{flex:1}}>
            {/* <Image source={{uri:'data:image/jpeg;base64,'+route.params.imageData}} style={{flex:1}}/> */}
            <Image source={{uri:route.params.imageData.uri}} style={{flex:1}}/>
            <View style={styles.buttons}>
                    <Icon.Button 
                        name="times" 
                        backgroundColor="black" 
                        size={40}
                        onPress={async ()=> navigation.navigate('Home')}
                        />
                    <Icon.Button 
                        name="check" 
                        backgroundColor="black" 
                        size={40}
                        onPress={sendPicture}
                        />
            </View>

        </SafeAreaView>
    );
}

const styles=StyleSheet.create({
    buttons:{
        flex:0.2,
        flexDirection:"row",
        alignItems:"center",
        justifyContent:"space-between",
        paddingHorizontal:60,
        backgroundColor:"black"
    },
})