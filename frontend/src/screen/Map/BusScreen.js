// 실시간

import React, { useEffect, useState, useRef } from 'react';
import {
  StyleSheet,
  View,
  Dimensions,
  Text,
  TouchableOpacity,
  Platform,
} from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { FontAwesome } from '@expo/vector-icons';
import * as Location from 'expo-location';
import ModalDropdown from 'react-native-modal-dropdown';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { WHITE } from '../../constant/color';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Google Maps API key
const GOOGLE_MAPS_APIKEY = 'AIzaSyAqkabjy1LZw_B8EC6Pm7kFTsEiTeoef4U';

// 색상 상수 정의
const PRIMARY = '#f97316'; // 예시: 주황색
const GRAY = '#ccc'; // 예시: 회색

const BusScreen = () => {
  const [selectedRoute, setSelectedRoute] = useState('1'); // 기본적으로 '1'
  const [locationMap, setLocationMap] = useState({
    latitude: 37.5665, // 초기 위도 (서울)
    longitude: 126.978, // 초기 경도 (서울)
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const [busStops, setBusStops] = useState([]); // 경로 데이터를 위한 상태
  const [stations, setStations] = useState([]); // 정류장 데이터를 위한 상태
  const [selectedStation, setSelectedStation] = useState(null); // 선택된 정류장을 저장
  const [starSelected, setStarSelected] = useState(false); // 즐겨찾기 상태
  const mapRef = useRef(null);

  // API에서 경로 데이터를 가져오는 함수
  const fetchBusStops = async (busLine) => {
    try {
      const response = await fetch(
        `http://54.180.242.7:8080/coordinates?busLine=${busLine}`
      );
      const data = await response.json();
      setBusStops(data); // 경로 데이터 설정
    } catch (error) {
      console.error('Error fetching bus stops:', error);
    }
  };

  // API에서 정류장 데이터를 가져오는 함수
  const fetchStations = async (busLine) => {
    try {
      // AsyncStorage에서 액세스 토큰 불러오기
      const accessToken = await AsyncStorage.getItem('accessToken');

      if (!accessToken) {
        console.error('Access token is missing');
        return;
      }

      const response = await fetch(
        `http://i11b109.p.ssafy.io:8080/stations/${busLine}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`, // 액세스 토큰을 Authorization 헤더에 추가
          },
        }
      );

      // 응답 상태 확인
      if (!response.ok) {
        console.error(`HTTP error! status: ${response.status}`);
        return;
      }

      const data = await response.json(); // JSON으로 응답을 파싱
      setStations(data); // 정류장 데이터 설정
    } catch (error) {
      console.error('Error fetching stations:', error);
    }
  };

  // API에서 즐겨찾기 목록을 가져오는 함수
  const fetchBookmarks = async () => {
    try {
      const accessToken = await AsyncStorage.getItem('accessToken');

      if (!accessToken) {
        console.error('Access token is missing');
        return;
      }

      const response = await fetch('http://i11b109.p.ssafy.io:8080/bookmarks', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`, // 액세스 토큰을 Authorization 헤더에 추가
        },
      });

      if (!response.ok) {
        console.error(`HTTP error! status: ${response.status}`);
        return;
      }

      const data = await response.json(); // JSON으로 응답을 파싱
      const bookmarkedStationIds = data.map((bookmark) => bookmark.stationId);
      // 현재 선택된 정류장이 즐겨찾기 목록에 있는지 확인
      setStarSelected(
        selectedStation
          ? bookmarkedStationIds.includes(selectedStation.id)
          : false
      );
    } catch (error) {
      console.error('Error fetching bookmarks:', error);
    }
  };

  // 별표 상태를 토글하고 서버에 업데이트하는 함수
  const toggleStar = async () => {
    if (!selectedStation) return;

    const accessToken = await AsyncStorage.getItem('accessToken');

    if (!accessToken) {
      console.error('Access token is missing');
      return;
    }

    try {
      if (starSelected) {
        // 즐겨찾기 해제 - DELETE 요청
        const response = await fetch(
          `http://i11b109.p.ssafy.io:8080/bookmarks?stationId=${selectedStation.id}`,
          {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        if (!response.ok) {
          console.error(`HTTP error on DELETE! status: ${response.status}`);
          return;
        }

        console.log('Bookmark removed');
      } else {
        // 즐겨찾기 추가 - POST 요청 (필요시 구현)
        const response = await fetch(
          `http://i11b109.p.ssafy.io:8080/bookmarks?stationId=${selectedStation.id}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({ stationId: selectedStation.id }),
          }
        );

        if (!response.ok) {
          console.error(`HTTP error on POST! status: ${response.status}`);
          return;
        }

        console.log('Bookmark added');
      }

      // 즐겨찾기 상태 토글
      setStarSelected(!starSelected);
      fetchBookmarks(); // 즐겨찾기 목록 갱신
    } catch (error) {
      console.error('Error updating bookmark:', error);
    }
  };

  // 위치 권한 요청 및 초기 위치 설정
  useEffect(() => {
    (async () => {
      // 위치 권한 요청
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permission to access location was denied');
        return;
      }

      // // 현재 위치 가져오기
      // let {
      //   coords: { latitude, longitude },
      // } = await Location.getCurrentPositionAsync({
      //   accuracy: Location.Accuracy.BestForNavigation,
      // });

      // // 현재 위치로 초기 위치 설정
      // setLocationMap((prevState) => ({
      //   ...prevState,
      //   latitude,
      //   longitude,
      // }));

      // 기본 노선에 대한 경로 및 정류장 데이터 가져오기
      fetchBusStops(selectedRoute);
      fetchStations(selectedRoute);
      fetchBookmarks(); // 즐겨찾기 목록 가져오기
    })();
  }, []);

  // 새로운 노선 선택 시 경로 및 정류장 데이터 업데이트
  useEffect(() => {
    fetchBusStops(selectedRoute);
    fetchStations(selectedRoute);

    // 지도 초기 위치를 연수원으로 설정
    if (mapRef.current) {
      mapRef.current.animateToRegion({
        latitude: 36.3553089,
        longitude: 127.2984993,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
    }
  }, [selectedRoute]);

  // 선택된 정류장의 즐겨찾기 상태 확인
  useEffect(() => {
    fetchBookmarks(); // 선택한 정류장이 변경될 때마다 즐겨찾기 목록 업데이트
  }, [selectedStation]);

  return (
    <View style={styles.container}>
      {/* 드롭다운 메뉴 */}
      <ModalDropdown
        options={['1호차', '2호차', '3호차', '4호차', '5호차', '6호차']}
        defaultValue="1호차"
        style={styles.dropdown}
        textStyle={styles.dropdownText}
        dropdownStyle={styles.dropdownDropdown}
        onSelect={(index, value) => {
          setSelectedRoute(`${parseInt(index) + 1}`);
        }}
      />

      {locationMap ? (
        <MapView
          ref={mapRef}
          style={styles.map}
          initialRegion={{
            latitude: locationMap.latitude,
            longitude: locationMap.longitude,
            latitudeDelta: locationMap.latitudeDelta,
            longitudeDelta: locationMap.longitudeDelta,
          }}
          showsUserLocation={true} // 사용자 위치 표시
        >
          {/* API로부터 받아온 정류장 데이터를 마커로 표시 */}
          {stations.map((station) => (
            <Marker
              key={station.id}
              coordinate={{
                latitude: station.latitude,
                longitude: station.longitude,
              }}
              onPress={() => setSelectedStation(station)} // 마커 클릭 시 정류장 선택
            >
              <FontAwesome name="map-marker" size={30} color="blue" />
            </Marker>
          ))}

          {/* 경로 표시를 위한 Polyline */}
          <Polyline
            coordinates={busStops.map((stop) => ({
              latitude: stop.latitude,
              longitude: stop.longitude,
            }))}
            strokeWidth={4}
            strokeColor="blue"
          />
        </MapView>
      ) : (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      )}

      {/* 선택된 정류장이 있을 때만 표시 */}
      {selectedStation && (
        <View style={styles.infobox}>
          <View style={styles.titlecontainer}>
            <Text style={styles.title}>{selectedStation.stationName}</Text>
            <TouchableOpacity onPress={toggleStar}>
              <Text style={starSelected ? styles.starSelected : styles.star}>
                ★
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  map: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT, // Map takes the full height
  },
  dropdown: {
    position: 'absolute',
    width: 100, // 드롭다운 버튼의 너비 조정
    top: Platform.OS === 'ios' ? 60 : 70, // 플랫폼에 따라 상단 위치 조정
    right: 30, // 오른쪽 가장자리에서 10px 떨어짐
    backgroundColor: '#f97316', // 배경색은 주황색
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 10,
    alignItems: 'center',
    zIndex: 1000,
  },
  dropdownText: {
    color: '#fff',
    fontSize: 16,
  },
  dropdownDropdown: {
    width: 100, // 드롭다운 리스트의 너비를 버튼과 동일하게 조정
    height: 200,
    borderWidth: 1,
    borderRadius: 20,
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

  infobox: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    paddingVertical: 20,
    paddingHorizontal: 40,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  textStyle: {
    fontSize: 16,
    marginBottom: 10,
    marginRight: 20,
    paddingLeft: 8,
  },
  line: {
    flexDirection: 'row',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    paddingLeft: 5,
  },
  star: {
    fontSize: 20,
    fontWeight: 'bold',
    color: GRAY, // 초기 별 색상은 회색
    marginLeft: 10,
  },
  starSelected: {
    fontSize: 20,
    fontWeight: 'bold',
    color: PRIMARY, // 선택 시 별 색상은 주황색
    marginLeft: 10,
  },
  partline: {
    height: 1,
    backgroundColor: '#ccc',
    width: '100%',
    marginVertical: 20,
  },
  titlecontainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingRight: 20,
    marginTop: 10,
  },
  point: {
    color: '#f97316',
  },
});

export default BusScreen;
