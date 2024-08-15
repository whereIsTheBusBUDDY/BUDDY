import React, { createContext, useContext, useState, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import 'text-encoding';

const WebSocketContext = createContext();

export const WebSocketProvider = ({ children }) => {
  const stompClient = useRef(null);
  const [connected, setConnected] = useState(false);
  const [messages, setMessages] = useState([]);

  const connect = async (roomId) => {
    try {
      const token = await AsyncStorage.getItem('accessToken');
      if (!token) {
        throw new Error('Access token not found');
      }

      const socket = new SockJS(
        `http://i11b109.p.ssafy.io:8080/ws?token=${token}`
      );
      const client = new Client({
        webSocketFactory: () => socket,
        connectHeaders: {},
        debug: (str) => {
          console.log(str);
        },
        onConnect: (frame) => {
          console.log('Connected: ' + frame);
          setConnected(true);
          client.subscribe(`/room/${roomId}`, (message) => {
            showMessage(JSON.parse(message.body));
          });
        },
        onDisconnect: () => {
          setConnected(false);
          console.log('Disconnected');
        },
        onStompError: (error) => {
          console.error('STOMP error', error);
        },
        reconnectDelay: 5000, // Optional: Reconnect delay in ms
      });

      stompClient.current = client;
      client.activate(); // Activate the client
    } catch (error) {
      console.error('Error during WebSocket connection:', error);
    }
  };

  const disconnect = () => {
    if (stompClient.current) {
      stompClient.current.deactivate();
      setConnected(false);
      console.log('Disconnected');
    }
  };

  const sendMessage = (roomId, message, sender, userId) => {
    if (stompClient.current && connected) {
      const messageObj = { message, sender, userId };
      stompClient.current.publish({
        destination: `/send-chat/${roomId}`,
        body: JSON.stringify(messageObj),
      });
      console.log('Message sent:', messageObj);
    }
  };

  const showMessage = (message) => {
    console.log(message);
    setMessages((prevMessages) => [...prevMessages, message]);
  };

  return (
    <WebSocketContext.Provider
      value={{
        connect,
        disconnect,
        sendMessage,
        showMessage,
        connected,
        messages,
      }}
    >
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => {
  return useContext(WebSocketContext);
};
