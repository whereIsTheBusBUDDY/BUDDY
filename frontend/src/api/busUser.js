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
    // postBusDataGpu(data);
    console.error('eta API 요청 중 오류 발생:', error);
    throw error;
  }
};

// eta 정보 전달 (-1)
export const postBusDataGpu = async (data) => {
  try {
    console.log('data', data);
    const response = await apiClient.post('/eta/gpu', data, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    console.log('gpu eta 정보 전송', response.data);
    return response.data;
  } catch (error) {
    console.error('gpu eta API 요청 중 오류 발생:', error);
    throw error;
  }
};

// 경로 데이터 가져오기
export const fetchBusStops = async (busLine) => {
  try {
    const response = await apiClient.get(`/coordinates?busLine=${busLine}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching bus stops:', error);
    throw error;
  }
};

// 정류장 데이터 가져오기
export const fetchStations = async (busLine, accessToken) => {
  try {
    const response = await apiClient.get(`/stations/${busLine}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching stations:', error);
    throw error;
  }
};

// 즐겨찾기 목록 가져오기
export const fetchBookmarks = async (accessToken) => {
  try {
    const response = await apiClient.get('/bookmarks', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching bookmarks:', error);
    throw error;
  }
};

// 즐겨찾기 토글
export const toggleStar = async (stationId, isStarred, accessToken) => {
  try {
    const method = isStarred ? 'DELETE' : 'POST';
    const response = await apiClient({
      method,
      url: `/bookmarks?stationId=${stationId}`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      data: isStarred ? null : { stationId },
    });

    return response.data;
  } catch (error) {
    console.error('Error updating bookmark:', error);
    throw error;
  }
};
