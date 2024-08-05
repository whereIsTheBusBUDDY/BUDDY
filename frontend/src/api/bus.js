import axios from 'axios';
import apiClient from './api';
// import { busData } from '../data/busData';

// export const sendBusData = async () => {
//   try {
//     const response = await axios.post(
//       'http://i11b109.p.ssafy.io:8080/eta',
//       busData
//     );
//     console.log('Data successfully sent:', response.data);
//   } catch (error) {
//     console.error('Error sending data:', error);
//   }
// };

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
    // apiClient 인스턴스를 사용하여 인증 토큰 포함된 요청을 서버로 보냄
    const response = await apiClient.get(`stations/${busId}`);
    return response.data;
  } catch (error) {
    console.error('버스 정류장 데이터 가져오기 실패:', error);
  }
};

// 정류장 방문 표시
export const busVisited = async (stationId, visited) => {
  try {
    const response = await axios.put(
      `http://localhost:8080/stations/${stationId}?visited=${visited}`
    );
    console.log('정류장 방문 상태 업데이트:', response.data);
    return response.data;
  } catch (error) {
    console.error('정류장 방문 상태 업데이트 실패:', error);
    throw error; // 오류를 던지면 호출하는 쪽에서 catch로 잡을 수 있습니다.
  }
};
