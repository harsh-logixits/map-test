import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';

import MapboxMaps, {Camera, MapView, MarkerView} from '@rnmapbox/maps';
import {useCallback, useEffect, useRef, useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';

MapboxMaps.setAccessToken(
  'sk.eyJ1IjoiaGFyb3JhIiwiYSI6ImNtMDUwejBodjBmOGgyanMyc2I3NjYxeXkifQ.lkZA0pFQxzvFtXJUlnAakw',
);

const ACCESS_TOKEN = `pk.eyJ1IjoiaGFyb3JhIiwiYSI6ImNsY2hxbWVwYzBnYjUzcXBjNnRzeWNwN3kifQ.NIMm4rG8iwosUOYK25dCfA`;
const SECRET_ACCESS_TOKEN = `sk.eyJ1IjoiaGFyb3JhIiwiYSI6ImNtMDUwejBodjBmOGgyanMyc2I3NjYxeXkifQ.lkZA0pFQxzvFtXJUlnAakw`;

async function reverseGeocode(latitude, longitude) {
  // -73.63475506666667
  // 45.42584316666667
  try {
    const response = await fetch(
      `https://api.mapbox.com/search/geocode/v6/reverse?longitude=${longitude}&latitude=${latitude}&access_token=${SECRET_ACCESS_TOKEN}`,
    );

    // The response will contain the geocoding results
    const res = await response.json();
    return res;

    //   // You can access the place name, address, etc. from the response
    //   if (response.features && response.features.length > 0) {
    //     const placeName = response.features[0].place_name;
    //     console.log('Place Name:', placeName);
    //   }
  } catch (error) {
    console.error('Reverse geocoding error:', error);
  }
}

function Mapbox({navigation}: NativeStackScreenProps<any, 'Mapbox'>) {
  const mapRef = useRef(null);

  const [address, setAddress] = useState('');
  const [zoomLevel, setZoomLevel] = useState(18);
  // const [zoomLevel, setZoomLevel] = useState(18);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [coordinates, setCoordinates] = useState([
    -73.63475506666667, 45.42584316666667,
  ]);

  const handleLocation = useCallback(async () => {
    const location = await reverseGeocode(
      45.42584316666667,
      -73.63475506666667,
    );
    setAddress(location);
  }, []);

  const zoomIn = useCallback(() => {
    const currentZoomLevel = zoomLevel + 1 > 20 ? 20 : zoomLevel + 1;
    console.log('currentZoomLevel', currentZoomLevel);
    // setZoomLevel(currentZoomLevel);
    mapRef.current?.setCamera({
      zoomLevel: currentZoomLevel,
      animationDuration: 500,
    });
    setTimeout(() => {
      setZoomLevel(currentZoomLevel);
    }, 500);
    //   zoomLevel.current = currentZoomLevel;
  }, [zoomLevel]);

  const zoomOut = useCallback(() => {
    const currentZoomLevel = zoomLevel - 1 <= 1 ? 1 : zoomLevel - 1;
    mapRef.current?.setCamera({
      zoomLevel: currentZoomLevel,
      animationDuration: 500,
    });
    setTimeout(() => {
      setZoomLevel(currentZoomLevel);
    }, 500);
    //   zoomLevel.current = currentZoomLevel;
  }, [zoomLevel]);

  const reset = useCallback(() => {
    const currentZoomLevel = 18;
    mapRef.current?.setCamera({
      zoomLevel: currentZoomLevel,
      animationDuration: 500,
      centerCoordinate: coordinates,
    });
    setTimeout(() => {
      setZoomLevel(currentZoomLevel);
    }, 500);
  }, [coordinates]);

  useEffect(() => {
    handleLocation();
  }, [handleLocation]);

  return (
    <View style={styles.container}>
      <MapView
        compassEnabled={false}
        attributionEnabled={false}
        logoEnabled={false}
        zoomEnabled={false}
        scaleBarEnabled={false}
        style={styles.map}>
        <View style={styles.controlsContainer}>
          <View>
            <TouchableOpacity disabled={zoomLevel === 20} onPress={zoomIn}>
              <View style={styles.button}>
                <Text>+</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity disabled={zoomLevel === 1} onPress={zoomOut}>
              <View style={styles.button}>
                <Text>-</Text>
              </View>
            </TouchableOpacity>
          </View>
          <View>
            <TouchableOpacity onPress={reset}>
              <View style={styles.button}>
                <Text>Reset</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
        <Camera
          ref={mapRef}
          defaultSettings={{
            zoomLevel: zoomLevel,
          }}
          animationDuration={0}
          centerCoordinate={coordinates}
        />
        <MarkerView coordinate={coordinates}>
          <View style={styles.annotationContainer}>
            <Image
              source={require('./assets/ic_map_marker_green.png')}
              style={styles.annotationImage}
            />
          </View>
        </MarkerView>
      </MapView>
      <Text style={styles.addressText}>
        {address?.features?.[0]?.properties?.full_address}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
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
  map: {
    flex: 1,
  },
  button: {
    width: 40,
    height: 40,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  annotationContainer: {
    width: 200,
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
  },
  annotationImage: {
    width: 80,
    height: 80,
    resizeMode: 'contain',
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
});

export default Mapbox;
