import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useUserContext } from '../../context/UserContext';
import { useAdminContext } from '../../context/AdminContext';
import AdminMainButton from '../../components/admin/AdminMainButton';
import { PRIMARY } from '../../constant/color';
import { ButtonType } from '../../components/AdminSelectButton';
import * as Location from 'expo-location';
import { useNavigation } from '@react-navigation/native';
import StartTrackingButton from '../../components/admin/StartTrackingButton';
import PeopleCountButton from '../../components/admin/PeopleCountButton';

const AdminMainScreen = () => {
  const { setUser, setLoginUser } = useUserContext();
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
  const logout = () => {
    handleStopTracking();
    setLoginUser(null);
  };
  const stopBus = () => {
    setIsTracking(false);
    if (!isTracking) {
      handleStopTracking();
    }
  };
  const startBus = () => {
    setIsTracking(true);
    if (isTracking) {
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
        onPress={isTracking ? stopBus : startBus}
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
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default AdminMainScreen;
