import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import SendInput from '../../components/SendInput';
import { BLACK, WHITE, SKYBLUE, GRAY, PRIMARY } from '../../constant/color';

const DetailScreen = ({ route }) => {
  const { board } = route.params;

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.noticeContainer}>
          <View style={styles.tabContainer}>
            <Text style={styles.boardTitle}>{board.title}</Text>
            <Text style={styles.boardDate}>
              by {board.memberID} on{' '}
              {new Date(board.createDate).toLocaleString()}
            </Text>
          </View>
          <View style={styles.contentContainer}>
            <Text style={styles.boardContent}>{board.content}</Text>
          </View>
        </View>
      </ScrollView>
      {board.category === '자유게시판' && (
        <SendInput placeholder="댓글을 입력해주세요!" buttonText="작성" />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
    backgroundColor: WHITE,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 110,
  },
  noticeContainer: {
    minHeight: '95%',
    backgroundColor: PRIMARY.BACKGROUND,
    borderRadius: 15,
  },
  tabContainer: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: WHITE,
  },
  contentContainer: {
    padding: 20,
  },
  boardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  boardContent: {
    fontSize: 16,
    color: BLACK,
    marginBottom: 8,
  },
  boardDate: {
    fontSize: 14,
    color: GRAY.FONT,
  },
});

export default DetailScreen;
