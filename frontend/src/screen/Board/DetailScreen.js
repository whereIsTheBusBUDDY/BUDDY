import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import Pagename from '../../components/PageName';
import SendInput from '../../components/SendInput';
import { BLACK, WHITE, SKYBLUE, GRAY, PRIMARY } from '../../constant/color';

const DetailScreen = ({ board }) => {
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {board.category === '공지사항' ? (
          <View style={styles.noticeContainer}>
            <View style={styles.tabContainer}>
              <Text style={styles.boardTitle}>{board.title}</Text>
              <Text style={styles.boardDate}>{board.date}</Text>
            </View>
            <View style={styles.contentContainer}>
              <Text style={styles.boardContent}>{board.content}</Text>
            </View>
          </View>
        ) : (
          <View>
            <View style={styles.freeContainer}>
              <View style={styles.tabContainer}>
                <Text style={styles.boardTitle}>{board.title}</Text>
                <Text style={styles.boardDate}>{board.nickname}</Text>
                <Text style={styles.boardDate}>{board.date}</Text>
              </View>
              <View style={styles.contentContainer}>
                <Text style={styles.boardContent}>{board.content}</Text>
              </View>
            </View>
            <Text style={styles.commentTitle}>댓글</Text>
            <View style={styles.commentContainer}>
              {board.comments ? (
                board.comments.map((comment, index) => (
                  <View key={index} style={styles.comment}>
                    <Text style={styles.commentAuthor}>{comment.author}</Text>
                    <Text style={styles.commentText}>{comment.text}</Text>
                    <Text style={styles.commentDate}>{comment.date}</Text>
                  </View>
                ))
              ) : (
                <Text style={styles.noComments}>댓글이 없습니다.</Text>
              )}
            </View>
          </View>
        )}
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
    // paddingBottom: 5,
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
  freeContainer: {
    minHeight: '35%',
    backgroundColor: SKYBLUE.BACKGROUND,
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
  commenContainer: {},
  comment: {
    marginBottom: 10,
    backgroundColor: GRAY.BACKGROUND,
    borderRadius: 15,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  commentTitle: {
    fontSize: 18,
    fontWeight: 'semibold',
    margin: 15,
  },

  commentAuthor: {
    fontSize: 14,
    color: GRAY.FONT,
    marginLeft: 3,
  },
  commentText: {
    fontSize: 14,
    fontWeight: 'semibold',
    color: BLACK,
    marginVertical: 5,
  },
  commentDate: {
    fontSize: 12,
    color: GRAY.FONT,
    marginLeft: 3,
  },
  noComments: {
    fontSize: 14,
    color: GRAY.FONT,
  },
});

export default DetailScreen;
