import apiClient from './api';

// 현재 버스 위치 받아오기
export const currentBus = async (busId) => {
  try {
    const response = await apiClient.get(`location/${busId}`);
    console.log('현재 버스 위치', response.data);
    return response.data;
  } catch (error) {
    console.error('현재 버스 위치', error);
  }
};

// eta 정보 전달
export const postBusData = async (data) => {
  try {
    console.log('data', data);
    const response = await apiClient.post('/eta/api', data, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    console.log('eta 정보 전송', response.data);
    return response.data;
  } catch (error) {
    console.error('eta API 요청 중 오류 발생:', error);
    throw error;
  }
};
