import react from 'react';
import { useState } from 'react';
import {View, Text, ImageBackground, Image, StyleSheet} from 'react-native'
import { DrawerContentScrollView, DrawerItem, DrawerItemList } from '@react-navigation/drawer';
import { Drawer } from 'react-native-paper';
import Icon from "react-native-vector-icons/FontAwesome5";
import { useAuth } from '../../Context/AuthContext';
const CustomDrawer=(props)=>{

    const authUser= useAuth()

    return(
        <View style={{flex:1}}>

            <DrawerContentScrollView {...props}
                contentContainerStyle={{backgroundColor:"#0077b6"}}>
                    <ImageBackground source={require('../../../assets/backim.jpg')} style={{padding:20}}>
                        <Image source={require('../../../assets/giticon.png')}
                            style={styles.image}
                        />
                        <Text style={styles.user}>
                            HELLO {authUser.toUpperCase()}
                        </Text>
                    </ImageBackground>

                <View style={styles.drawerList}>
                    <DrawerItemList {...props}/>
                </View>
            </DrawerContentScrollView>
            <Drawer.Section style={styles.bottomDrawerSection}>
                <DrawerItem icon={({color,size})=>(
                        <Icon name="share-square"
                        color={color} size={size}
                        />
                    )}

                    label="Sign Out"
                    onPress={()=>props.navigation.navigate("Login")}
                />
            </Drawer.Section>
        </View>
    )
}

const styles = StyleSheet.create({
    image:{
        height:80,
        width:80,
        borderRadius:40,
        alignSelf:"center"
    },
    user:{
        color:"#fff",
        fontSize:18,
        fontFamily:"Oswald",
        marginLeft:5
    },
    drawerList:{
        flex:1,
        backgroundColor:"black",
        paddingTop:10
    }
  });

export default CustomDrawer


