import { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
  useWindowDimensions,
} from 'react-native';
import BoardItem from '../../components/BoardItem';
import TabButton from '../../components/BoardTabButton';
import Pagename from '../../components/PageName';
import { BLACK, WHITE, SKYBLUE, GRAY } from '../../constant/color';
import DetailScreen from './DetailScreen';
const boards = [
  {
    category: '공지사항',
    title: '셔틀 노선 변경 안내',
    content:
      '밤 사이 많은 비가 내려 도로 통제로 셔틀버스가 늦어질 수 있으니 개별 이동도 고려바랍니다. 1호차 6호차는 유성온천역부터 운행...',
    date: '2024.07.10 07:03',
  },
  {
    category: '공지사항',
    title: '셔틀버스 안내 - 3호차',
    content:
      '현재 유등교 침하로 인해 해당구간은 이용이 불가하여 ‘도안 수목토아파트’, ‘가수원네거리’, ‘도마네거리’ 정거장은 운행하지 않...',
    date: '2024.07.09 13:18',
  },
  {
    category: '공지사항',
    title: '출결 인정 변동',
    content:
      '오늘 날씨/셔틀/교통 이슈 등으로 인한 지각은 9:45 입실까지 정상 출결 반영됩니다.',
    date: '2024.07.09 10:08',
  },
  {
    category: '자유게시판',
    nickname: 'dd',
    title: '새로운 동아리 모집',
    content: '새로운 동아리 회원을 모집합니다. 관심 있는 분들은 연락 주세요!',
    date: '2024.07.08 09:00',
    comments: [
      {
        author: 'jane',
        text: '동아리 활동 내용이 궁금해요!',
        date: '2024.07.08 11:00',
      },
      {
        author: 'john',
        text: '어떤 분야의 동아리인가요?',
        date: '2024.07.08 12:15',
      },
      {
        author: 'jane',
        text: '동아리 활동 내용이 궁금해요!',
        date: '2024.07.08 11:00',
      },
      {
        author: 'john',
        text: '어떤 분야의 동아리인가요?',
        date: '2024.07.08 12:15',
      },
      {
        author: 'jane',
        text: '동아리 활동 내용이 궁금해요!',
        date: '2024.07.08 11:00',
      },
      {
        author: 'john',
        text: '어떤 분야의 동아리인가요?',
        date: '2024.07.08 12:15',
      },
    ],
  },
  {
    category: '자유게시판',
    nickname: 'dd',
    title: '벼룩시장',
    content:
      '사용하지 않는 물품을 교환하거나 판매할 수 있는 벼룩시장을 엽니다.',
    date: '2024.07.07 12:30',
    comments: [
      {
        author: 'alice',
        text: '무슨 물품들이 있나요?',
        date: '2024.07.07 13:50',
      },
    ],
  },
];

const BoardScreen = () => {
  const [selectedCategory, setSelectedCategory] = useState('공지사항');
  const [selectedBoard, setSelectedBoard] = useState(null);
  const filteredBoards = boards.filter(
    (board) => board.category === selectedCategory
  );

  if (selectedBoard) {
    return <DetailScreen board={selectedBoard} />;
  }

  return (
    <View style={styles.container}>
      <Pagename title="< 게시판" />
      <View style={styles.bgContainer}>
        <View style={styles.tabContainer}>
          <TabButton
            title="공지사항"
            isActive={selectedCategory === '공지사항'}
            onPress={() => setSelectedCategory('공지사항')}
          />
          <TabButton
            title="자유게시판"
            isActive={selectedCategory === '자유게시판'}
            onPress={() => setSelectedCategory('자유게시판')}
          />
        </View>
        <ScrollView>
          {filteredBoards.map((board, index) => (
            <BoardItem
              key={index}
              board={board}
              onPress={() => setSelectedBoard(board)}
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
    height: '85%',
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
