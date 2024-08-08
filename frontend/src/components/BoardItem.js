import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { WHITE, GRAY, BLACK } from '../constant/color';

const BoardItem = ({ board, onPress }) => {
  // 글자를 20자로 제한하고 '...' 추가하는 함수
  const truncateContent = (content) => {
    return content.length > 30 ? content.slice(0, 30) + '...' : content;
  };

  return (
    <View style={styles.container} onTouchEnd={onPress}>
      <Text style={styles.title}>{board.title}</Text>
      <Text style={styles.subtitle}>{truncateContent(board.boardContent)}</Text>
      <View style={styles.subinfo}>
        {board.category === 'free' && (
          <Text style={styles.subtitle}>{board.boardMemberNickname}</Text>
        )}
        <Text style={styles.subtitle}>
          {new Date(board.createDate).toLocaleString()}
        </Text>
      </View>
      <View style={styles.separator} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: GRAY.BACKGROUND,
  },
  title: {
    fontSize: 18,
    color: BLACK,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    color: GRAY.TEXT,
    marginBottom: 10,
  },
  separator: {
    height: 1,
    backgroundColor: WHITE,
  },
  subinfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default BoardItem;
