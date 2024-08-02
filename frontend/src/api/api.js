import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// axios 인스턴스 생성
const apiClient = axios.create({
  baseURL: 'http://i11b109.p.ssafy.io:8080', // 서버의 기본 URL을 여기에 입력
  timeout: 1000, // 요청 타임아웃 설정
});

// 요청 인터셉터 설정
apiClient.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('accessToken'); // AsyncStorage에서 토큰 가져오기
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiClient;
