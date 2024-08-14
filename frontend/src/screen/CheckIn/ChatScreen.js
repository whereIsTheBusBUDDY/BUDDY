import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  StyleSheet,
} from 'react-native';
import { useWebSocket } from '../../context/WebSocketContext';
import apiClient from '../../api/api';
import { GRAY, SKYBLUE, WHITE } from '../../constant/color';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SendInput from '../../components/SendInput';

const ChatScreen = ({ route }) => {
  const { roomId } = route.params;
  const { connect, disconnect, sendMessage, messages, connected } =
    useWebSocket();
  const [text, setText] = useState('');
  const [username, setUsername] = useState('');
  const flatListRef = useRef(null);

  useEffect(() => {
    if (!connected) {
      connect(roomId);
      console.log(roomId);
    }

    return () => {
      disconnect();
    };
  }, [roomId]);

  useEffect(() => {
    const fetchNickname = async () => {
      try {
        const response = await apiClient.get('/members/me');
        const { nickname } = response.data;
        setUsername(nickname);
      } catch (error) {
        console.error('닉네임 가져오기 실패:', error);
      }
    };

    fetchNickname();
  }, []);

  const handleSend = () => {
    if (text.trim()) {
      sendMessage(roomId, text, username);
      setText('');
      // 전송 후 자동 스크롤
      if (flatListRef.current) {
        flatListRef.current.scrollToEnd({ animated: true });
      }
    }
  };

  const scrollToBottom = () => {
    if (flatListRef.current) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  };

  return (
    <View style={styles.topContainer}>
      <Text style={styles.roomText}>{roomId}호차</Text>
      <FlatList
        style={styles.listContainer}
        ref={flatListRef}
        data={messages}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => {
          const isUserMessage = item.sender === username;
          return (
            <View
              style={[
                styles.messageContainer,
                isUserMessage
                  ? styles.userMessageContainer
                  : styles.otherMessageContainer,
              ]}
            >
              <Text style={styles.senderText}>{item.sender}</Text>
              <View
                style={[
                  styles.messageBubble,
                  isUserMessage
                    ? styles.userMessageBubble
                    : styles.otherMessageBubble,
                ]}
              >
                <Text style={styles.messageText}>{item.message}</Text>
              </View>
            </View>
          );
        }}
        onLayout={scrollToBottom}
        onContentSizeChange={scrollToBottom}
      />
      <View style={styles.inputContainer}>
        <SendInput
          placeholder="메시지를 입력해주세요!"
          buttonText="전송"
          value={text}
          onChangeText={setText}
          onPress={handleSend}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  roomText: {
    textAlign: 'center',
    fontSize: 20,
    marginHorizontal: 20,
  },
  messageContainer: {
    marginVertical: 8,
    maxWidth: '70%',
  },
  userMessageContainer: {
    alignSelf: 'flex-end',
    alignItems: 'flex-end',
  },
  otherMessageContainer: {
    alignSelf: 'flex-start',
    alignItems: 'flex-start',
  },
  messageBubble: {
    padding: 10,
    borderRadius: 10,
  },
  userMessageBubble: {
    backgroundColor: SKYBLUE.BACKGROUND,
    borderRadius: 30,
  },
  otherMessageBubble: {
    backgroundColor: WHITE,
    borderWidth: 1,
    borderRadius: 30,
    borderColor: GRAY.BACKGROUND,
  },
  messageText: {
    fontSize: 16,
  },
  senderText: {
    marginHorizontal: 5,
    marginVertical: 3,
    fontSize: 12,
    color: '#555',
    marginTop: 2,
  },
  inputContainer: {
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderColor: '#ddd',
    paddingTop: 8,
  },
  input: {
    flex: 1,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 25,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginRight: 8,
  },
  listContainer: {
    backgroundColor: GRAY.BACKGROUND,
    flex: 1,
    borderRadius: 15,
    padding: 20,
    margin: 10,
  },
  topContainer: { backgroundColor: WHITE, flex: 1, padding: 16, padding: 5 },
});

export default ChatScreen;
