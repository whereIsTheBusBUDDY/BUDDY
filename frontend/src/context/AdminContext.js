import { createContext, useContext, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import * as Location from 'expo-location';
const AdminContext = createContext();
export const AdminProvider = ({ children }) => {
  const [busNumber, setBusNumber] = useState('');
  const [isTracking, setIsTracking] = useState(false);
  const [location, setLocation] = useState();
  const intervalRef = useRef(null);
  // const generateRandomLocation = (latitude, longitude) => {
  //   const radius = 0.001; // 이동 반경 (1km)
  //   const angle = Math.random() * Math.PI * 2; // 0 ~ 2π 랜덤 각도
  //   const deltaLat = radius * Math.cos(angle);
  //   const deltaLng = radius * Math.sin(angle);
  //   return {
  //     latitude: latitude + deltaLat,
  //     longitude: longitude + deltaLng,
  //   };
  // };
  useEffect(() => {
    const startTracking = async () => {
      let { granted } = await Location.requestForegroundPermissionsAsync();
      if (!granted) {
        console.log('위치 추적을 허용해주세요');
        return;
      }
      intervalRef.current = setInterval(async () => {
        let {
          coords: { latitude, longitude },
        } = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.BestForNavigation,
        });
        console.log('위치추적 정보', { latitude, longitude });
        setLocation({ latitude, longitude });
        // setLocation((prevLocation) => {
        //   const newLocation = generateRandomLocation(
        //     prevLocation.latitude,
        //     prevLocation.longitude
        //   );
        //   console.log('위치추적 정보', newLocation);
        //   return newLocation;
        // });
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
  }, [isTracking]);
  const handleStartTracking = () => {
    setIsTracking(true);
  };

  const handleStopTracking = () => {
    setIsTracking(false);
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
