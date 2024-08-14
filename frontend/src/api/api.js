import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASEurl } from './url';

const apiClient = axios.create({
  baseURL: BASEurl,
  timeout: 10000,
});

apiClient.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response &&
      (error.response.status === 401 || error.response.data.code === '4000')
    ) {
      console.log('액세스 토큰 만료:', error.response.data.message);

      if (!originalRequest._retry) {
        originalRequest._retry = true;

        try {
          const refreshToken = await AsyncStorage.getItem('refreshToken');
          console.log('리프레시 토큰 있음');
          if (refreshToken) {
            console.log('요청 보낼게');
            const response = await apiClient.post(
              `/refresh?refreshToken=${refreshToken}`
            );
            console.log('요청 보냈음');

            if (response.status === 200) {
              console.log('요청 잘 됐음');
              const newAccessToken = response.data.accessToken;
              const newRefreshToken = response.data.refreshToken;

              await AsyncStorage.setItem('accessToken', newAccessToken);
              await AsyncStorage.setItem('refreshToken', newRefreshToken);
              console.log('저장 잘 됐음');
              originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
              console.log('다시 시도 요청 보낼게');
              return apiClient(originalRequest);
            } else {
              console.log('토큰 갱신 실패:', response.data);
            }
          } else {
            console.log('리프레시 토큰이 없습니다.');
          }
        } catch (err) {
          console.error('토큰 갱신 중 오류 발생:', err);
        }
      }
    } else {
      console.error(
        '응답 오류:',
        error.response ? error.response.data : error.message
      );
    }

    return Promise.reject(error);
  }
);

export default apiClient;
