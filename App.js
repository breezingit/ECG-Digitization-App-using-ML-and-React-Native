import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { NavigationContainer, DarkTheme } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Camera from "./src/Camera/CameraScreen";
import ImageScreen from "./src/Camera/ImageScreen";
import Home from "./src/Screens/Home";
import Icon from "react-native-vector-icons/FontAwesome5";
import { themes } from "./src/Components/Themes/themes";
import Results from "./src/Screens/ResultScreen";
// import Results from "./Final";
import { PeopleProvider } from "./src/Context/PeopleContext";
import "react-native-gesture-handler";
import { createDrawerNavigator } from "@react-navigation/drawer";
import CustomDrawer from "./src/Components/Sidebar/Sidebar";
import LoginScreen from "./src/Screens/LoginScreen";
import Signin from "./src/Screens/SigninScreen";
import Signup from "./src/Screens/SignupScreen";
import OTP from "./src/Screens/OTPScreen";
import OpenScreen from "./src/Screens/OpenImageScreen";
import { LogBox } from "react-native";
import {
  DarkTheme as PaperDarkTheme,
  Provider as PaperProvider,
} from "react-native-paper";
import SearchScreen from "./src/Screens/SearchScreen";
import { AuthProvider } from "./src/Context/AuthContext";

LogBox.ignoreAllLogs();

const Stack = createNativeStackNavigator();
const LogStack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

export default function App() {
  const [isDarkTheme, setIsDarkTheme] = useState(false);

  const toggleTheme = () => {
    setIsDarkTheme(!isDarkTheme);
  };

  function HomeStack() {
    return (
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={DrawerStack}
          options={{
            headerShown: false,
            // swipeEnabled: false,
            // drawerItemStyle: { height: 0 },
          }}
        />
        <Stack.Screen
          name="Camera"
          component={Camera}
          // options={{
          //   drawerItemStyle: { height: 0 },
          // }}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ImageScreen"
          component={ImageScreen}
          // options={{
          //   drawerItemStyle: { height: 0 },
          // }}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Results"
          component={Results}
          // options={{
          //   drawerItemStyle: { height: 0 },
          // }}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Search"
          component={SearchScreen}
          // options={{
          //   drawerItemStyle: { height: 0 },
          // }}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Image"
          component={OpenScreen}
          // options={{
          //   drawerItemStyle: { height: 0 },
          // }}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    );
  }

  function LoginStack() {
    return (
      <LogStack.Navigator>
        <LogStack.Screen
          name="Login"
          component={LoginScreen}
          // options={{
          //   swipeEnabled: false,
          //   drawerItemStyle: { height: 0 },
          // }}
          options={{ headerShown: false }}
        />
        <LogStack.Screen
          name="Signin"
          component={Signin}
          options={{
            headerShown: false,
            // swipeEnabled: false,
            // drawerItemStyle: { height: 0 },
          }}
        />
        <LogStack.Screen
          name="Signup"
          component={Signup}
          options={{
            headerShown: false,
            // swipeEnabled: false,
            // drawerItemStyle: { height: 0 },
          }}
        />
        <LogStack.Screen
          name="OTP"
          component={OTP}
          options={{
            headerShown: false,
            // swipeEnabled: false,
            // drawerItemStyle: { height: 0 },
          }}
        />
        <LogStack.Screen
          name="Homestack"
          component={HomeStack}
          options={{
            headerShown: false,
            // swipeEnabled: false,
            // drawerItemStyle: { height: 0 },
          }}
        />
      </LogStack.Navigator>
    );
  }

  function DrawerStack() {
    return (
      <Drawer.Navigator
        drawerContent={(props) => <CustomDrawer {...props} />}
        screenOptions={{
          headerShown: false,
          drawerActiveBackgroundColor: "#42c0fb",
          drawerActiveTintColor: "#fff",
        }}
      >
        <Drawer.Screen
          name="Homepage"
          component={Home}
          options={{
            drawerIcon: () => <Icon name="home" backgroundColor="#42c0fb" />,
          }}
        />
      </Drawer.Navigator>
    );
  }

  return (
    <AuthProvider>
      <PaperProvider theme={PaperDarkTheme}>
        <PeopleProvider>
          <NavigationContainer theme={DarkTheme}>
            <HomeStack />
          </NavigationContainer>
        </PeopleProvider>
      </PaperProvider>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
