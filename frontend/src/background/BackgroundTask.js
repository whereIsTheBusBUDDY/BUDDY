import * as TaskManager from 'expo-task-manager';
import * as BackgroundFetch from 'expo-background-fetch';
import apiClient from '../api/api';

const BACKGROUND_FETCH_TASK = 'background-fetch-task';

TaskManager.defineTask(BACKGROUND_FETCH_TASK, async () => {
  try {
    // 여기에 백그라운드에서 실행할 작업을 정의합니다.
    console.log('백그라운드 작업 시작');

    // 예를 들어, API 요청을 수행
    const response = await apiClient.get('/members/me');
    console.log('백그라운드에서 사용자 정보:', response.data);

    return BackgroundFetch.BackgroundFetchResult.NewData;
  } catch (error) {
    console.error('백그라운드 작업 중 오류 발생:', error);
    return BackgroundFetch.BackgroundFetchResult.Failed;
  }
});

const POLLING_TASK_NAME = 'background-polling-task';

TaskManager.defineTask(POLLING_TASK_NAME, async () => {
  try {
    const response = await fetch('https://your-server.com/api/notifications');
    const data = await response.json();

    // 폴링된 데이터를 처리하거나 알림 트리거
    console.log('폴링된 데이터:', data);

    return BackgroundFetch.BackgroundFetchResult.NewData;
  } catch (error) {
    console.error('Background fetch failed:', error);
    return BackgroundFetch.BackgroundFetchResult.Failed;
  }
});

export async function registerPollingTask() {
  return BackgroundFetch.registerTaskAsync(POLLING_TASK_NAME, {
    minimumInterval: 60, // 최소 실행 간격 (초)
    stopOnTerminate: false, // 앱이 종료되어도 계속 실행
    startOnBoot: true, // 장치가 부팅될 때 시작
  });
}

export async function registerBackgroundFetch() {
  return BackgroundFetch.registerTaskAsync(BACKGROUND_FETCH_TASK, {
    minimumInterval: 1 * 60, // 최소 15분 간격
    stopOnTerminate: false, // 앱이 종료되어도 계속 실행
    startOnBoot: true, // 장치가 부팅될 때 시작
  });
}
