import React, { useEffect, useState, useRef } from 'react';
import {
  StyleSheet,
  View,
  Dimensions,
  Text,
  TouchableOpacity,
} from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { FontAwesome } from '@expo/vector-icons';
import * as Location from 'expo-location';
import busRoutes from '../../data/busStops'; // 더미 데이터 경로
import ModalDropdown from 'react-native-modal-dropdown';
import busLine from '../../data/busLine'; // 경로 데이터 파일 가져오기

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Google Maps API 키를 여기에 입력하세요
const GOOGLE_MAPS_APIKEY = 'AIzaSyAqkabjy1LZw_B8EC6Pm7kFTsEiTeoef4U';

const MapScreen = () => {
  const [selectedRoute, setSelectedRoute] = useState('bus1'); // 기본적으로 1호차를 선택
  const [locationMap, setLocationMap] = useState(null);
  const mapRef = useRef(null);

  // 선택된 노선의 정류장 데이터
  const busStops = busRoutes[selectedRoute];

  // 위치 권한 요청 및 초기 위치 설정
  useEffect(() => {
    (async () => {
      // 위치 권한 요청
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permission to access location was denied');
        return;
      }

      // 현재 위치 가져오기
      let {
        coords: { latitude, longitude },
      } = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.BestForNavigation,
      });

      // 초기 위치 설정
      setLocationMap({
        latitude,
        longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
    })();
  }, []);

  const moveToMarker = () => {
    if (locationMap && mapRef.current) {
      mapRef.current.animateToRegion({
        ...locationMap,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      });
    }
  };

  // Polyline에 사용할 좌표 배열 생성
  const routeCoordinates = busLine.map((point) => ({
    latitude: point.latitude,
    longitude: point.longitude,
  }));

  return (
    <View style={styles.container}>
      {/* 드롭다운 메뉴 */}
      <ModalDropdown
        options={['1호차', '2호차', '3호차', '4호차', '5호차']}
        defaultValue="1호차"
        style={styles.dropdown}
        textStyle={styles.dropdownText}
        dropdownStyle={styles.dropdownDropdown}
        onSelect={(index, value) =>
          setSelectedRoute(`bus${parseInt(index) + 1}`)
        }
      />

      {locationMap ? (
        <MapView
          ref={mapRef}
          style={styles.map}
          initialRegion={{
            latitude: busStops[0].latitude, // 초기 위치를 첫 번째 정류장으로 설정
            longitude: busStops[0].longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
          showsUserLocation={true} // 사용자 위치 표시
        >
          <Marker
            key={busRoutes.bus0.stationId}
            coordinate={{
              latitude: busRoutes.bus0[0].latitude,
              longitude: busRoutes.bus0[0].longitude,
            }}
            title={busRoutes.bus0.stationName}
          />
          {busStops.map((stop) => (
            <Marker
              key={stop.stationId}
              coordinate={{
                latitude: stop.latitude,
                longitude: stop.longitude,
              }}
              title={stop.stationName}
            >
              <FontAwesome name="map-marker" size={30} color="blue" />
            </Marker>
          ))}

          {/* Polyline 컴포넌트를 사용하여 경로 표시 */}
          <Polyline
            coordinates={routeCoordinates}
            strokeWidth={4}
            strokeColor="blue"
          />
        </MapView>
      ) : (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading...</Text>
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
    alignItems: 'center',
  },
  map: {
    width: '100%',
    height: '90%', // 드롭다운을 위한 높이 조정
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 24,
    fontWeight: '500',
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
  dropdown: {
    width: SCREEN_WIDTH * 0.8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
  },
  dropdownText: {
    fontSize: 18,
    textAlign: 'center',
  },
  dropdownDropdown: {
    width: SCREEN_WIDTH * 0.8,
    marginTop: 10,
    borderRadius: 5,
  },
});

export default MapScreen;
