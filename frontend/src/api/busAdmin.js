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
    return response.data;
  } catch (error) {
    console.error('정류장 방문 상태 업데이트 실패:', error);
    throw error;
  }
};
