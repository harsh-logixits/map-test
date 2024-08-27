/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import {NavigationContainer} from '@react-navigation/native';
import {
  createNativeStackNavigator,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import React from 'react';
import Mapbox from './Mapbox';
import Stadia from './Stadia';
import MapTiler from './MapTiler';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import MapLibreGL from '@maplibre/maplibre-react-native';

MapLibreGL.setAccessToken(null);

const Stack = createNativeStackNavigator();

function Home({navigation}: NativeStackScreenProps<any, 'Home'>) {
  const handleMapbox = () => {
    navigation.navigate('Mapbox');
  };

  const handleStadia = () => {
    navigation.navigate('Stadia');
  };

  const handleMapTiler = () => {
    navigation.navigate('MapTiler');
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handleMapbox}>
        <View style={styles.btn}>
          <Text style={styles.btnText}>Mapbox</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity onPress={handleStadia}>
        <View style={styles.btn}>
          <Text style={styles.btnText}>Stadia</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity onPress={handleMapTiler}>
        <View style={styles.btn}>
          <Text style={styles.btnText}>MapTiler</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}

function App(): React.JSX.Element {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Mapbox" component={Mapbox} />
        <Stack.Screen name="Stadia" component={Stadia} />
        <Stack.Screen name="MapTiler" component={MapTiler} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
  },
  btn: {
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'lightblue',
    marginTop: 20,
  },
  btnText: {
    fontSize: 20,
  },
});
export default App;
