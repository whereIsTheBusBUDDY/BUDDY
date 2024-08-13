import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GRAY, PRIMARY, WHITE } from '../../constant/color';

const AdminSuggestScreen = () => {
  const [notifications, setNotifications] = useState([]); // 빈 배열로 초기화

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const accessToken = await AsyncStorage.getItem('accessToken'); // 액세스 토큰 가져오기

        if (!accessToken) {
          console.error('액세스 토큰이 없습니다.');
          return;
        }

        const response = await fetch(
          'http://i11b109.p.ssafy.io:8080/notifications',
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${accessToken}`, // Bearer 토큰 추가
            },
          }
        );

        if (!response.ok) {
          throw new Error('네트워크 응답이 올바르지 않습니다.');
        }

        const data = await response.json();
        console.log(data);

        if (Array.isArray(data)) {
          // 'SUGGEST' 타입의 알림만 필터링하여 상태를 업데이트
          const suggestNotifications = data.filter(
            (item) => item.type === 'SUGGEST'
          );
          setNotifications(suggestNotifications);
          console.log('SUGGEST 타입 알림:', suggestNotifications);
        } else {
          console.error('데이터 형식이 올바르지 않습니다.', data);
        }
      } catch (error) {
        console.error('알림을 가져오는 중 오류 발생:', error);
      }
    };

    fetchNotifications();
  }, []);

  return (
    <ScrollView style={styles.container}>
      {notifications.map((item) => (
        <TouchableOpacity
          key={item.boardId}
          style={[
            styles.notificationItem,
            item.important && styles.importantNotification,
          ]}
        >
          <Text style={styles.message}>
            {item.senderName}님이{' '}
            <Text style={styles.highlight}>"{item.suggestion}"</Text>를
            건의하였습니다.
          </Text>
          <Text style={styles.timestamp}>{item.timestamp}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: WHITE,
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  notificationItem: {
    backgroundColor: GRAY.BACKGROUND,
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  importantNotification: {
    backgroundColor: PRIMARY.BACKGROUND,
  },
  message: {
    fontSize: 16,
    marginBottom: 15,
  },
  date: {
    fontSize: 12,
    color: GRAY.FONT,
  },
  highlight: {
    color: PRIMARY.DEFAULT,
  },
  timestamp: {
    color: GRAY.FONT,
    fontSize: 13,
  },
});

export default AdminSuggestScreen;
