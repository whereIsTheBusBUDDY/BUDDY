import apiClient from './api';

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
