import {
  Button,
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useAdminContext } from '../../context/AdminContext';
import MapView, { Marker } from 'react-native-maps';
import { useEffect, useRef, useState } from 'react';
import * as Location from 'expo-location';
import { FontAwesome } from '@expo/vector-icons'; // 아이콘을 사용하기 위해 추가

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const AdminMapScreen = () => {
  const { busNumber } = useAdminContext();
  const [locationMap, setLocationMap] = useState(null);
  const mapRef = useRef(null);
  const {
    handleStartTracking,
    handleStopTracking,
    setLocation,
    location,
    isTracking,
  } = useAdminContext();
  const moveToMarker = () => {
    if (locationMap && mapRef.current) {
      mapRef.current.animateToRegion({
        ...locationMap,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      });
    }
  };
  // const ask = async () => {
  //   let {
  //     coords: { latitude, longitude },
  //   } = await Location.getCurrentPositionAsync({
  //     accuracy: Location.Accuracy.BestForNavigation,
  //   });
  //   setLocationMap({
  //     latitude,
  //     longitude,
  //     latitudeDelta: 0.005,
  //     longitudeDelta: 0.005,
  //   });
  //   console.log('초기 위치', { latitude, longitude });
  //   console.log('초기 위치 location', locationMap);
  // };
  // useEffect(() => {
  //   ask();
  // }, []);
  useEffect(() => {
    if (location) {
      setLocationMap({
        latitude: location.latitude,
        longitude: location.longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      });
      // console.log('location update', location);
    }
  }, [location]);
  return (
    <View style={styles.container}>
      {locationMap ? (
        <MapView ref={mapRef} style={styles.map} initialRegion={locationMap}>
          <Marker coordinate={locationMap} title={`${busNumber}호차`}>
            <Image
              source={require('../../../assets/bus_maker.png')} // 이미지 경로를 실제 경로로 변경하세요
              style={{ width: 40, height: 40 }}
              resizeMode="contain"
            />
          </Marker>
        </MapView>
      ) : (
        <View style={styles.container}>
          <Text style={styles.cityName}>Loading...</Text>
        </View>
      )}
      <TouchableOpacity style={styles.button} onPress={moveToMarker}>
        <FontAwesome name="location-arrow" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignContent: 'center',
  },
  map: {
    width: '100%',
    height: '100%',
  },
  city: {
    flex: 1,
    // backgroundColor: 'blue',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cityName: {
    fontSize: 38,
    fontWeight: '500',
  },
  weather: {
    // backgroundColor: 'teal',
  },
  day: {
    width: SCREEN_WIDTH,
    alignItems: 'center',
  },
  temp: {
    marginTop: 50,
    fontSize: 168,
  },
  description: {
    marginTop: -30,
    fontSize: 60,
  },
  button: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: 'orange',
    borderRadius: 30,
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default AdminMapScreen;
