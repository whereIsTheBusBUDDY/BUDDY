import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import ModalDropdown from 'react-native-modal-dropdown';
import { BLACK, GRAY, PRIMARY, WHITE } from '../../constant/color';
import apiClient from '../../api/api';

const TabButton = ({ title, isActive, onPress }) => (
  <TouchableOpacity
    style={[
      styles.tabButton,
      isActive ? styles.activeTabButton : styles.inactiveTabButton,
    ]}
    onPress={onPress}
  >
    <Text style={[styles.tabButtonText]}>{title}</Text>
  </TouchableOpacity>
);

const MyFavorites = () => {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const response = await apiClient.get('/bookmarks', {});
        setFavorites(response.data);
      } catch (error) {
        console.error('나의 즐겨찾기 조회 실패:', error);
      }
    };

    fetchFavorites();
  }, []);

  const toggleBookmark = async (stationId, isBookmarked) => {
    try {
      const url = `/bookmarks?stationId=${stationId}`;
      const method = isBookmarked ? 'DELETE' : 'POST';
      await apiClient({
        method,
        url,
      });

      setFavorites((prevFavorites) =>
        prevFavorites.map((fav) =>
          fav.stationId === stationId
            ? { ...fav, bookmarked: !isBookmarked }
            : fav
        )
      );
    } catch (error) {
      console.error('북마크 실패:', error);
    }
  };

  return (
    <View style={styles.listContainer}>
      {favorites.length > 0 ? (
        favorites.map((favorite, index) => (
          <View
            key={index}
            style={[
              styles.item,
              { flexDirection: 'row', justifyContent: 'space-between' },
            ]}
          >
            <Text style={styles.title}>{favorite.stationName}</Text>
            <TouchableOpacity
              onPress={() =>
                toggleBookmark(favorite.stationId, favorite.bookmarked)
              }
            >
              <Text
                style={favorite.bookmarked ? styles.starSelected : styles.star}
              >
                ★
              </Text>
            </TouchableOpacity>
          </View>
        ))
      ) : (
        <Text style={styles.noItems}>
          즐겨찾기가 없습니다. 하차 알림을 받으시려면 즐겨찾기 등록을 해주세요!
        </Text>
      )}
    </View>
  );
};

const RegisterFavorites = () => {
  const [selectedBus, setSelectedBus] = useState('1호차'); // 기본값을 1호차로 설정
  const [busStops, setBusStops] = useState([]);

  const items = ['1호차', '2호차', '3호차', '4호차', '5호차', '6호차'];

  const handleSelect = async (index, value) => {
    setSelectedBus(value);

    try {
      const busId = index + 1;
      const response = await apiClient.get(`/routes?busId=${busId}`);
      setBusStops(response.data);
    } catch (error) {
      console.error('호차별 노선 조회 실패:', error);
    }
  };

  useEffect(() => {
    // 페이지가 로드될 때 1호차의 데이터를 가져옴
    handleSelect(0, '1호차');
  }, []);

  const toggleBookmark = async (stationId, isBookmarked) => {
    try {
      const url = `/bookmarks?stationId=${stationId}`;
      const method = isBookmarked ? 'DELETE' : 'POST';
      await apiClient({
        method,
        url,
      });

      setBusStops((prevStops) =>
        prevStops.map((stop) =>
          stop.stationId === stationId
            ? { ...stop, bookmarked: !isBookmarked }
            : stop
        )
      );
    } catch (error) {
      console.error('북마크 토글 실패:', error);
    }
  };

  return (
    <ScrollView style={styles.listContainer}>
      <ModalDropdown
        options={items}
        onSelect={handleSelect}
        defaultValue={selectedBus} // 기본값을 1호차로 설정
        style={styles.dropdown}
        textStyle={styles.dropdownText}
        dropdownStyle={styles.dropdownBox}
        dropdownTextStyle={styles.dropdownBoxText}
      />
      {busStops.length > 0 ? (
        busStops.map((stop, index) => (
          <View
            key={index}
            style={[
              styles.item,
              { flexDirection: 'row', justifyContent: 'space-between' },
            ]}
          >
            <Text style={styles.title}>{stop.stationName}</Text>
            <TouchableOpacity
              onPress={() => toggleBookmark(stop.stationId, stop.bookmarked)}
            >
              <Text style={stop.bookmarked ? styles.starSelected : styles.star}>
                ★
              </Text>
            </TouchableOpacity>
          </View>
        ))
      ) : (
        <Text style={styles.item}>정류장을 선택하세요</Text>
      )}
    </ScrollView>
  );
};

const FavoriteScreen = () => {
  const [activeTab, setActiveTab] = useState('MyFavorites');
  return (
    <ScrollView style={styles.container}>
      <View style={styles.tabContainer}>
        <TabButton
          title="나의 즐겨찾기"
          isActive={activeTab === 'MyFavorites'}
          onPress={() => setActiveTab('MyFavorites')}
        />
        <TabButton
          title="즐겨찾기 등록"
          isActive={activeTab === 'RegisterFavorites'}
          onPress={() => setActiveTab('RegisterFavorites')}
        />
      </View>
      {activeTab === 'MyFavorites' ? <MyFavorites /> : <RegisterFavorites />}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: WHITE,
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  tabButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    zIndex: 1,
    width: '50%',
    alignItems: 'center',
  },
  activeTabButton: {
    backgroundColor: PRIMARY.BACKGROUND,
    borderBottomWidth: 0,
    paddingBottom: 15,
  },
  inactiveTabButton: {
    backgroundColor: GRAY.BACKGROUND,
  },
  tabButtonText: {
    fontSize: 16,
  },
  listContainer: {
    backgroundColor: PRIMARY.BACKGROUND,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    paddingVertical: 30,
    paddingHorizontal: 15,
  },
  item: {
    fontSize: 16,
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 5,
    backgroundColor: WHITE,
    margin: 8,
    borderRadius: 5,
  },
  dropdown: {
    backgroundColor: GRAY.BTN,
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 20,
  },
  dropdownText: {
    fontSize: 16,
  },
  dropdownBox: {
    width: '100%',
  },
  dropdownBoxText: {
    fontSize: 16,
  },
  stopContainer: {
    flexDirection: 'row',
    marginBottom: 15,
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    color: BLACK,
  },
  rightPad: {
    flex: 3,
  },
  leftPad: {
    flex: 1,
    justifyContent: 'center',
    paddingRight: 10,
  },
  liContainer: {
    backgroundColor: WHITE,
    flex: 1,
  },
  star: {
    fontSize: 20,
    fontWeight: 'bold',
    color: GRAY.BACKGROUND,
    marginRight: 10,
  },
  starSelected: {
    fontSize: 20,
    fontWeight: 'bold',
    color: PRIMARY.DEFAULT,
    marginRight: 10,
  },
  noItems: {
    fontSize: 16,
    paddingVertical: 10,
    paddingHorizontal: 5,
    color: GRAY.FONT,
  },
});

export default FavoriteScreen;
