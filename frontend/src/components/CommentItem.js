import React from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { WHITE, GRAY, BLACK } from '../constant/color';
import { Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CommentItem = ({ comment, onDelete }) => {
  const handleDeleteComment = async () => {
    try {
      const accessToken = await AsyncStorage.getItem('accessToken');

      if (!accessToken) {
        Alert.alert('오류', '로그인이 필요합니다.');
        return;
      }

      const response = await fetch(
        `http://i11b109.p.ssafy.io:8080/comments/${comment.commentId}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.ok) {
        Alert.alert('성공', '댓글이 성공적으로 삭제되었습니다!');
        onDelete(comment.commentId); // 삭제 후 콜백을 호출하여 부모 컴포넌트에 알림
      } else {
        const errorText = await response.text();
        Alert.alert('오류', `댓글 삭제 실패: ${errorText}`);
      }
    } catch (error) {
      console.error('댓글 삭제 중 에러:', error);
      Alert.alert('오류', `에러가 발생했습니다: ${error.message}`);
    }
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date)) {
        throw new Error('Invalid date');
      }
      return date.toLocaleString();
    } catch (error) {
      console.error('Invalid date format:', dateString);
      return '날짜 오류'; // 기본값을 설정
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.commentAuthor}>{comment.nickname || '익명'}</Text>
      <Text style={styles.commentText}>
        {comment.commentContent || '내용 없음'}
      </Text>
      <Text style={styles.commentDate}>{formatDate(comment.createDate)}</Text>
      <Button title="삭제" onPress={handleDeleteComment} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: GRAY.BACKGROUND,
  },
  commentAuthor: {
    fontSize: 14,
    color: GRAY.FONT,
    marginBottom: 5,
  },
  commentText: {
    fontSize: 16,
    color: BLACK,
    marginBottom: 10,
  },
  commentDate: {
    fontSize: 12,
    color: GRAY.FONT,
    marginBottom: 10,
  },
});

export default CommentItem;
