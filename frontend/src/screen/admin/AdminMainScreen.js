import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useUserContext } from '../../context/UserContext';
import { useAdminContext } from '../../context/AdminContext';
import AdminMainButton from '../../components/admin/AdminMainButton';
import { PRIMARY, WHITE } from '../../constant/color';
import { ButtonType } from '../../components/AdminSelectButton';
import * as Location from 'expo-location';
import { useNavigation } from '@react-navigation/native';
import StartTrackingButton from '../../components/admin/StartTrackingButton';
import PeopleCountButton from '../../components/admin/PeopleCountButton';
import { boardingCount } from '../../api/busAdmin';

const AdminMainScreen = () => {
  const { loginUser, setLoginUser } = useUserContext();
  const [boardingNumber, setBoardingNumber] = useState(null); // 상태 선언 수정
  const {
    busNumber,
    setIsTracking,
    isTracking,
    location,
    setLocation,
    handleStartTracking,
    handleStopTracking,
  } = useAdminContext();
  const navigate = useNavigation();

  // API 호출 및 데이터 로딩
  useEffect(() => {
    const fetchBoardingCount = async () => {
      try {
        const result = await boardingCount(busNumber); // 비동기 호출
        setBoardingNumber(result); // 상태 업데이트
        console.log(result);
      } catch (error) {
        console.error('탑승인원 불러오기 실패', error); // 오류 처리
      }
    };

    fetchBoardingCount(); // useEffect 내에서 API 호출
  }, [busNumber]); // busNumber가 변경될 때마다 호출

  const logout = () => {
    handleStopTracking();
    setLoginUser(null);
  };

  const stopBus = () => {
    setIsTracking(false);
    console.log('stopBus 실행');
    handleStopTracking();
  };

  const startBus = () => {
    setIsTracking(true);
    if (!isTracking) {
      handleStartTracking();
    }
    navigate.navigate('AdminMapScreen');
  };

  return (
    <View style={styles.container}>
      <Text>운행 시작시 GPS가 활성화되며,</Text>
      <Text>실시간 셔틀버스 위치가 공유됩니다.</Text>
      <StartTrackingButton
        title={`${busNumber}호차`}
        onPress={startBus}
        disabled={false}
        buttonType={ButtonType.PRIMARY}
        height={150}
      />
      <PeopleCountButton
        title={'탑승현황'}
        onPress={handleStartTracking}
        disabled={false}
        buttonType={ButtonType.GRAY}
        height={150}
        value={boardingNumber} // 상태에서 값 가져오기
      />
      <AdminMainButton
        title={'건의함 보기'}
        onPress={handleStartTracking}
        disabled={false}
        buttonType={ButtonType.PRIMARY}
        height={50}
      />
      <AdminMainButton
        title={'로그아웃'}
        onPress={logout}
        disabled={false}
        buttonType={ButtonType.GRAY}
        height={50}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: WHITE,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default AdminMainScreen;
