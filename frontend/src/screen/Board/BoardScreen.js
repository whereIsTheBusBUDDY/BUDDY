import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import BoardItem from '../../components/BoardItem';
import TabButton from '../../components/BoardTabButton';
import { WHITE, GRAY } from '../../constant/color';
import apiClient from '../../api/api';

const BoardScreen = () => {
  const navigate = useNavigation();
  const [selectedCategory, setSelectedCategory] = useState('free');
  const [boards, setBoards] = useState([]);

  useEffect(() => {
    const fetchBoards = async () => {
      try {
        const response = await apiClient.get(
          `/board?category=${selectedCategory}`
        );
        setBoards(response.data);
      } catch (error) {
        console.error('게시판 조회 실패:', error);
      }
    };

    fetchBoards();
  }, [selectedCategory]);

  const handleBoardPress = async (boardId) => {
    try {
      const response = await apiClient.get(`/board/${boardId}`);
      navigate.navigate('Detail', { board: response.data });
    } catch (error) {
      console.error('게시글 상세조회 실패:', error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.bgContainer}>
        <View style={styles.tabContainer}>
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
    justifyContent: 'flex-start',
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: WHITE,
  },
});

export default BoardScreen;
