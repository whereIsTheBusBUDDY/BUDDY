import { createContext, useContext, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import * as Location from 'expo-location';
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
  const intervalRef = useRef(null); // intervalRef로 변경하여 setInterval 관리
  const isSendingRef = useRef(false); // 비동기 작업 상태 관리

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

      const trackPosition = async () => {
        if (isSendingRef.current) return; // 이미 전송 중이라면 중복 전송 방지
        isSendingRef.current = true; // 전송 상태 설정

        try {
          const { coords } = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.BestForNavigation,
          });

          const { latitude, longitude } = coords;
          console.log('위치추적 정보', { latitude, longitude });
          setLocation({ latitude, longitude });

          await sendBusLocation(busNumber, latitude, longitude);
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
        } catch (error) {
          console.error('Error retrieving location:', error);
        } finally {
          isSendingRef.current = false; // 전송 완료 후 상태 해제
        }
      };

      // 주기적인 호출이 완료될 때까지 기다렸다가 다음 주기를 시작합니다.
      intervalRef.current = setInterval(() => {
        if (!isSendingRef.current) {
          trackPosition();
        }
      }, 2000); // 2초마다 실행
    };

    if (isTracking) {
      startTracking();
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isTracking, busNumber]);

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
    if (!isTracking) {
      setIsTracking(true);
    }
  };

  const handleStopTracking = async () => {
    setIsTracking(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    console.log('운행이 종료되었습니다.');
    try {
      await sendStop(busNumber);
    } catch (error) {
      console.error('sendStop오류:', error);
    }
  };

  useEffect(() => {
    console.log('Tracking 상태:', isTracking);
  }, [isTracking]);

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

AdminProvider.propTypes = {
  children: PropTypes.node,
};

export const useAdminContext = () => useContext(AdminContext);
export default AdminContext;
