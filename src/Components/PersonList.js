import React, { useEffect, useState, useMemo } from 'react';
import { View, Text, SafeAreaView, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import HomeComponent from './HomeComponent';
import {usePeople, useSetPeopleContext, useNameDateData} from '../Context/PeopleContext'
// import Wallet from './CardComponent/CardList';
import axios from 'axios';
import {useNavigation} from '@react-navigation/native';

export default function PersonList({sortBy}){

    const navigation = useNavigation();
    const [people,setPeople]=useState(useNameDateData())
    const [changed, setChanged]=useState(false)

    const deletePressed=(name)=>{
        
    }

    openPressed= (name)=>{

        navigation.navigate("Image", {
                        pname: name,
                      });
    }

    function compare( a, b ) {
        if ( a[0] < b[0] ){
          return -1;
        }
        if ( a[0] > b[0] ){
          return 1;
        }
        return 0;
    }

    useEffect(()=>{
        
        // setIsLoading(true)
        if(sortBy==="Name"){

            people.sort(compare)
            setChanged(!changed)
        }
        console.log(people)
        // setIsLoading(false)
    },[sortBy])

    return(
        <View style={{flex:1, justifyContent:"flex-end"}}>

        <FlatList
            data={people}
            renderItem={({index,item})=>(
                ////
                <HomeComponent title={item[0]} 
                    deletePressed={deletePressed} 
                    openPressed={openPressed}
                    index={item}
                />
            )}
            keyExtractor={item => item["key"]}
            extraData={sortBy}
        />     

            {/* This is for the wallet animation */}
            {/* <Wallet openPressed={openPressed} deletePressed={deletePressed} /> */}

        </View>
    )
}