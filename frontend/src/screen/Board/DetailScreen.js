import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  Button,
  TextInput,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { BLACK, WHITE, SKYBLUE, GRAY, PRIMARY } from '../../constant/color';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import CommentItem from '../../components/CommentItem';

const DetailScreen = ({ route }) => {
  const [board, setBoard] = useState(route.params.board);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState((board.comments || []).reverse()); // 댓글 상태 추가
  const navigation = useNavigation();

  useFocusEffect(
    useCallback(() => {
      // 페이지가 포커스될 때마다 게시글 정보 업데이트
      const updatedBoard = route.params.board;
      if (updatedBoard) {
        setBoard(updatedBoard);
        setComments((updatedBoard.comments || []).reverse()); // 최신 댓글이 위로 오도록 역순 정렬
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
          nickname: '익명', // 임시 닉네임
        };
        setComments((prevComments) => [newComment, ...prevComments]); // 새로운 댓글을 맨 앞에 추가
        setComment(''); // 입력 필드를 초기화합니다.
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
    setComments((prevComments) =>
      prevComments.filter((comment) => comment.commentId !== deletedCommentId)
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
                작성자: {board.memberID}{' '}
                {new Date(board.createDate).toLocaleString()}
              </Text>
            </View>
            <View style={styles.contentContainer}>
              <Text style={styles.boardContent}>{board.boardContent}</Text>
            </View>
          </View>
          <Button title="삭제" color="red" onPress={handleDeleteBoard} />
          <Button
            title="수정"
            color="blue"
            onPress={() => navigation.navigate('Edit', { board })}
          />
          {board.category === 'free' && (
            <>
              <Text style={styles.commentTitle}>댓글</Text>
              <View style={styles.commentContainer}>
                {comments.length > 0 ? (
                  comments.map((comment) => (
                    <CommentItem
                      key={comment.commentId}
                      comment={comment}
                      onDelete={handleCommentDelete}
                    />
                  ))
                ) : (
                  <Text style={styles.noComments}>댓글이 없습니다.</Text>
                )}
              </View>
            </>
          )}
        </ScrollView>
        {board.category === 'free' && (
          <View style={styles.commentInputContainer}>
            <TextInput
              style={styles.commentInput}
              placeholder="댓글을 입력해주세요!"
              value={comment}
              onChangeText={setComment}
            />
            <Button title="작성" onPress={handleCommentSubmit} />
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
  innerContainer: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20, // 스크롤 가능한 영역 확보를 위해 여백 추가
    marginBottom: 10, // 추가 여백
  },
  noticeContainer: {
    minHeight: '60%',
    backgroundColor: PRIMARY.BACKGROUND,
    borderRadius: 15,
    marginBottom: 15,
  },
  noticeFullHeight: {
    minHeight: '100%',
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
    fontWeight: '600',
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
