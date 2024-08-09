// SSEComponent.js

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import EventSource from 'react-native-event-source';

const SSEComponent = () => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    // SSE 연결 설정
    const eventSource = new EventSource(
      'http://i11b109.p.ssafy.io:8080/subscribe'
    );

    // 서버로부터 메시지를 받을 때마다 실행되는 콜백 함수
    eventSource.onmessage = (event) => {
      setMessages((prevMessages) => [...prevMessages, event.data]);
      console.log('sse test', event);
    };

    // 오류 발생 시 실행되는 콜백 함수
    eventSource.onerror = (error) => {
      console.error('SSE 오류:', error);
    };

    // 컴포넌트가 언마운트될 때 EventSource 연결 해제
    return () => {
      eventSource.close();
    };
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView style={styles.messagesContainer}>
        {messages.map((message, index) => (
          <Text key={index} style={styles.message}>
            {message}
          </Text>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  //   container: {
  // flex: 1,
  // justifyContent: 'center',
  // alignItems: 'center',
  // padding: 20,
  // backgroundColor: '#f2f2f2',
  //   },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  messagesContainer: {
    flex: 3,
    width: '100%',
  },
  message: {
    fontSize: 16,
    marginBottom: 10,
  },
});

export default SSEComponent;
