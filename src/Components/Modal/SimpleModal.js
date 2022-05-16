import React from 'react';
import { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Dimensions, TextInput , ActivityIndicator} from 'react-native';
import * as Progress from 'react-native-progress';

const HEIGHT_MODAL=170;
const SimpleModal=({ searchPhrase,setSearchPhrase ,saveImage, changeModalVisible})=>{

    const [personName, setPersonName]=useState("")
    const [progress, setProgess]= useState(false)

    const saveImagefunc=()=>{
        setProgess(true)
        saveImage(personName)
    }

    return(
        <View style={styles.container}>
            {
                progress===false
                ?
            (<View style={styles.modal}>
                <Text style={styles.nameContainer}>Input Name</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Type"
                    value={searchPhrase}
                    onChangeText={setPersonName}
                />
                <View style={styles.modalButtons}>
                    <TouchableOpacity style={styles.button} onPress={changeModalVisible}>
                        <Text style={{color:"white"}}>
                            CANCEL    
                        </Text> 
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button} onPress={saveImagefunc}>
                        <Text style={{color:"white"}}>
                            OK    
                        </Text> 
                    </TouchableOpacity>
                </View>
            </View>)
                :
                <Progress.CircleSnail color={['red', 'green', 'blue']} />
                }

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
        justifyContent:'center',
        padding:10
        // borderColor:'black',
        // borderWidth:5
    },
    nameContainer:{
        fontSize:20,
        padding:15,
        alignSelf:"center",
        color:"white"
    },
    input: {
        fontSize: 20,
        marginLeft: 10,
        width: "85%",
        // paddingTop:25,
        borderColor:'white',
        borderWidth:1,
        paddingLeft:5,
        alignContent:"center",
        alignSelf:"center",
        borderRadius:5
        // paddingBottom:20
      },
      modalButtons:{
          flexDirection:"row",
          paddingTop:20,
          justifyContent:"space-between",
          marginHorizontal:25,
      },
      button:{
        backgroundColor:"transparent",
        padding:7,
        borderColor:"white",
        borderWidth:2,
        borderRadius:5
      }
})

export default SimpleModal;