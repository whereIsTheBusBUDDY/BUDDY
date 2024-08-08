// import React from 'react';
// import { View, Text, StyleSheet, ScrollView } from 'react-native';
// import { GRAY, PRIMARY, WHITE } from '../../constant/color';

// const notifications = [
//   {
//     id: '1',
//     message: '공지사항에 글이 등록되었습니다.',
//     date: '2024.07.10 07:03',
//     important: true,
//   },
//   {
//     id: '2',
//     message: '조이님이 채팅방에 메시지를 작성하였습니다.',
//     date: '2024.07.09 08:03',
//     important: false,
//   },
//   {
//     id: '3',
//     message: '버스가 곧 정류장에 도착합니다.',
//     date: '2024.07.09 18:20',
//     important: false,
//   },
// ];

// const NotificationScreen = () => {
//   return (
//     <ScrollView style={styles.container}>
//       {notifications.map((item) => (
//         <View
//           key={item.id}
//           style={[
//             styles.notificationItem,
//             item.important && styles.importantNotification,
//           ]}
//         >
//           <Text style={styles.message}>{item.message}</Text>
//           <Text style={styles.date}>{item.date}</Text>
//         </View>
//       ))}
//     </ScrollView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: WHITE,
//     paddingHorizontal: 20,
//   },
//   notificationItem: {
//     backgroundColor: GRAY.BACKGROUND,
//     padding: 16,
//     borderRadius: 8,
//     marginBottom: 8,
//   },
//   importantNotification: {
//     backgroundColor: PRIMARY.BACKGROUND,
//   },
//   message: {
//     fontSize: 16,
//     marginBottom: 8,
//   },
//   date: {
//     fontSize: 12,
//     color: GRAY.FONT,
//   },
// });

// export default NotificationScreen;
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GRAY, PRIMARY, WHITE } from '../../constant/color';
import apiClient from '../../api/api';

const NotificationScreen = () => {
  const [notifications, setNotifications] = useState([]); // 빈 배열로 초기화
  const navigation = useNavigation(); // 네비게이션 객체 가져오기

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
          setNotifications(data); // 데이터가 배열일 경우에만 상태를 업데이트
        } else {
          console.error('데이터 형식이 올바르지 않습니다.', data);
        }
      } catch (error) {
        console.error('알림을 가져오는 중 오류 발생:', error);
      }
    };

    fetchNotifications();
  }, []);

  const handleNotificationPress = async (boardId) => {
    try {
      const response = await apiClient.get(`/board/${boardId}`);
      navigation.navigate('Detail', { board: response.data });
    } catch (error) {
      console.error('게시글 상세조회 실패:', error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      {notifications.map((item) => (
        <TouchableOpacity
          key={item.id}
          style={[
            styles.notificationItem,
            item.important && styles.importantNotification,
          ]}
          onPress={() => {
            if (item.type === 'NOTICE') {
              handleNotificationPress(item.boardId);
            }
          }}
        >
          {item.type === 'NOTICE' && (
            <Text style={styles.message}>공지사항에 글이 등록되었습니다.</Text>
          )}
          {item.type === 'SUGGEST' && (
            <Text style={styles.message}>
              {item.senderName}님이 채팅방에 {item.suggestion}를 작성하였습니다.
            </Text>
          )}
          {item.type === 'ARRIVE' && (
            <Text style={styles.message}>버스가 곧 정류장에 도착합니다.</Text>
          )}

          <Text style={styles.date}>{item.date}</Text>
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
    marginBottom: 8,
  },
  date: {
    fontSize: 12,
    color: GRAY.FONT,
  },
});

export default NotificationScreen;
