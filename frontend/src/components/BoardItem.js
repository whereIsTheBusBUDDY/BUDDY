import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { BLACK, WHITE, SKYBLUE, GRAY } from '../constant/color';

const BoardItem = ({ board, onPress }) => {
  return (
    <TouchableOpacity style={styles.boardCard} onPress={onPress}>
      <Text style={styles.boardTitle}>{board.title}</Text>
      <Text style={styles.boardContent}>{board.content}</Text>
      <Text style={styles.boardDate}>{board.date}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  boardCard: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomColor: WHITE,
    borderBottomWidth: 1,
  },
  boardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  boardContent: {
    fontSize: 14,
    color: GRAY.FONT,
    marginBottom: 8,
  },
  boardDate: {
    fontSize: 12,
    color: GRAY.FONT,
  },
});

export default BoardItem;
