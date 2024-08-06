import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { WHITE, GRAY, BLACK } from '../constant/color';

const BoardItem = ({ board, onPress }) => {
  return (
    <View style={styles.container} onTouchEnd={onPress}>
      <Text style={styles.title}>{board.title}</Text>
      <Text style={styles.subtitle}>{board.memberID}</Text>
      <Text style={styles.subtitle}>
        {new Date(board.createDate).toLocaleString()}
      </Text>
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
});

export default BoardItem;
