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
    const response = await apiClient.post('/eta', data, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    console.error('API 요청 중 오류 발생:', error);
    throw error;
  }
};
