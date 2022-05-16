import React, { useEffect, useState, useMemo } from 'react';
import { View, FlatList } from 'react-native';
import HomeComponent from './HomeComponent';
import {useNameDateData} from '../Context/PeopleContext'
// import Wallet from './CardComponent/CardList';
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

    function compareName( a, b ) {
        if ( a[0] < b[0] ){
          return -1;
        }
        if ( a[0] > b[0] ){
          return 1;
        }
        return 0;
    }
    function compareIschemic( a, b ) {
        if ( a[2] < b[2] ){
          return -1;
        }
        if ( a[2] > b[2] ){
          return 1;
        }
        return 0;
    }

    useEffect(()=>{
        
        // setIsLoading(true)
        if(sortBy==="Name"){

            people.sort(compareName)
            setChanged(!changed)
        }
        else if(sortBy==="Datea"){
            people.sort(function(a,b){
                // Turn your strings into dates, and then subtract them
                // to get a value that is either negative, positive, or zero.
                return new Date(b[1]) - new Date(a[1]);
              });
              setChanged(!changed)
        }
        else if(sortBy==="Dated"){
            people.sort(function(a,b){
                // Turn your strings into dates, and then subtract them
                // to get a value that is either negative, positive, or zero.
                return new Date(a[1]) - new Date(b[1]);
              });
              setChanged(!changed)
        }
        else if(sortBy==="Ischemic"){
            people.sort(compareIschemic)
              setChanged(!changed)
        }
        else if(sortBy==="NIschemic"){
            people.sort(compareIschemic)
              setChanged(!changed)
        }
        // console.log(people)
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