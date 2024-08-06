import { createContext, useContext, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import * as Location from 'expo-location';
// import { updateBusData } from '../data/busData'; // busData 업데이트 함수 import
import {
  sendBusLocation,
  getBusStations,
  busVisited,
  sendStop,
} from '../api/busAdmin';

const AdminContext = createContext();

export const AdminProvider = ({ children }) => {
  const [busNumber, setBusNumber] = useState('');
  const [isTracking, setIsTracking] = useState(false);
  const [location, setLocation] = useState();
  const [routeStops, setRouteStops] = useState([]); // routeStops 상태 추가
  const intervalRef = useRef(null);

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371e3; // 지구 반지름(미터)
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon1 - lon2) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // 거리 반환
  };

  // 주어진 위도와 경도에서 90미터 반경 내에 랜덤 좌표 생성
  const generateRandomNearbyCoordinates = (
    latitude,
    longitude,
    radiusInMeters
  ) => {
    const radiusInDegrees = radiusInMeters / 111300; // 미터를 위도/경도로 변환 (약 111.3km는 1도의 위도 차이)

    const u = Math.random();
    const v = Math.random();

    const w = radiusInDegrees * Math.sqrt(u);
    const t = 2 * Math.PI * v;
    const x = w * Math.cos(t);
    const y = w * Math.sin(t);

    // x가 latitude 차이, y가 longitude 차이
    const newLatitude = latitude + x;
    const newLongitude = longitude + y;

    return { latitude: newLatitude, longitude: newLongitude };
  };

  useEffect(() => {
    const startTracking = async () => {
      let { granted } = await Location.requestForegroundPermissionsAsync();
      if (!granted) {
        console.log('위치 추적을 허용해주세요');
        return;
      }

      intervalRef.current = setInterval(async () => {
        try {
          const { coords } = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.BestForNavigation,
          });

          const { latitude, longitude } = coords;

          // // 임시위치 (3호 1번 정류장)
          // const latitude = 36.31325;
          // const longitude = 127.3786;

          console.log('위치추적 정보', { latitude, longitude });
          setLocation({ latitude, longitude });
          sendBusLocation(busNumber, latitude, longitude);
          console.log(busNumber, latitude, longitude);

          // 루트 정류장 방문 여부 업데이트
          setRouteStops((prevRouteStops) =>
            prevRouteStops.map((stop) => {
              const stopDistance = calculateDistance(
                latitude,
                longitude,
                stop.latitude,
                stop.longitude
              );

              if (stopDistance <= 100 && !stop.visited) {
                console.log(`${stop.stationName} 정류장 방문 기록`);
                busVisited(stop.id, true);
                return { ...stop, visited: true };
              }
              return stop;
            })
          );

          // 버스 데이터 업데이트
          // updateBusData({ latitude, longitude }, busNumber, routeStops);
        } catch (error) {
          console.error('Error retrieving location:', error);
        }
      }, 2000);
    };

    if (isTracking) {
      startTracking();
    } else {
      clearInterval(intervalRef.current);
    }

    return () => {
      clearInterval(intervalRef.current);
    };
  }, [isTracking, busNumber, routeStops]);

  // 버스 번호 변경 시, 해당 노선의 정류장 목록을 설정
  useEffect(() => {
    if (busNumber) {
      getBusStations(busNumber)
        .then((data) => {
          if (data) {
            setRouteStops(data.map((stop) => ({ ...stop, visited: false })));
            console.log('정류장 목록:', data);
          }
        })
        .catch((error) =>
          console.error('정류장 데이터를 가져오는데 실패했습니다:', error)
        );
    }
  }, [busNumber]);

  const handleStartTracking = () => {
    setIsTracking(true);
  };

  // const handleStopTracking = () => {
  //   setIsTracking(false);
  // };

  const handleStopTracking = async () => {
    await sendStop(busNumber);
    console.log('운행이 종료되었습니다.');
  };

  return (
    <AdminContext.Provider
      value={{
        busNumber,
        setBusNumber,
        isTracking,
        setIsTracking,
        location,
        setLocation,
        handleStartTracking,
        handleStopTracking,
        routeStops, // 추가된 상태 반환
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

AdminProvider.prototypes = {
  children: PropTypes.node,
};

export const useAdminContext = () => useContext(AdminContext);
export default AdminContext;
