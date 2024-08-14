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
import { WebSocketProvider } from './context/WebSocketContext';
import { NotificationProvider } from './context/NotificationContext';
import { registerBackgroundFetch } from './background/BackgroundTask';

export default function App() {
  useEffect(() => {
    registerBackgroundFetch()
      .then(() => {
        console.log('백그라운드 작업이 등록됨');
      })
      .catch(() => {
        console.error('백그라운드 작업 등록 중 오류 발생:', err);
      });
  }, []);
  return (
    <NotificationProvider>
      <WebSocketProvider>
        <FirstProvider>
          <UserProvider>
            <AdminProvider>
              <NavigationContainer style={styles.container}>
                <StatusBar style="auto" />
                <Navigation />
              </NavigationContainer>
            </AdminProvider>
          </UserProvider>
        </FirstProvider>
      </WebSocketProvider>
    </NotificationProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
