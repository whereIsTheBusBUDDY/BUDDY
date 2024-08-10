import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  Button,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { BLACK, WHITE, SKYBLUE, GRAY, PRIMARY } from '../../constant/color';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useUserContext } from '../../context/UserContext';
import SendInput from '../../components/SendInput';
import apiClient from '../../api/api';

const DetailScreen = ({ route }) => {
  const { setUser, setLoginUser } = useUserContext();
  const [board, setBoard] = useState(route.params.board);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState(board.comments || []); // 댓글 상태 추가
  const [nickname, setNickname] = useState(''); // 현재 사용자의 닉네임 상태 추가
  const navigation = useNavigation();

  // API를 통해 닉네임 가져오기
  useEffect(() => {
    const fetchNickname = async () => {
      try {
        const response = await apiClient.get('/members/me');
        const { nickname } = response.data;
        setNickname(nickname);
      } catch (error) {
        console.error('닉네임 가져오기 실패:', error);
      }
    };

    fetchNickname();
  }, []);

  useFocusEffect(
    useCallback(() => {
      // 페이지가 포커스될 때마다 게시글 정보 업데이트
      const updatedBoard = route.params.board;
      if (updatedBoard) {
        setBoard(updatedBoard);
        setComments(updatedBoard.comments || []); // 댓글을 원래 순서대로 저장
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

      const response = await fetch(
        `http://i11b109.p.ssafy.io:8080/board/${board.boardId}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.ok) {
        Alert.alert('성공', '게시글이 성공적으로 삭제되었습니다!', [
          { text: '확인', onPress: () => navigation.goBack() },
        ]);
      } else {
        const errorText = await response.text();
        Alert.alert('오류', `게시글 삭제 실패: ${errorText}`);
      }
    } catch (error) {
      console.error('게시글 삭제 오류:', error);
      Alert.alert('오류', `에러가 발생했습니다: ${error.message}`);
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

      const response = await fetch(
        `http://i11b109.p.ssafy.io:8080/comments/${board.boardId}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            commentContent: comment,
          }),
        }
      );

      if (response.ok) {
        const newComment = {
          commentId: new Date().getTime().toString(), // 임시 ID
          commentContent: comment,
          createDate: new Date().toISOString(), // 현재 시간을 ISO 문자열로 변환
          nickname: nickname || '익명', // 사용자 닉네임
        };
        setComments((prevComments) => [...prevComments, newComment]); // 새로운 댓글을 맨 아래에 추가
        setComment('');
        Alert.alert('성공', '댓글이 성공적으로 작성되었습니다!');
      } else {
        const errorText = await response.text();
        Alert.alert('오류', `댓글 작성 실패: ${errorText}`);
      }
    } catch (error) {
      console.error('댓글 작성 중 오류:', error);
      Alert.alert('오류', `에러가 발생했습니다: ${error.message}`);
    }
  };

  const handleCommentDelete = (deletedCommentId) => {
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
          onPress: () => {
            setComments((prevComments) =>
              prevComments.filter(
                (comment) => comment.commentId !== deletedCommentId
              )
            );
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
        keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 80} // 키보드 오버레이를 위한 오프셋 추가
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
          </View>
          {nickname === board.boardMemberNickname && (
            <View style={styles.buttonContainer}>
              <Button title="삭제" color="red" onPress={handleDeleteBoard} />
              <Button
                title="수정"
                color="blue"
                onPress={() => navigation.navigate('Edit', { board })}
              />
            </View>
          )}
          {board.category === 'free' && (
            <>
              <ScrollView style={styles.commentScrollContainer}>
                <Text style={styles.commentTitle}>댓글</Text>
                <View style={styles.commentContainer}>
                  {comments.length > 0 ? (
                    comments.map((comment) => (
                      <View key={comment.commentId} style={styles.comment}>
                        <Text style={styles.commentAuthor}>
                          {comment.nickname}
                        </Text>
                        <Text style={styles.commentText}>
                          {comment.commentContent}
                        </Text>
                        <Text style={styles.commentDate}>
                          {new Date(comment.createDate).toLocaleString()}
                        </Text>
                        {nickname === comment.nickname && (
                          <Button
                            title="삭제"
                            onPress={() =>
                              handleCommentDelete(comment.commentId)
                            }
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
  },
  noticeFullHeight: {
    minHeight: '80%',
    marginBottom: 0,
  },
  freeContainer: {
    backgroundColor: SKYBLUE.BACKGROUND,
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
    justifyContent: 'space-between',
    marginVertical: 10,
    paddingHorizontal: 20,
  },
  commentScrollContainer: {
    maxHeight: 200, // 댓글 리스트가 스크롤되도록 최대 높이 설정
  },
  commentContainer: {
    marginBottom: 20,
  },
  comment: {
    marginBottom: 10,
    backgroundColor: GRAY.BACKGROUND,
    borderRadius: 15,
    paddingVertical: 10,
    paddingHorizontal: 20,
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
  noComments: {
    fontSize: 14,
    color: GRAY.FONT,
    marginLeft: 20,
  },
  commentInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: GRAY.BACKGROUND,
    backgroundColor: WHITE, // 입력 영역의 배경색 설정
  },
  commentInput: {
    flex: 1,
    borderColor: '#ccc',
    borderWidth: 1,
    marginRight: 10,
    padding: 8,
    borderRadius: 5,
  },
});

export default DetailScreen;
