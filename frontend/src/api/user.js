import apiClient from './api';

// 닉네임 가져오기
export const getNickname = async () => {
  try {
    const response = await apiClient.get('/members/me');
    return response.data.nickname;
  } catch (error) {
    console.error('닉네임 가져오기 실패:', error);
    throw error;
  }
};

// 프로필 데이터 가져오기
export const fetchProfileData = async () => {
  try {
    const response = await apiClient.get('/members/me');
    return response.data;
  } catch (error) {
    console.error('프로필 정보를 가져오는 중 오류 발생:', error);
    throw error;
  }
};

// 마지막 공지사항 가져오기
export const fetchLastNotice = async () => {
  try {
    const response = await apiClient.get('/board/notice/last');
    return response.data;
  } catch (error) {
    console.error('마지막 공지사항을 가져오는 중 오류 발생:', error);
    throw error;
  }
};

// 버스 운행 상태 확인
export const checkBusStatus = async () => {
  try {
    const response = await apiClient.get('/start/check');
    return response.data;
  } catch (error) {
    console.error('운행 상태 확인 중 오류 발생:', error);
    throw error;
  }
};

// 승객 데이터 가져오기
export const fetchPassengerData = async () => {
  try {
    const response = await apiClient.get('/boarding');
    return response.data;
  } catch (error) {
    console.error('탑승 인원 정보를 가져오는 중 오류 발생:', error);
    throw error;
  }
};

// ******************게시판 관련***********************
// 게시글 목록 가져오기
export const fetchBoards = async (category) => {
  try {
    const response = await apiClient.get(`/board?category=${category}`);
    return response.data.reverse(); // 최신 게시물이 위로 오도록 설정
  } catch (error) {
    console.error('게시판 조회 실패:', error);
    throw error;
  }
};

// 게시글 작성
export const createBoard = async (category, title, content, accessToken) => {
  try {
    const response = await apiClient.post(
      `/board/${category}`,
      { title, content },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('게시글 작성 실패:', error);
    throw error;
  }
};

// 게시글 수정
export const updateBoard = async (boardId, title, content, accessToken) => {
  try {
    const response = await apiClient.put(
      `/board/${boardId}`,
      { title, content },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('게시글 수정 실패:', error);
    throw error;
  }
};

// 게시글 삭제
export const deleteBoard = async (boardId, accessToken) => {
  try {
    const response = await apiClient.delete(`/board/${boardId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('게시글 삭제 실패:', error);
    throw error;
  }
};

// 게시글 상세보기
export const fetchBoardDetail = async (boardId) => {
  try {
    const response = await apiClient.get(`/board/${boardId}`);
    return response.data;
  } catch (error) {
    console.error('게시글 상세조회 실패:', error);
    throw error;
  }
};

// 댓글 작성
export const createComment = async (boardId, commentContent, accessToken) => {
  try {
    const response = await apiClient.post(
      `/comments/${boardId}`,
      { commentContent },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('댓글 작성 실패:', error);
    throw error;
  }
};

// 댓글 삭제
export const deleteComment = async (commentId) => {
  try {
    const response = await apiClient.delete(`/comments/${commentId}`);
    return response.data;
  } catch (error) {
    console.error('댓글 삭제 실패:', error);
    throw error;
  }
};
