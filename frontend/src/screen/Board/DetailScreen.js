import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { BLACK, WHITE, SKYBLUE, GRAY, PRIMARY } from '../../constant/color';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import SendInput from '../../components/SendInput';
import {
  deleteBoard,
  createComment,
  deleteComment,
  getNickname,
} from '../../api/user';
import Button, { ButtonColors } from '../../components/smallButton';

const DetailScreen = ({ route }) => {
  const [board, setBoard] = useState(route.params.board);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState(board.comments || []);
  const [nickname, setNickname] = useState('');
  const navigation = useNavigation();

  useEffect(() => {
    const fetchNickname = async () => {
      try {
        const nickname = await getNickname();
        setNickname(nickname);
      } catch (error) {
        console.error('닉네임 가져오기 실패:', error);
      }
    };

    fetchNickname();
  }, []);

  useFocusEffect(
    useCallback(() => {
      const updatedBoard = route.params.board;
      if (updatedBoard) {
        setBoard(updatedBoard);
        setComments(updatedBoard.comments || []);
      }
    }, [route.params.board])
  );

  const handleDeleteBoard = async () => {
    try {
      const accessToken = await AsyncStorage.getItem('accessToken');

      if (!accessToken) {
        console.error('액세스 토큰이 없습니다.');
        return;
      }

      await deleteBoard(board.boardId, accessToken);
      Alert.alert('성공', '게시글이 성공적으로 삭제되었습니다!', [
        { text: '확인', onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      console.error('게시글 삭제 오류:', error);
      Alert.alert('오류', `게시글 삭제 실패: ${error.message}`);
    }
  };

  const handleCommentSubmit = async () => {
    if (!comment.trim()) {
      Alert.alert('오류', '댓글을 입력해주세요.');
      return;
    }

    try {
      const accessToken = await AsyncStorage.getItem('accessToken');

      if (!accessToken) {
        console.error('액세스 토큰이 없습니다.');
        return;
      }

      const response = await createComment(board.boardId, comment, accessToken);

      // 새로운 댓글을 comments 상태에 추가
      const newComment = {
        commentId: response.commentId, // 서버에서 받은 고유 commentId 사용
        commentContent: comment,
        createDate: new Date().toISOString(),
        nickname: nickname || '익명',
      };

      setComments((prevComments) => [...prevComments, newComment]);
      setComment('');
    } catch (error) {
      console.error('댓글 작성 중 오류:', error);
      Alert.alert('오류', `댓글 작성 실패: ${error.message}`);
    }
  };

  const handleCommentDelete = async (deletedCommentId) => {
    Alert.alert(
      '삭제 확인',
      '댓글을 삭제하시겠습니까?',
      [
        {
          text: '취소',
          style: 'cancel',
        },
        {
          text: '삭제',
          onPress: async () => {
            try {
              await deleteComment(deletedCommentId);
              setComments((prevComments) =>
                prevComments.filter(
                  (comment) => comment.commentId !== deletedCommentId
                )
              );
            } catch (error) {
              console.error('댓글 삭제 중 오류:', error);
              Alert.alert('오류', `댓글 삭제 실패: ${error.message}`);
            }
          },
          style: 'destructive',
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 80}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View
            style={[
              styles.noticeContainer,
              board.category === 'notice' && styles.noticeFullHeight,
              board.category === 'free' && styles.freeContainer,
            ]}
          >
            <View style={styles.tabContainer}>
              <Text style={styles.boardTitle}>{board.title}</Text>
              <Text style={styles.boardDate}>
                작성자: {board.boardMemberNickname} |{' '}
                {new Date(board.createDate).toLocaleString()}
              </Text>
            </View>
            <View style={styles.contentContainer}>
              <Text style={styles.boardContent}>{board.boardContent}</Text>
            </View>
            {nickname === board.boardMemberNickname && (
              <View style={styles.buttonContainer}>
                <Button
                  title="수정"
                  onPress={() => navigation.navigate('Edit', { board })}
                  buttonColor={ButtonColors.SKYBLUE}
                  buttonStyle={styles.smallBtn}
                />
                <Button
                  title="삭제"
                  onPress={handleDeleteBoard}
                  buttonColor={ButtonColors.ORANGE}
                  buttonStyle={styles.smallBtn}
                />
              </View>
            )}
          </View>
          {board.category === 'free' && (
            <>
              <ScrollView style={styles.commentScrollContainer}>
                <Text style={styles.commentTitle}>댓글</Text>
                <View style={styles.commentContainer}>
                  {comments.length > 0 ? (
                    comments.map((comment, index) => (
                      <View
                        key={comment.commentId || `comment-${index}`}
                        style={styles.comment}
                      >
                        {/* <View key={comment.commentId} style={styles.comment}> */}
                        <View style={styles.commentTextContainer}>
                          <Text style={styles.commentAuthor}>
                            {comment.nickname}
                          </Text>
                          <Text style={styles.commentText}>
                            {comment.commentContent}
                          </Text>
                          <Text style={styles.commentDate}>
                            {new Date(comment.createDate).toLocaleString()}
                          </Text>
                        </View>
                        {nickname === comment.nickname && (
                          <Button
                            title="X"
                            onPress={() =>
                              handleCommentDelete(comment.commentId)
                            }
                            buttonColor={ButtonColors.GRAY}
                            buttonStyle={styles.commentDeleteButton}
                          />
                        )}
                      </View>
                    ))
                  ) : (
                    <Text style={styles.noComments}>댓글이 없습니다.</Text>
                  )}
                </View>
              </ScrollView>
            </>
          )}
        </ScrollView>
        {board.category === 'free' && (
          <View style={styles.commentInputContainer}>
            <SendInput
              placeholder="댓글을 입력해주세요!"
              buttonText="작성"
              value={comment}
              onChangeText={setComment}
              onPress={handleCommentSubmit}
            />
          </View>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: WHITE,
  },
  container: {
    flex: 1,
    backgroundColor: WHITE,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  noticeContainer: {
    minHeight: '60%',
    backgroundColor: PRIMARY.BACKGROUND,
    borderRadius: 15,
    marginBottom: 15,
    padding: 20,
  },
  noticeFullHeight: {
    minHeight: '95%',
    marginBottom: 0,
  },
  freeContainer: {
    backgroundColor: GRAY.BACKGROUND,
    padding: 20,
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
  buttonContainer: {
    flexDirection: 'row',
    position: 'absolute',
    right: 10,
    bottom: 10,
  },
  commentScrollContainer: {
    maxHeight: 200,
  },
  commentContainer: {
    marginBottom: 20,
  },
  comment: {
    marginBottom: 10,
    backgroundColor: SKYBLUE.BACKGROUND,
    borderRadius: 15,
    paddingVertical: 10,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  commentTextContainer: {
    flex: 1,
  },
  commentTitle: {
    fontSize: 18,
    fontWeight: '600',
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
  commentDeleteButton: {
    marginLeft: 10, // 오른쪽에 여유 공간 추가
    height: 30,
  },
  noComments: {
    fontSize: 14,
    color: GRAY.FONT,
    marginLeft: 20,
  },
  commentInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    marginHorizontal: 10,
    borderTopWidth: 1,
    borderTopColor: GRAY.BACKGROUND,
    backgroundColor: WHITE,
  },
  smallBtn: {
    borderRadius: 10,
    height: 30,
    marginLeft: 10,
  },
});

export default DetailScreen;
