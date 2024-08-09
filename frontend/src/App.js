// App.js

import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Text } from 'react-native';
import Navigation from './navigations';
import { NavigationContainer } from '@react-navigation/native';
import FirstProvider from './context/FirstContent';
import { UserProvider } from './context/UserContext';
import { AdminProvider } from './context/AdminContext';
import { useEffect, useState } from 'react';
import EventSource from 'react-native-event-source';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function App() {
  return (
    <FirstProvider>
      <UserProvider>
        <AdminProvider>
          <NavigationContainer style={styles.container}>
            <StatusBar style="auto" />
            <SSEComponent />
            <Navigation />
          </NavigationContainer>
        </AdminProvider>
      </UserProvider>
    </FirstProvider>
  );
}

const SSEComponent = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchAccessTokenAndConnect = async () => {
      try {
        // AsyncStorage에서 accessToken 가져오기
        const accessToken = await AsyncStorage.getItem('accessToken');
        if (!accessToken) {
          console.error('Access token not found');
          return;
        }

        const sseUrl = 'http://i11b109.p.ssafy.io:8080/subscribe';

        const headers = {
          Authorization: `Bearer ${accessToken}`,
        };

        // EventSource 생성하여 알림을 수신
        const eventSource = new EventSource(sseUrl, {
          headers: headers,
        });

        eventSource.addEventListener('NOTIFICATION', (e) => {
          console.log('New notification event: ', e);
          setNotifications((prev) => [...prev, e.data]); // 새로운 알림 추가
        });

        // 컴포넌트가 언마운트될 때 연결 해제
        return () => {
          eventSource.close();
        };
      } catch (error) {
        console.error('Failed to connect to SSE:', error);
      }
    };

    fetchAccessTokenAndConnect();
  }, []);

  return (
    <View style={styles.sseContainer}>
      <Text style={styles.title}>알림 목록</Text>
      {notifications.map((notification, index) => (
        <Text key={index}>{notification}</Text>
      ))}
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
  sseContainer: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});
