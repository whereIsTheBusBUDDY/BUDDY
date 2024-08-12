import React, { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View, Alert } from 'react-native'; // Alert를 추가로 import
import { useUserContext } from '../../context/UserContext';
import { useAdminContext } from '../../context/AdminContext';
import AdminMainButton from '../../components/admin/AdminMainButton';
import { PRIMARY, WHITE } from '../../constant/color';
import { ButtonType } from '../../components/AdminSelectButton';
import * as Notifications from 'expo-notifications';
import { boardingCount } from '../../api/busAdmin';
import { useNavigation } from '@react-navigation/native';
import StartTrackingButton from '../../components/admin/StartTrackingButton';
import PeopleCountButton from '../../components/admin/PeopleCountButton';
import AsyncStorage from '@react-native-async-storage/async-storage';
import EventSource from 'react-native-event-source';
import * as Speech from 'expo-speech'; // Speech 모듈을 추가로 import

const AdminMainScreen = () => {
  const { loginUser, setLoginUser } = useUserContext();
  const [boardingNumber, setBoardingNumber] = useState(null);
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

  const [connectMessage, setConnectMessage] = useState('');
  const [noticeMessage, setNoticeMessage] = useState('');
  const [suggestMessage, setSuggestMessage] = useState('');
  const [arriveMessage, setArriveMessage] = useState('');

  // API 호출 및 데이터 로딩
  useEffect(() => {
    const fetchBoardingCount = async () => {
      try {
        const result = await boardingCount(busNumber);
        setBoardingNumber(result);
        console.log(result);
      } catch (error) {
        console.error('탑승인원 불러오기 실패', error);
      }
    };
    fetchBoardingCount();
  }, [busNumber]);

  useEffect(() => {
    requestNotificationPermissions(); // 알림 권한 요청
    initializeSSE();
  }, []);

  const requestNotificationPermissions = async () => {
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('알림 권한이 거부되었습니다!');
    }
  };

  const initializeSSE = async () => {
    try {
      const token = await AsyncStorage.getItem('accessToken');
      if (!token) {
        console.error('No token found in AsyncStorage');
        return;
      }

      console.log('Access Token:', token);

      const sseUrl = 'http://i11b109.p.ssafy.io:8080/subscribe';

      const headers = {
        Authorization: `Bearer ${token}`,
      };

      const eventSource = new EventSource(sseUrl, {
        headers: headers,
      });

      eventSource.onopen = () => {
        console.log('SSE connection opened');
      };

      // 서버에서 CONNECT, NOTICE, SUGGEST, ARRIVE 이벤트 수신
      eventSource.addEventListener('CONNECT', (e) => {
        console.log('admin CONNECT event: ', e.data);
        setConnectMessage((prev) => prev + e.data);
      });

      eventSource.addEventListener('NOTICE', (e) => {
        console.log('NOTICE event: ', e.data);
        setNoticeMessage((prev) => prev + e.data);
      });

      eventSource.addEventListener('SUGGEST', (e) => {
        console.log('SUGGEST event: ', e.data);
        setSuggestMessage((prev) => prev + e.data);
        const notificationText = `"${e.data}" 건의사항이 도착했습니다.`;
        sendNotification('BUDDY', notificationText);

        // TTS를 사용하여 알림 내용 읽기
        Speech.speak(notificationText, {
          language: 'ko', // 한국어로 설정
          pitch: 1.0,
          rate: 1.0,
        });
      });

      eventSource.onerror = (e) => {
        console.error('SSE error: ', e);
      };

      return () => {
        eventSource.close();
        console.log('SSE connection closed');
      };
    } catch (error) {
      console.error('Failed to initialize SSE:', error);
    }
  };

  // 알림 핸들러 설정
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
    }),
  });

  // 알림 전송
  const sendNotification = async (title, content) => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: title,
        body: content,
      },
      trigger: null,
    });
  };

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
        value={boardingNumber}
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
  sseContainer: {
    marginTop: 20,
  },
  message: {
    marginTop: 5,
    color: '#333',
  },
});

export default AdminMainScreen;
