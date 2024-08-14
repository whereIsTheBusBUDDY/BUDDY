import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
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
import MapView, { Marker, Polyline } from 'react-native-maps';
import * as Location from 'expo-location';
import { FontAwesome } from '@expo/vector-icons'; // 아이콘을 사용하기 위해 추가
import StopTrackingButton from '../../components/admin/StopTrackingButton';
import { ButtonType } from '../../components/AdminSelectButton';
import { useNavigation } from '@react-navigation/native';
import RenderingScreen from '../common/RenderingScreen';
import { WHITE, PRIMARY } from '../../constant/color';
import { boardingCount } from '../../api/busAdmin';
import { fetchBusStops } from '../../api/busUser'; // 제대로 경로 확인

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const AdminMapScreen = () => {
  const { busNumber } = useAdminContext();
  const [locationMap, setLocationMap] = useState(null);
  const [boardingNumber, setBoardingNumber] = useState(0);
  const [busStops, setBusStops] = useState([]); // 경로 데이터를 위한 상태
  const mapRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const responseDataRoute = await fetchBusStops(busNumber); // await 사용
        setBusStops(responseDataRoute);

        const num = await boardingCount(busNumber);
        setBoardingNumber(num);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, [busNumber]); // busNumber가 변경될 때마다 새로 데이터를 가져옵니다.

  const {
    handleStartTracking,
    handleStopTracking,
    setLocation,
    location,
    setIsTracking,
    isTracking,
  } = useAdminContext();

  const navigate = useNavigation();

  const moveToMarker = () => {
    if (locationMap && mapRef.current) {
      mapRef.current.animateToRegion({
        ...locationMap,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      });
    }
  };

  const stopBus = () => {
    setIsTracking(false);
    console.log('stopBus 실행');
    handleStopTracking();
    Alert.alert('운행을 종료합니다.');
    navigate.navigate('AdminMain');
  };

  useEffect(() => {
    if (location) {
      setLocationMap({
        latitude: location.latitude,
        longitude: location.longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      });
      if (mapRef.current) {
        mapRef.current.animateToRegion(
          {
            latitude: location.latitude,
            longitude: location.longitude,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005,
          },
          500 // 500ms 애니메이션 지속 시간
        );
      }
    }
  }, [location]);

  return (
    <View style={styles.container}>
      {locationMap ? (
        <MapView
          ref={mapRef}
          style={styles.map}
          initialRegion={locationMap}
          onMapReady={moveToMarker}
        >
          <Marker coordinate={locationMap} title={`${busNumber}호차`}>
            <Image
              source={require('../../../assets/bus_maker.png')} // 이미지 경로를 실제 경로로 변경하세요
              style={{ width: 40, height: 40 }}
              resizeMode="contain"
            />
          </Marker>
          {/* 경로 표시를 위한 Polyline */}
          <Polyline
            coordinates={busStops.map((stop) => ({
              latitude: stop.latitude,
              longitude: stop.longitude,
            }))}
            strokeWidth={10}
            strokeColor={PRIMARY.DEFAULT}
          />
        </MapView>
      ) : (
        <RenderingScreen />
      )}
      <TouchableOpacity
        style={styles.boardingPeopleButton}
        onPress={moveToMarker}
      >
        <Text style={{ color: 'white' }}>{boardingNumber}명</Text>
      </TouchableOpacity>
      <View style={styles.closebus}>
        <StopTrackingButton
          title={`${busNumber}호차`}
          onPress={stopBus}
          disabled={false}
          buttonType={ButtonType.PRIMARY}
          height={65}
        />
      </View>
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
  closebus: {
    position: 'absolute',
    bottom: -20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
    width: '100%',
  },
  button: {
    position: 'absolute',
    bottom: 90,
    right: 20,
    backgroundColor: 'orange',
    borderRadius: 30,
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  boardingPeopleButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    backgroundColor: '#f97316',
    borderRadius: 8,
    width: 60,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    color: '#ffffff',
  },
});

export default AdminMapScreen;
