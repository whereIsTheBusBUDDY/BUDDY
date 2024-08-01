const admin = {
  EMAIL: 'admin',
  PASSWORD: '1234',
  ROLE: 'admin',
};

const user = {
  EMAIL: 'user@naver.com',
  PASSWORD: '1234',
  ROLE: 'user',
};

import axios from 'axios';
import { signUp_url, mm_url } from './url';

export const signIn = (email, password) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (email === admin.EMAIL && password === admin.PASSWORD) {
        resolve(admin);
      } else if (email === user.EMAIL && password === user.PASSWORD) {
        resolve(user);
      } else {
        reject('The email or password is wrong');
      }
    });
  });
};

export const signUp = (userData) => {
  return axios
    .post(signUp_url, userData)
    .then((response) => {
      console.log('Signup Response:', response.data);
      return response.data;
    })
    .catch((error) => {
      console.error('Axios Error:', error); // Axios 전체 오류 로깅
      if (error.response) {
        console.error('Error Response:', error.response.data); // HTTP 응답 본문 로깅
        throw new Error(error.response.data.message || 'Registration failed');
      } else if (error.request) {
        console.error('Error Request:', error.request); // 요청에 대한 오류 정보 로깅
        throw new Error('No response was received');
      } else {
        console.error('Error Message:', error.message); // 오류 메시지 로깅
        throw new Error('Error setting up the request');
      }
    });
};

export const mmAuth = (mmData) => {
  axios.post(mm_url, mmData);
};
