import React, { useEffect, useState, useMemo } from 'react';
import { View, Text, SafeAreaView, TouchableOpacity, FlatList } from 'react-native';
import HomeComponent from './HomeComponent';
import {usePeople, useSetPeopleContext} from '../Context/PeopleContext'
import Wallet from './CardComponent/CardList';
import axios from 'axios';
import {useNavigation} from '@react-navigation/native';
export default function PersonList(){

    // const [people,setPeople]=useState([]);
    // const y = new Animated.Value(0);
    // const onScroll = Animated.event([{ nativeEvent: { contentOffset: { y } } }], {
    //     useNativeDriver: true,
    //   });
    const navigation = useNavigation();
    const people=usePeople()
    const setPeople=useSetPeopleContext()
    const [initialRender, setInitialRender]= useState(true)
    // const [personName,setPersonName]=useState(people)

    // const generateArray=()=>{
    //     var obj = people;
    
    //     // Loop to insert key & value in this object one by one
    //     for(var i =0; i<obj.length; i++){
    //       // obj[i]={key: generateKey(obj[i]), value: obj[i]}
    //       obj[i]={key: i, value: obj[i]}
    //     }
    
    //     setPersonName(obj)
    //     console.log(personName)
    //   }

    //   useEffect(()=>{
    //     generateArray()
    //   },[])

    const deletePressed=(name)=>{
        
    }

    // openPressed=async (name)=>{
    //     console.log(name)
    //     let response =await  axios.post('http://172.21.14.134:5000/openimage', { name })
    //       .then(res => {
    //         navigation.navigate("Image", {
    //             imageData: res.data,
    //           });
            
    //       })
        
    //     // return response.data
    // }

    openPressed= (name)=>{
        navigation.navigate("Image", {
                        pname: name,
                      });
    }

    return(
        <View style={{flex:1, justifyContent:"flex-end"}}>
            {/* <FlatList
                // scrollEventThrottle={16}
                // bounces={false}
                data={people}
                renderItem={({item,index})=>(
                    ////
                    <HomeComponent title={item} 
                        deletePressed={deletePressed} 
                        openPressed={openPressed}
                        index={index}
                        y={y}
                    />
                )}
                keyExtractor={item => item["key"]}
                // {...{ onScroll }} 
            /> */}
            <Wallet openPressed={openPressed} deletePressed={deletePressed} />

        </View>
    )
}