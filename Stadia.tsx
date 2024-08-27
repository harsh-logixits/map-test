import React, {useCallback, useEffect, useRef, useState} from 'react';
import {StyleSheet, Text, View, TouchableOpacity, Image} from 'react-native';
import MapLibreGL from '@maplibre/maplibre-react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {GeocodingApi, Configuration} from '@stadiamaps/api';

const API_KEY = '00e28a32-1169-4f60-bf63-c8a8444c72df';
const styleURL = `https://tiles.stadiamaps.com/styles/alidade_smooth.json?api_key=${API_KEY}`;

const config = new Configuration({apiKey: API_KEY});

const api = new GeocodingApi(config);

async function reverseGeocode(latitude, longitude) {
  try {
    const res = await api.reverse({pointLat: latitude, pointLon: longitude});
    return res;

    // if (!response.ok) {
    //   throw new Error(`HTTP error! status: ${response.status}`);
    // }

    // const data = await response.json();
    // return data;
  } catch (error) {
    console.error('Reverse geocoding error:', error.message);
    throw error;
  }
}

function MapTiler({navigation}: NativeStackScreenProps<any, 'MapTiler'>) {
  const mapRef = useRef(null);
  const [coordinates] = useState([-73.63475506666667, 45.42584316666667]);
  const [address, setAddress] = useState('');
  const [zoomLevel, setZoomLevel] = useState(18);

  const handleLocation = useCallback(async () => {
    try {
      const location = await reverseGeocode(coordinates[1], coordinates[0]);
      setAddress(location?.features?.[0].properties?.label ?? '');
    } catch (error) {
      console.log('error', error);
    }
  }, [coordinates]);

  useEffect(() => {
    handleLocation();
  }, [handleLocation]);

  const zoomIn = useCallback(() => {
    const newZoom = Math.min(zoomLevel + 1, 20);
    console.log('newZoom', newZoom);
    mapRef.current?.zoomTo(newZoom, 100);
    setZoomLevel(newZoom);
  }, [zoomLevel]);

  const zoomOut = useCallback(() => {
    const newZoom = Math.max(zoomLevel - 1, 1);
    console.log('newZoom', newZoom);
    mapRef.current?.zoomTo(newZoom, 100);
    setZoomLevel(newZoom);
  }, [zoomLevel]);

  const reset = useCallback(() => {
    mapRef.current.flyTo(coordinates);
    setZoomLevel(18);
  }, [coordinates]);

  return (
    <View style={styles.page}>
      <MapLibreGL.MapView
        attributionEnabled={false}
        style={styles.map}
        styleURL={styleURL}
        logoEnabled={false}>
        <MapLibreGL.Camera
          defaultSettings={{
            centerCoordinate: coordinates,
            zoomLevel: zoomLevel,
          }}
          ref={mapRef}
        />
        <MapLibreGL.PointAnnotation id="marker" coordinate={coordinates}>
          <Image
            source={require('./assets/ic_map_marker_green.png')}
            style={styles.annotationImage}
          />
        </MapLibreGL.PointAnnotation>
      </MapLibreGL.MapView>
      <View style={styles.controlsContainer}>
        <View>
          <TouchableOpacity onPress={zoomIn} style={styles.button}>
            <Text>+</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={zoomOut} style={styles.button}>
            <Text>-</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={reset} style={styles.button}>
          <Text>Reset</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.addressText}>Address: {address}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  controlsContainer: {
    position: 'absolute',
    top: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 100,
  },
  button: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    alignItems: 'center',
  },
  addressText: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    padding: 10,
    borderRadius: 5,
  },
  annotationImage: {
    width: 80,
    height: 80,
    resizeMode: 'contain',
  },
});

export default MapTiler;
