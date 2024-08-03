import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { GRAY, PRIMARY, WHITE } from '../../constant/color';

const notifications = [
  {
    id: '1',
    message: '공지사항에 글이 등록되었습니다.',
    date: '2024.07.10 07:03',
    important: true,
  },
  {
    id: '2',
    message: '조이님이 채팅방에 메시지를 작성하였습니다.',
    date: '2024.07.09 08:03',
    important: false,
  },
  {
    id: '3',
    message: '버스가 곧 정류장에 도착합니다.',
    date: '2024.07.09 18:20',
    important: false,
  },
];

const NotificationScreen = () => {
  return (
    <ScrollView style={styles.container}>
      {notifications.map((item) => (
        <View
          key={item.id}
          style={[
            styles.notificationItem,
            item.important && styles.importantNotification,
          ]}
        >
          <Text style={styles.message}>{item.message}</Text>
          <Text style={styles.date}>{item.date}</Text>
        </View>
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
