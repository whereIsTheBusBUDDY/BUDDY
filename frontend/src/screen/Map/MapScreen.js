import React, { useEffect, useState, useRef } from 'react';
import {
  StyleSheet,
  View,
  Dimensions,
  Text,
  TouchableOpacity,
  Platform,
  Image,
  TouchableWithoutFeedback,
} from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { FontAwesome } from '@expo/vector-icons';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { WHITE, PRIMARY, GRAY, BLACK } from '../../constant/color';
import RenderingScreen from '../common/RenderingScreen';
import DropdownBus from '../../components/Dropdown/DropdownBus';
import { BASEurl, routeUrl } from '../../api/url';
import { fetchProfileData } from '../../api/user';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const MapScreen = () => {
  const [selectedRoute, setSelectedRoute] = useState(''); // 기본 노선 -> 선호 노선으로 설정
  const [locationMap, setLocationMap] = useState();
  const [busStops, setBusStops] = useState([]); // 경로 데이터를 위한 상태
  const [stations, setStations] = useState([]); // 정류장 데이터를 위한 상태
  const [selectedStation, setSelectedStation] = useState(null); // 선택된 정류장을 저장
  const [starSelected, setStarSelected] = useState(false); // 즐겨찾기 상태
  const [loading, setLoading] = useState(true); // 로딩 상태
  const mapRef = useRef(null);

  // 프로필에서 선호노선 가져오기
  const fetchFavoriteRoute = async () => {
    try {
      const data = await fetchProfileData();
      const route = data.favoriteLine;
      setSelectedRoute(route);
      console.log('프로필데이터', data);
      console.log('프로필선호노선', route);

      // 선호 노선이 설정된 후 데이터를 가져옴
      await fetchBusStops(route);
      await fetchStations(route);
    } catch (error) {
      console.error('프로필 정보를 가져오는 중 오류 발생:', error);
    }
  };

  // API에서 경로 데이터를 가져오는 함수
  const fetchBusStops = async (busLine) => {
    try {
      const response = await fetch(
        `${routeUrl}/coordinates?busLine=${busLine}`
      );
      const data = await response.json();
      setBusStops(Array.isArray(data) ? data : []); // 경로 데이터 설정
    } catch (error) {
      console.error('Error fetching bus stops:', error);
      setBusStops([]); // 오류 시 빈 배열로 설정
    }
  };

  // API에서 정류장 데이터를 가져오는 함수
  const fetchStations = async (busLine) => {
    try {
      const accessToken = await AsyncStorage.getItem('accessToken');

      if (!accessToken) {
        console.error('Access token is missing');
        return;
      }

      const response = await fetch(`${BASEurl}/stations/${busLine}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        console.error(`HTTP error! status: ${response.status}`);
        return;
      }

      const data = await response.json(); // JSON으로 응답을 파싱
      setStations(Array.isArray(data) ? data : []); // 정류장 데이터 설정
    } catch (error) {
      console.error('Error fetching stations:', error);
      setStations([]); // 오류 시 빈 배열로 설정
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

      const response = await fetch(`${BASEurl}/bookmarks`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        console.error(`HTTP error! status: ${response.status}`);
        return;
      }

      const data = await response.json(); // JSON으로 응답을 파싱
      const bookmarkedStationIds = data.map((bookmark) => bookmark.stationId);

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
        const response = await fetch(
          `${BASEurl}/bookmarks?stationId=${selectedStation.id}`,
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
        const response = await fetch(
          `${BASEurl}/bookmarks?stationId=${selectedStation.id}`,
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

      // 현재 위치 가져오기
      let location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      setLocationMap({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      });

      let current_location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      setLocationMap({
        latitude: current_location.coords.latitude,
        longitude: current_location.coords.longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      });

      // 선호 노선을 기본으로 설정
      await fetchFavoriteRoute();
      await fetchBookmarks(); // 즐겨찾기 목록 가져오기

      setLoading(false); // 로딩 완료
    })();
  }, []);

  // 새로운 노선 선택 시 경로 및 정류장 데이터 업데이트
  // useEffect(() => {
  //   if (!loading) {
  //     (async () => {
  //       await fetchBusStops(selectedRoute); // selectedRoute 변경 후 경로 데이터 불러오기
  //       await fetchStations(selectedRoute); // selectedRoute 변경 후 정류장 데이터 불러오기
  //     })();
  //   }
  // }, [selectedRoute]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true); // 로딩 시작

      try {
        await fetchBusStops(selectedRoute); // 새로운 노선에 대한 경로 데이터 가져오기
        await fetchStations(selectedRoute); // 새로운 노선에 대한 정류장 데이터 가져오기

        // 지도 초기 위치 -> 현재 위치로 이동
        if (mapRef.current && locationMap) {
          mapRef.current.animateToRegion({
            latitude: locationMap.latitude,
            longitude: locationMap.longitude,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005,
          });
        }
      } catch (error) {
        console.error('Error fetching data for selected route:', error);
      } finally {
        setLoading(false); // 로딩 완료
      }
    };

    if (selectedRoute) {
      fetchData();
    }
  }, [selectedRoute, locationMap]);

  // 선택된 정류장의 즐겨찾기 상태 확인
  useEffect(() => {
    if (!loading) {
      fetchBookmarks(); // 선택한 정류장이 변경될 때마다 즐겨찾기 목록 업데이트
    }
  }, [selectedStation]);

  return (
    <TouchableWithoutFeedback onPress={() => setSelectedStation(null)}>
      <View style={styles.container}>
        {locationMap ? (
          <>
            <View style={styles.dropdown}>
              <DropdownBus
                selectedValue={`${selectedRoute}호차`}
                onChangeValue={(value) =>
                  setSelectedRoute(value.replace('호차', ''))
                }
                backgroundColor={PRIMARY.DEFAULT}
                color={WHITE}
              />
            </View>

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
              {stations.map((station) => (
                <Marker
                  key={station.id}
                  coordinate={{
                    latitude: station.latitude,
                    longitude: station.longitude,
                  }}
                  onPress={() => setSelectedStation(station)}
                >
                  <Image
                    source={require('../../../assets/busStopIcon.png')}
                    style={styles.stationMarker}
                  />
                </Marker>
              ))}

              <Polyline
                coordinates={busStops.map((stop) => ({
                  latitude: stop.latitude,
                  longitude: stop.longitude,
                }))}
                strokeWidth={10}
                strokeColor={PRIMARY.DEFAULT}
              />
            </MapView>
          </>
        ) : (
          <RenderingScreen />
        )}

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
    </TouchableWithoutFeedback>
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
    top: 80,
    left: 20,
    zIndex: 1000,
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

  title: {
    fontSize: 20,
    fontWeight: 'bold',
    paddingLeft: 5,
  },
  star: {
    fontSize: 20,
    fontWeight: 'bold',
    color: GRAY.DEFAULT, // 초기 별 색상은 회색
    marginLeft: 10,
  },
  starSelected: {
    fontSize: 20,
    fontWeight: 'bold',
    color: PRIMARY.DEFAULT, // 선택 시 별 색상은 주황색
    marginLeft: 10,
  },

  titlecontainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingRight: 20,
    marginTop: 10,
  },

  stationMarker: {
    width: 50,
    height: 50,
    resizeMode: 'cover',
  },
});

export default MapScreen;
