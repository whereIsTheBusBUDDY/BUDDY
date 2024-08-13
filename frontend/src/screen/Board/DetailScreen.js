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
  RefreshControl,
} from 'react-native';
import { BLACK, WHITE, SKYBLUE, GRAY, PRIMARY } from '../../constant/color';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import SendInput from '../../components/SendInput';
import { fetchBoardDetail } from '../../api/user';
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
  const [refreshing, setRefreshing] = useState(false);
  const [key, setKey] = useState(0);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchNickname = async () => {
      try {
        const nickname = await getNickname();
        setNickname(nickname);
        console.log(comments);
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

      Alert.alert(
        '',
        '게시글을 삭제하시겠습니까?',
        [
          {
            text: '취소',
            style: 'cancel',
          },
          {
            text: '삭제',
            onPress: async () => {
              try {
                await deleteBoard(board.boardId, accessToken);
                navigation.goBack();
              } catch (error) {
                console.error('게시글 삭제 중 오류:', error);
              }
            },
            style: 'destructive',
          },
        ],
        { cancelable: true }
      );
    } catch (error) {
      console.error('게시글 삭제 오류:', error);
    }
  };

  const handleCommentSubmit = async () => {
    if (!comment.trim()) {
      Alert.alert('', '댓글을 입력해주세요.');
      return;
    }

    try {
      const accessToken = await AsyncStorage.getItem('accessToken');

      if (!accessToken) {
        console.error('액세스 토큰이 없습니다.');
        return;
      }

      const response = await createComment(board.boardId, comment, accessToken);

      const newComment = {
        commentId: response.commentId, // 서버에서 반환된 commentId 사용
        commentContent: comment,
        createDate: new Date().toISOString(),
        nickname: nickname,
      };

      setComments((prevComments) => [...prevComments, newComment]);
      setComment('');
      await fetchBoardDetail(board.boardId);
    } catch (error) {
      console.error('댓글 작성 중 오류:', error);
    }
  };

  const handleCommentDelete = async (deletedCommentId) => {
    Alert.alert(
      '',
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
              setKey(key + 1);
            } catch (error) {
              console.error('댓글 삭제 중 오류:', error);
            }
          },
          style: 'destructive',
        },
      ],
      { cancelable: true }
    );
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    // 새로고침 로직을 추가 (예: API 요청)
    setTimeout(() => setRefreshing(false), 3000);
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 80}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
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
