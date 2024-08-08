import { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Button } from 'react-native';
import SendInput from '../../components/SendInput';
import Pagename from '../../components/PageName';
import { WHITE, GRAY, SKYBLUE } from '../../constant/color';
import SockJS from 'sockjs-client';
import Stomp, { Client } from '@stomp/stompjs';

const ChatScreen = () => {
  const token = "eyJhbGciOiJIUzI1NiJ9.eyJyb2xlIjoiVVNFUiIsImlkIjoyNSwiZXhwIjoxNzIzMDA2ODI1LCJpYXQiOjE3MjMwMDMyMjV9.OWMpNh_0g9k7fBHa4Sf5ZxDNARn-oC63gMNXhx3EYjw";
  const messages = [
    {
      id: 1,
      writer: '쑤',
      text: '조금만 작게 말해주세요 ㅜ',
      time: '07:36 AM',
    },
    {
      id: 2,
      writer: '띵슈롱',
      text: '통로에 우산 치워주세요!',
      time: '07:41 AM',
      send: true,
    },
    {
      id: 3,
      writer: '조이',
      text: '의자 좀 당겨주세요. 좁아요 ..........',
      time: '07:59 AM',
    },
  ];
  const [connected, setConnected] = useState(false);
  const [stompClient, setStompClient] = useState(null);
  const roomId = 1;
  const connect = () => {
    const socket = new SockJS('http://localhost:8080/ws?token=' + token);
    const client = new Client({
      webSocketFactory: () => socket,
      debug : function(str) {
        console.log(str);
      },
      onConnect : (frame) => {
        console.log("Connect: " + frame);
        setConnected(true);
        client.subscribe('/room/' + roomId, (message) => {
          const receivedMessage = JSON.parse(message.body);
          console.log("receivedMessage: " + receivedMessage);
        });
      },
      onStompError: (frame) => {
        console.error('Broker reported error: ' + frame.headers['message']);
        console.error('Additional details: ' + frame.body);
      },
    });
    client.activate();
    setStompClient(client);
    console.log("Opening Web Socket...11");  // 디버그 메시지 추가
  }
  const disconnect = () => {
    if(stompClient !== null){
      stompClient.deactivate();
      setConnected(false);
      console.log('Disconnected');
    }
  }

  const sendMessage =()=> {
    if(stompClient !== null && connect){
      var message = {
        messages : "test message",
        sender : "지원"
      };
      stompClient.publish({
        destination: '/send-chat/' + roomId,
        body: JSON.stringify(message),
      });
      showMessage(message);
    }
  }
  const showMessage = (message) => {
    console.log(message);
  }
  useEffect(() => {
    return () => {
      if (stompClient !== null) {
        stompClient.deactivate();
      }
    };
  }, [stompClient]);

  return (
    <View style={styles.container}>
      {/* <Pagename title="< 채팅" /> */}
      <ScrollView style={styles.chatContainer}>
        {messages.map((message) => (
          <View
            key={message.id}
            style={[
              styles.messageBox,
              message.send && { flexDirection: 'row-reverse' },
            ]}
          >
            <View style={message.send ? styles.blueMessage : styles.message}>
              <Text style={styles.messageText}>{message.text}</Text>
            </View>
            <Text style={styles.messageTime}>{message.time}</Text>
          </View>
        ))}
      </ScrollView>
      <View style={styles.inputContainer}>
        <SendInput placeholder="메시지를 작성해주세요!" buttonText="전송" />
      </View>
      <Button title="Connect" onPress={connect} />
      <Button title="Send" onPress={sendMessage} />
      <Button title="DisConnect" onPress={disconnect} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: WHITE,
    paddingHorizontal: 20,
  },
  chatContainer: {
    height: '85%',
    padding: 15,
    borderRadius: 15,
    backgroundColor: GRAY.BACKGROUND,
  },
  message: {
    backgroundColor: WHITE,
    borderColor: GRAY.FONT,
    borderWidth: 1,
    padding: 13,
    borderRadius: 30,
    margin: 10,
    flexDirection: 'row',
  },
  blueMessage: {
    backgroundColor: SKYBLUE.FONT,
    padding: 13,
    borderRadius: 30,
    margin: 10,
    flexDirection: 'row',
  },
  messageText: {
    fontSize: 13,
  },
  messageTime: {
    fontSize: 12,
    color: '#555',
    textAlign: 'right',
  },
  inputContainer: {
    padding: 10,
    borderColor: '#ddd',
  },
  messageBox: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default ChatScreen;
