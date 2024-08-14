import * as TaskManager from 'expo-task-manager';
import * as BackgroundFetch from 'expo-background-fetch';
import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASEurl } from '../api/url';
import apiClient from '../api/api';
import * as Speech from 'expo-speech';

const BACKGROUND_FETCH_TASK = 'background-fetch-task';
const POLLING_TASK_NAME = 'background-polling-task';

// 백그라운드에서 알림을 처리하는 핸들러 설정
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

// 푸쉬알림을 보내는 함수
const sendNotification = async (title, content) => {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: title,
      body: content,
    },
    trigger: null, // 즉시 발송
  });
};

// SSE를 초기화하는 함수
const initializeSSE = async () => {
  try {
    const token = await AsyncStorage.getItem('accessToken');
    if (!token) {
      console.error('No token found in AsyncStorage');
      return;
    }

    const sseUrl = `${BASEurl}/subscribe`;
    const headers = {
      Authorization: `Bearer ${token}`,
    };

    const eventSource = new EventSource(sseUrl, {
      headers: headers,
    });

    eventSource.onopen = () => {
      console.log('SSE connection opened');
    };

    eventSource.addEventListener('CONNECT', (e) => {
      console.log('client CONNECT event: ', e.data);
    });

    eventSource.addEventListener('NOTICE', (e) => {
      console.log('NOTICE event: ', e.data);
      sendNotification('BUDDY', '📌 공지사항이 등록되었습니다.');
    });

    eventSource.addEventListener('ARRIVE', (e) => {
      console.log('ARRIVE event: ', e.data);
      const notificationText = `🚌 버스가 곧 즐겨찾기 정류장에 도착합니다.\n현재위치 : ${e.data}`;
      sendNotification('BUDDY', notificationText);

      // TTS를 사용하여 알림 내용 읽기
      Speech.speak(notificationText, {
        language: 'ko', // 한국어로 설정
        pitch: 1.0,
        rate: 1.0,
      });
    });

    eventSource.onerror = (e) => {
      console.error('SSE error: ', e);
    };

    return () => {
      eventSource.close();
      console.log('SSE connection closed');
    };
  } catch (error) {
    console.error('Failed to initialize SSE:', error);
  }
};

// 백그라운드 작업 정의
TaskManager.defineTask(BACKGROUND_FETCH_TASK, async () => {
  try {
    console.log('백그라운드 작업 시작');

    // API 요청을 수행
    const response = await apiClient.get('/members/me');
    console.log('백그라운드에서 사용자 정보:', response.data);

    // SSE를 백그라운드에서도 실행
    await initializeSSE();

    return BackgroundFetch.BackgroundFetchResult.NewData;
  } catch (error) {
    console.error('백그라운드 작업 중 오류 발생:', error);
    return BackgroundFetch.BackgroundFetchResult.Failed;
  }
});

// 백그라운드에서 폴링 작업 정의
TaskManager.defineTask(POLLING_TASK_NAME, async () => {
  try {
    const response = await fetch('https://your-server.com/api/notifications');
    const data = await response.json();

    // 폴링된 데이터를 처리하거나 알림 트리거
    console.log('폴링된 데이터:', data);

    // 필요한 경우 sendNotification 함수를 호출하여 푸쉬알림 발송
    if (data.length > 0) {
      data.forEach((item) => {
        sendNotification('새 알림', item.message);
      });
    }

    return BackgroundFetch.BackgroundFetchResult.NewData;
  } catch (error) {
    console.error('Background fetch failed:', error);
    return BackgroundFetch.BackgroundFetchResult.Failed;
  }
});

// 백그라운드 폴링 작업 등록 함수
export async function registerPollingTask() {
  return BackgroundFetch.registerTaskAsync(POLLING_TASK_NAME, {
    minimumInterval: 60, // 최소 실행 간격 (초)
    stopOnTerminate: false, // 앱이 종료되어도 계속 실행
    startOnBoot: true, // 장치가 부팅될 때 시작
  });
}

// 백그라운드 Fetch 작업 등록 함수
export async function registerBackgroundFetch() {
  return BackgroundFetch.registerTaskAsync(BACKGROUND_FETCH_TASK, {
    minimumInterval: 15 * 60, // 최소 15분 간격
    stopOnTerminate: false, // 앱이 종료되어도 계속 실행
    startOnBoot: true, // 장치가 부팅될 때 시작
  });
}
