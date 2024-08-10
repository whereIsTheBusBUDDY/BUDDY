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
import { SKYBLUE } from '../../constant/color';

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
      flatListRef.current.scrollToEnd({ animated: false });
    }
  };

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <FlatList
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
              <Text style={styles.senderText}>{item.sender}</Text>
            </View>
          );
        }}
        onLayout={scrollToBottom} // 처음 렌더링 시 맨 아래로 스크롤
        onContentSizeChange={scrollToBottom} // 내용이 변경될 때 맨 아래로 스크롤
      />
      <View style={styles.inputContainer}>
        <TextInput
          value={text}
          onChangeText={setText}
          placeholder="Type a message"
          style={styles.input}
        />
        <Button title="Send" onPress={handleSend} disabled={!connected} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
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
    backgroundColor: SKYBLUE.FONT,
  },
  otherMessageBubble: {
    backgroundColor: '#E5E5EA',
  },
  messageText: {
    fontSize: 16,
  },
  senderText: {
    fontSize: 12,
    color: '#555',
    marginTop: 2,
  },
  inputContainer: {
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
});

export default ChatScreen;
