import React, { useState, useCallback, useEffect } from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import BoardItem from '../../components/BoardItem';
import TabButton from '../../components/BoardTabButton';
import { WHITE, GRAY, SKYBLUE, PRIMARY } from '../../constant/color';
import { fetchBoards, fetchBoardDetail } from '../../api/user';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FontAwesome from '@expo/vector-icons/FontAwesome';

const BoardScreen = () => {
  const navigate = useNavigation();
  const [selectedCategory, setSelectedCategory] = useState('notice');
  const [boards, setBoards] = useState([]);
  const [role, setRole] = useState('');

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const userRole = await AsyncStorage.getItem('userRole');
        setRole(userRole);
      } catch (error) {
        console.error('역할 정보 조회 실패:', error);
      }
    };

    fetchUserRole();
  }, []);

  const loadBoards = useCallback(async () => {
    try {
      const boards = await fetchBoards(selectedCategory);
      setBoards(boards);
      console.log('알림페이지 게시글들 조회 ::::::::::::::::', boards);
    } catch (error) {
      console.error('게시판 조회 실패:', error);
    }
  }, [selectedCategory]);

  useFocusEffect(
    useCallback(() => {
      loadBoards();
    }, [loadBoards])
  );

  const handleBoardPress = async (boardId) => {
    try {
      const board = await fetchBoardDetail(boardId);
      navigate.navigate('Detail', { board });
    } catch (error) {
      console.error('게시글 상세조회 실패:', error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.bgContainer}>
        <View style={styles.tabContainer}>
          <View style={styles.tabButtons}>
            <TabButton
              title="공지사항"
              isActive={selectedCategory === 'notice'}
              onPress={() => setSelectedCategory('notice')}
            />
            <TabButton
              title="자유게시판"
              isActive={selectedCategory === 'free'}
              onPress={() => setSelectedCategory('free')}
            />
          </View>
          {(selectedCategory === 'notice' && role === 'ADMIN') ||
          selectedCategory === 'free' ? (
            <TouchableOpacity
              onPress={() => {
                navigate.navigate('Create', { selectedCategory });
                console.log(selectedCategory);
              }}
              style={styles.writebtn}
            >
              <Text style={styles.writebtnText}>
                <FontAwesome
                  name="pencil-square-o"
                  size={30}
                  color={PRIMARY.DEFAULT}
                />
              </Text>
            </TouchableOpacity>
          ) : null}
        </View>
        <ScrollView>
          {boards.map((board, index) => (
            <BoardItem
              key={index}
              board={board}
              onPress={() => handleBoardPress(board.boardId)}
            />
          ))}
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: WHITE,
  },
  bgContainer: {
    height: '98%',
    backgroundColor: GRAY.BACKGROUND,
    borderRadius: 15,
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: WHITE,
  },
  tabButtons: {
    flexDirection: 'row',
    flex: 1,
  },
  writebtn: {
    alignSelf: 'flex-end',
    backgroundColor: 'transparent',
    paddingHorizontal: 10,
    marginBottom: 5,
  },
});

export default BoardScreen;
