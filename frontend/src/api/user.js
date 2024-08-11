import apiClient from './api';

export const getNickname = async () => {
  try {
    const response = await apiClient.get('/members/me');
    if (response.status === 200) {
      const { nickname } = response.data;
    } else {
      console.error(
        '닉네임 가져오기 실패: 응답 상태가 200이 아닙니다.',
        response
      );
    }
  } catch (error) {
    // 에러 전체를 출력하여 문제 파악
    console.error('닉네임 가져오기 중 에러 발생:', error);
  }
};
