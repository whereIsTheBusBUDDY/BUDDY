// 실시간 버스 위치
import { useFocusEffect } from '@react-navigation/native';
import React, { useEffect, useState, useRef } from 'react';
import {
  StyleSheet,
  View,
  Dimensions,
  Text,
  TouchableOpacity,
  Image,
  TouchableWithoutFeedback,
} from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { FontAwesome } from '@expo/vector-icons';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { WHITE, PRIMARY, GRAY, BLACK } from '../../constant/color';
import { currentBus, postBusData, postBusDataGpu } from '../../api/busUser';
import RenderingScreen from '../common/RenderingScreen';
import StationMarker from './StationMarker';
import NotExistScreen from '../common/NotExistScreen';
import DropdownBus from '../../components/Dropdown/DropdownBus';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const BusScreen = () => {
  const [selectedRoute, setSelectedRoute] = useState('1'); // 기본적으로 '1'
  const [locationMap, setLocationMap] = useState(null); // 초기 위치를 null로 설정
  const [busStops, setBusStops] = useState([]); // 경로 데이터를 위한 상태
  const [stations, setStations] = useState([]); // 정류장 데이터를 위한 상태
  const [selectedStation, setSelectedStation] = useState(null); // 선택된 정류장을 저장
  const [starSelected, setStarSelected] = useState(false); // 즐겨찾기 상태
  const [busLocation, setBusLocation] = useState(null); // 버스 위치 상태
  const [arrivalTime, setArrivalTime] = useState(null);
  const mapRef = useRef(null);
  const intervalRef = useRef(null);
  const [isExist, setIsExist] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const isAfternoon = () => {
    const currentHour = new Date().getHours();
    return currentHour >= 12; // 현재 시간이 12시(정오) 이후인지 체크
  };

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

  const moveToMarker = () => {
    if (busLocation && mapRef.current) {
      mapRef.current.animateToRegion({
        ...busLocation,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      });
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

      // 현재 위치 가져오기
      let location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      // 현재 위치로 초기 위치 설정
      setLocationMap({
        // latitude: 36.3553089,
        // longitude: 127.2984993,
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      });

      // 기본 노선에 대한 경로 및 정류장 데이터 가져오기
      fetchBusStops(selectedRoute);
      fetchStations(selectedRoute);
      fetchBookmarks(); // 즐겨찾기 목록 가져오기
    })();
  }, []);

  // 새로운 노선 선택 시 경로 및 정류장 데이터 업데이트
  useEffect(() => {
    setIsLoading(true);
    fetchBusStops(selectedRoute);
    fetchStations(selectedRoute);

    // 지도 초기 위치 -> 현재위치
    if (mapRef.current) {
      mapRef.current.animateToRegion({
        latitude: locationMap.latitude,
        longitude: locationMap.longitude,
        // latitude: 36.3553089,
        // longitude: 127.2984993,

        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      });
      setIsLoading(false);
    }
  }, [selectedRoute]);

  // 선택된 정류장의 즐겨찾기 상태 확인
  useEffect(() => {
    fetchBookmarks(); // 선택한 정류장이 변경될 때마다 즐겨찾기 목록 업데이트
  }, [selectedStation]);

  // 2초마다 버스 위치를 가져오는 useEffect 설정

  useFocusEffect(
    React.useCallback(() => {
      intervalRef.current = setInterval(async () => {
        try {
          const responseData = await currentBus(selectedRoute); // API 요청 및 데이터 가져오기
          console.log('드롭다운 ', selectedRoute);
          if (!responseData) {
            console.error('버스 데이터를 가져오지 못했습니다.');
            setIsLoading(false);
            setIsExist(false);
            return;
          }

          // console.log('API 응답 데이터:', responseData); // 응답 데이터 확인

          // 동적으로 키 생성
          const busPrefix = [
            'first',
            'second',
            'third',
            'fourth',
            'fifth',
            'sixth',
          ][parseInt(selectedRoute) - 1];

          const latitudeKey = `${busPrefix}BusLatitude`;
          const longitudeKey = `${busPrefix}BusLongitude`;

          // 위도 및 경도 추출
          const latitude = responseData[latitudeKey];
          const longitude = responseData[longitudeKey];

          if (latitude && longitude) {
            const newBusLocation = {
              latitude,
              longitude,
            };

            setBusLocation(newBusLocation); // 버스 위치 상태 업데이트

            console.log('버스 위치 업데이트:', newBusLocation); // 콘솔에 버스 위치 출력
            setIsExist(true);
          } else {
            console.error(
              `위치 데이터가 없습니다: ${latitudeKey}, ${longitudeKey}`
            );
            setIsExist(false);
          }
        } catch (error) {
          console.error('버스 위치를 가져오는 중 오류 발생:', error);
          setIsExist(false);
        }
      }, 2000);

      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      };
    }, [selectedRoute])
  );

  // 버스 정류장 마커 클릭 시 호출되는 함수
  const onBusStopMarkerClick = async (station) => {
    if (!busLocation) return;

    // 선택된 정류장의 인덱스 찾기
    const selectedStationIndex = stations.findIndex((s) => s.id === station.id);

    // 이전 정류장들만 route 배열에 포함시키기
    const route = stations
      .slice(0, selectedStationIndex) // selectedStation 이전의 정류장들만 선택
      .map((stop) => ({
        busStopLongitude: stop.longitude,
        busStopLatitude: stop.latitude,
        visited: stop.visited,
      }));

    const data = {
      nowBusLongitude: busLocation.longitude,
      nowBusLatitude: busLocation.latitude,
      busLine: selectedRoute,
      detailBusStopLongitude: station.longitude,
      detailBusStopLatitude: station.latitude,
      route: route,
    };

    try {
      const responseData = await postBusData(data);
      console.log('Response data:', responseData); // 서버 응답 확인
      let time = responseData.predicted_time;
      console.log('Response time:', time); // 서버 응답 확인

      // 서버로부터 받은 도착 시간 정보를 상태로 저장
      if (time >= 0) {
        console.log('Setting arrival time:', time);
        setArrivalTime(time);
        // let re
      } else if (time === -1) {
        console.log(time);
        responseDataGPU = await postBusDatapostBusDataGpu(data);
        let time = responseDataGPU.predicted_time;
        console.log('gpu Response time:', time);
        console.log('gpu Setting arrival time:', time);
        setArrivalTime(time);
      } else {
        console.warn('Arrival time not found in response');
      }
      setSelectedStation(station);
    } catch (error) {
      console.error('Error fetching arrival time:', error);
    }
    console.log(arrivalTime);
  };
  if (!isExist && !isLoading) {
    return (
      <View style={styles.container}>
        {/* 드롭다운 메뉴 */}
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
        <NotExistScreen busNumber={selectedRoute} />
      </View>
    );
  } else if (!isExist && isLoading) {
    return <RenderingScreen />;
  }
  return (
    <TouchableWithoutFeedback onPress={() => setSelectedStation(null)}>
      <View style={styles.container}>
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
        {locationMap ? (
          <View>
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
              {/* 선택된 호차에 대한 버스 위치 마커 */}
              {busLocation && (
                <Marker coordinate={busLocation} title="현재 버스 위치">
                  <Image
                    resizeMode="cover"
                    source={require('../../../assets/busMarker.png')} // 버스 이미지 파일 경로 설정
                    style={styles.busImage}
                  />
                </Marker>
              )}

              {/* API로부터 받아온 정류장 데이터를 마커로 표시 */}
              {stations.map((station) => (
                <StationMarker
                  key={station.id}
                  station={station}
                  onPress={onBusStopMarkerClick}
                />
              ))}

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
            <TouchableOpacity style={styles.button} onPress={moveToMarker}>
              <FontAwesome name="location-arrow" size={24} color="white" />
            </TouchableOpacity>
          </View>
        ) : (
          <RenderingScreen />
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

            <View style={styles.partline} />
            <View style={styles.line}>
              <Text style={styles.textStyle}>{selectedRoute}호차</Text>
              <Text style={styles.point}>
                {isAfternoon()
                  ? '정보 제공 시간이 아닙니다'
                  : arrivalTime
                  ? `${arrivalTime}분 후 도착`
                  : '도착 시간 정보 없음'}
              </Text>
            </View>
          </View>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  image: {
    width: 50,
    height: 50,
  },
  busImage: {
    width: 30,
    height: 42,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  map: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT, // Map takes the full height
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
    fontSize: 30,
    fontWeight: 'bold',
    color: GRAY.DEFAULT, // 초기 별 색상은 회색
    marginLeft: 10,
  },
  starSelected: {
    fontSize: 30,
    fontWeight: 'bold',
    color: PRIMARY.DEFAULT, // 선택 시 별 색상은 주황색
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
  dropdown: {
    position: 'absolute',
    top: 80,
    left: 20,
    zIndex: 1000,
  },
});

export default BusScreen;
