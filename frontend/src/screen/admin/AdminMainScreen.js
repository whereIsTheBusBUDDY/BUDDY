import React, { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
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
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage
import EventSource from 'react-native-event-source'; // Import EventSource
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage
import EventSource from 'react-native-event-source'; // Import EventSource

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

  const [connectMessage, setConnectMessage] = useState('');
  const [noticeMessage, setNoticeMessage] = useState('');
  const [suggestMessage, setSuggestMessage] = useState('');
  const [arriveMessage, setArriveMessage] = useState('');

  // API 호출 및 데이터 로딩
  useEffect(() => {
    requestNotificationPermissions(); // Request notification permissions
    sendNotification();

    const initializeSSE = async () => {
      try {
        // AsyncStorage에서 토큰 가져오기
        const token = await AsyncStorage.getItem('accessToken');
        if (!token) {
          console.error('No token found in AsyncStorage');
          return;
        }

        console.log('Access Token:', token); // 토큰 확인 로그

        // SSE 서버 연결 설정
        const sseUrl = 'http://i11b109.p.ssafy.io:8080/subscribe'; // 실제 서버 주소 사용

        const headers = {
          Authorization: `Bearer ${token}`, // AsyncStorage에서 가져온 토큰 사용
        };

        // EventSource 생성
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
          sendNotification('BUDDY', `"${e.data}" 건의사항이 도착했습니다.`);
        });

        eventSource.onerror = (e) => {
          console.error('SSE error: ', e);
        };

        // 컴포넌트가 언마운트될 때 SSE 연결 해제
        return () => {
          eventSource.close();
          console.log('SSE connection closed');
        };
      } catch (error) {
        console.error('Failed to initialize SSE:', error);
      }
    };

    fetchBoardingCount(); // useEffect 내에서 API 호출
  }, [busNumber]); // busNumber가 변경될 때마다 호출

  useEffect(() => {
    requestNotificationPermissions(); // Request notification permissions
    sendNotification();

    const initializeSSE = async () => {
      try {
        // AsyncStorage에서 토큰 가져오기
        const token = await AsyncStorage.getItem('accessToken');
        if (!token) {
          console.error('No token found in AsyncStorage');
          return;
        }

        console.log('Access Token:', token); // 토큰 확인 로그

        // SSE 서버 연결 설정
        const sseUrl = 'http://i11b109.p.ssafy.io:8080/subscribe'; // 실제 서버 주소 사용

        const headers = {
          Authorization: `Bearer ${token}`, // AsyncStorage에서 가져온 토큰 사용
        };

        // EventSource 생성
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
          sendNotification('BUDDY', `"${e.data}" 건의사항이 도착했습니다.`);
        });

        eventSource.onerror = (e) => {
          console.error('SSE error: ', e);
        };

        // 컴포넌트가 언마운트될 때 SSE 연결 해제
        return () => {
          eventSource.close();
          console.log('SSE connection closed');
        };
      } catch (error) {
        console.error('Failed to initialize SSE:', error);
      }
    };

    initializeSSE(); // Initialize SSE when the component mounts
  }, []); // 빈 배열을 사용하여 컴포넌트가 마운트될 때 한 번만 실행

  const requestNotificationPermissions = async () => {
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('알림 권한이 거부되었습니다!');
    }
  };

  // Set up notification handler
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
    }),
  });

  // ✅ 알림 전송
  const sendNotification = async (title, content) => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: title,
        body: content,
      },
      trigger: null, // 즉시 보내려면 'trigger'에 'null'을 설정
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

      {/* SSE 이벤트 상태 표시 */}
      <View style={styles.sseContainer}>
        <Text style={styles.message}>Connect: {connectMessage}</Text>
        <Text style={styles.message}>Notice: {noticeMessage}</Text>
        <Text style={styles.message}>Suggest: {suggestMessage}</Text>
        <Text style={styles.message}>Arrive: {arriveMessage}</Text>
      </View>

      {/* SSE 이벤트 상태 표시 */}
      <View style={styles.sseContainer}>
        <Text style={styles.message}>Connect: {connectMessage}</Text>
        <Text style={styles.message}>Notice: {noticeMessage}</Text>
        <Text style={styles.message}>Suggest: {suggestMessage}</Text>
        <Text style={styles.message}>Arrive: {arriveMessage}</Text>
      </View>
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
  sseContainer: {
    marginTop: 20,
  },
  message: {
    marginTop: 5,
    color: '#333',
  },
});

export default AdminMainScreen;
