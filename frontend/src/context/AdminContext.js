import { createContext, useContext, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import * as Location from 'expo-location';
import {
  sendBusLocation,
  getBusStations,
  busVisited,
  sendStop,
  sendAlarm,
} from '../api/busAdmin';
import { Alert } from 'react-native';

const AdminContext = createContext();

export const AdminProvider = ({ children }) => {
  const [busNumber, setBusNumber] = useState('');
  const [isTracking, setIsTracking] = useState(false);
  const [location, setLocation] = useState();
  const [routeStops, setRouteStops] = useState([]);
  const intervalRef = useRef(null);
  const isSendingRef = useRef(false);
  const [time, setTime] = useState(0);
  const [station, setStation] = useState(null); // 펜딩 알람 상태 추가

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
          // 테스트 위치
          // const latitude = 36.346771;
          // const longitude = 127.393179;

          const { coords } = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.BestForNavigation,
          });

          const { latitude, longitude } = coords;
          console.log('위치추적 정보', { latitude, longitude });
          setLocation({ latitude, longitude });

          await sendBusLocation(busNumber, latitude, longitude);
          console.log(busNumber, latitude, longitude);

          // const checkTime = () => {
          //   const currentTime = new Date().getHours();
          //   const newTime = currentTime < 12 ? 1 : 2;
          //   setTime(newTime);
          //   console.log('현재시간(시기준)', currentTime);
          // };

          // checkTime();

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
                const checkTime = () => {
                  const currentTime = new Date().getHours();
                  const newTime = currentTime < 12 ? 1 : 2;
                  setTime(newTime);
                  console.log('현재시간(시기준)', currentTime);
                };

                checkTime();
                console.log(`${stop.stationName} 정류장 방문 기록`);
                busVisited(stop.id, true);
                Alert.alert(`${stop.stationName} 정류장에 도착하였습니다.`);
                // sendAlarm(stop.id, time);
                // console.log('북마크 api 전달', stop.id, time);
                // 펜딩 알람 상태에 스톱 ID 설정
                setStation(stop.id);
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

  // time이 변경될 때마다 실행
  useEffect(() => {
    const sendPendingAlarm = async () => {
      if (station !== null) {
        console.log('오전오후시간', time);
        try {
          await sendAlarm(station, time); // sendAlarm이 비동기라면 await 사용
          console.log('sendAlarm정류장,시간', station, time);
        } catch (error) {
          console.error('알람 전송 중 오류:', error);
        } finally {
          setStation(null); // 알람 전송 후 펜딩 상태 초기화
        }
      }
    };

    sendPendingAlarm();
  }, [time, station]); // time과 station을 의존성 배열에 추가

  const handleStartTracking = () => {
    if (!isTracking) {
      setIsTracking(true);
    }
  };

  const handleStopTracking = async () => {
    setIsTracking(false);
    console.log('운행이 종료되었습니다.');
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
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
        routeStops,
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
