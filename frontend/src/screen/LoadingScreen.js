import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { useState } from 'react';
import { Image, StyleSheet, View, TouchableOpacity } from 'react-native';
import apiClient from '../api/api';
import { useFirstContext } from '../context/FirstContent';
import { useUserContext } from '../context/UserContext';

const LoadingPage = () => {
  const navigate = useNavigation();
  const [isLogined, setIsLogined] = useState(null);
  const { screen, setScreen } = useFirstContext();
  const { setUser, setLoginUser } = useUserContext();
  setTimeout(() => {
    logined();
  }, 3000);
  const logined = async () => {
    try {
      const token = await AsyncStorage.getItem('accessToken');
      if (token) {
        // 토큰이 존재시
        const response = await apiClient.get('/members/me');
        const loginData = response.data;
        setLoginUser(loginData);
        setScreen(false);
        if (loginData.role == 'ADMIN') {
          navigate.navigate('AdminStack');
        } else {
          navigate.navigate('MainStack');
        }
      } else {
        // 토큰이 없으면 로그인 페이지로 이동
        navigate.navigate('introduce');
      }
    } catch (error) {
      console.error('Error checking login status', error);
      // 오류가 발생하면 로그인 페이지로 이동
      navigate.navigate('introduce');
    }
  };
  return (
    <View style={styles.container}>
      <View style={styles.centerImageContainer}>
        <Image
          source={require('../../assets/file.png')}
          resizeMode="cover"
          style={styles.image}
        />
        <Image source={require('../../assets/busLogo.png')} />
      </View>
      <View style={styles.bottomImageContainer}>
        <Image source={require('../../assets/BUDDY.png')} />
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerImageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomImageContainer: {
    position: 'absolute',
    bottom: 50, // 하단 여백 조절
    width: '100%',
    alignItems: 'center',
  },
  image: {
    width: 200,
    height: 25,
  },
});
export default LoadingPage;
