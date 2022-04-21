import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import { Camera } from 'expo-camera';
import * as FS from "expo-file-system";

export default function CameraScreen({navigation}) {
  const [hasPermission, setHasPermission] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [camera, setCamera] = useState(null)
  const [capturedImage, setCapturedImage] = useState(null)

  uriToBase64 = async (uri) => {
    let base64 = await FS.readAsStringAsync(uri, {
      encoding: FS.EncodingType.Base64,
    });
    return base64;
  };
  

  const takePicture = async () => {
    if(camera){
      const data= await camera.takePictureAsync({base64:true});
      setCapturedImage(data.uri);
      // let sendURI= await uriToBase64(data.uri)
      // console.log(data.type)
      navigation.navigate('ImageScreen', {
        imageData: data,
          });
      
    }
  }

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }
  return (
    <View style={{flex:1}}>
        <Camera
        style={styles.camera}
        type={type}
        ratio={`1:1`}
        ref={(r) => {
        setCamera(r)
        }}>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                setType(
                  type === Camera.Constants.Type.back
                    ? Camera.Constants.Type.front
                    : Camera.Constants.Type.back
                );
              }}>
                <Text style={styles.text}> Flip </Text>
            </TouchableOpacity>
            <View style={styles.clickButton}>
              <View style={{ alignSelf: 'center', flex: 1, alignItems: 'center'}}>
                  <TouchableOpacity
                  onPress={takePicture}
                  style={{
                  width: 70,
                  height: 70,
                  bottom: 0,
                  borderRadius: 50,
                  backgroundColor: '#fff'
                  }}
                  />
              </View>
        </View>
        </View>
      </Camera> 
      
    </View>
  );
}

const styles = StyleSheet.create({
  camera: {
    flex: 1,
    flexDirection:"row"
  },
  buttonContainer: {
    flex: 1,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    margin: 20,
    
  },
  button: {
    flex: 0.1,
    alignSelf: 'flex-end',
    alignItems: 'center',
  },
  text: {
    fontSize: 18,
    color: 'white',
  },
  clickButton:{
    position: 'absolute',
    bottom: 0,
    flexDirection: 'row',
    flex: 1,
    width: '100%',
    padding: 20,
    justifyContent: 'space-between'
    }
});