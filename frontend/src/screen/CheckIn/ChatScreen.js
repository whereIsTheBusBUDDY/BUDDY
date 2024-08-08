import React, { useEffect, useState } from 'react';
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

const ChatScreen = ({ route }) => {
  const { roomId } = route.params;
  const { connect, sendMessage, messages } = useWebSocket();
  const [text, setText] = useState('');
  const [username, setUsername] = useState('');
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!isConnected) {
      connect(roomId);
      setIsConnected(true);
    }
  }, []);

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
    }
  };

  const renderMessage = ({ item }) => {
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
  };

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <FlatList
        data={messages}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderMessage}
      />
      <View style={styles.inputContainer}>
        <TextInput
          value={text}
          onChangeText={setText}
          placeholder="Type a message"
          style={styles.input}
        />
        <Button title="Send" onPress={handleSend} disabled={!isConnected} />
      </View>
      <Button title="Connect" onPress={connect} />
      <Button title="Send" onPress={sendMessage} />
      <Button title="DisConnect" onPress={disconnect} />
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
    backgroundColor: '#DCF8C6',
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
