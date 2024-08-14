import apiClient from './api';

// 현재 버스 실시간 위치 전송 (운행시작)
export const sendBusLocation = async (busId, latitude, longitude) => {
  try {
    const response = await apiClient.post(`start/${busId}`, {
      latitude,
      longitude,
    });
    console.log('운행 데이터 전송 성공:', response.data);
    return response.data;
  } catch (error) {
    console.error('운행 데이터 전송 실패:', error);
  }
};

// 버스 운행 종료
export const sendStop = async (busId) => {
  try {
    // 딜레이 추가
    await new Promise((resolve) => setTimeout(resolve, 12000));

    const response = await apiClient.get(`stop/${busId}`);
    console.log('운행 종료 데이터 전송 성공:', response.data);
    return response.data;
  } catch (error) {
    console.error('운행 종료 데이터 전송 실패:', error);
  }
};

// 버스 정류장 데이터를 가져오기
export const getBusStations = async (busId) => {
  try {
    const response = await apiClient.get(`stations/${busId}`);
    return response.data;
  } catch (error) {
    console.error('버스 정류장 데이터 가져오기 실패:', error);
  }
};

// 정류장 방문 표시
export const busVisited = async (stationId, visited) => {
  try {
    const response = await apiClient.put(
      `/stations/${stationId}?visited=${visited}`
    );
    console.log('정류장 방문 상태 업데이트:', response.data);
    return response;
  } catch (error) {
    console.error('정류장 방문 상태 업데이트 실패:', error);
    throw error;
  }
};

// 즐겨찾기 전 정류장 알림
export const sendAlarm = async (stationId, time) => {
  console.log('sendAlarm', stationId, time);
  try {
    const response = await apiClient.post(
      `/arrive?stationId=${stationId}&time=${time}`
    );
    console.log('즐겨찾기 전 정류장 알림', response.data);
    return response;
  } catch (error) {
    console.error('즐겨찾기 정류장 알림 전송 실패', error);
    throw error;
  }
};

// 탑승인원 불러오기
export const boardingCount = async (busId) => {
  try {
    const response = await apiClient.get(`/boarding/count?busId=${busId}`);
    return response.data;
  } catch (error) {
    console.error('탑승인원 불러오기 실패', error);
  }
};

// eta log 보내기
export const postEtaLog = async (busLine, stationId) => {
  try {
    const response = await apiClient.post('/eta/log', {
      busLine,
      stationId,
    });
    console.log('eta log 보내기 성공', busLine, stationId);
    return response;
  } catch (error) {
    console.error('eta log 보내기 실패', error);
  }
};
