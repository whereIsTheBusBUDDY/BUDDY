import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const apiClient = axios.create({
  baseURL: 'http://i11b109.p.ssafy.io:8080',
  timeout: 3000,
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

    if (error.response.status === 4000) {
      try {
        const refreshToken = await AsyncStorage.getItem('refreshToken');

        if (refreshToken) {
          const response = await apiClient.post(
            `/refresh?refreshToken=${refreshToken}`
          );

          const newAccessToken = response.data.accessToken;
          await AsyncStorage.setItem('accessToken', newAccessToken);

          const newRefreshToken = response.data.refreshToken;
          await AsyncStorage.setItem('refreshToken', newRefreshToken);

          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return apiClient(originalRequest);
        }
      } catch (err) {
        console.error('Token Refresh failed:', err);
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
