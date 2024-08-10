import React, { useState, useEffect } from 'react';
import {
  View,
  TextInput,
  Button,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { WHITE, GRAY } from '../../constant/color';
import AsyncStorage from '@react-native-async-storage/async-storage';

const EditScreen = ({ route, navigation }) => {
  const { board } = route.params; // 전달받은 게시글 정보
  const [title, setTitle] = useState('');
  const [boardContent, setBoardContent] = useState(''); // 변수 이름 변경

  useEffect(() => {
    if (board) {
      setTitle(board.title); // 게시글의 제목 설정
      setBoardContent(board.boardContent); // 게시글의 내용 설정
    }
  }, [board]); // board가 변경될 때마다 실행

  const handleSubmit = async () => {
    if (!title || !boardContent) {
      Alert.alert('오류', '제목과 내용을 모두 입력하세요.');
      return;
    }

    try {
      // AsyncStorage에서 액세스 토큰 불러오기
      const accessToken = await AsyncStorage.getItem('accessToken');

      if (!accessToken) {
        console.error('Access token is missing');
        return;
      }

      const response = await fetch(
        `http://i11b109.p.ssafy.io:8080/board/${board.boardId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`, // 액세스 토큰을 Authorization 헤더에 추가
          },
          body: JSON.stringify({
            title: title,
            content: boardContent, // 변수 이름 변경
          }),
        }
      );

      if (response.ok) {
        Alert.alert('성공', '게시글이 성공적으로 수정되었습니다!');
        // 수정이 완료되면 DetailScreen으로 수정된 데이터를 전달하여 이동
        navigation.navigate('Board');
      } else {
        Alert.alert('오류', `게시글 수정 실패: ${response.statusText}`);
      }
    } catch (error) {
      Alert.alert('오류', `에러가 발생했습니다: ${error.message}`);
    }
  };

  return (
    <View style={styles.container}>
      {/* 헤더 컴포넌트 수정 및 교체 */}
      <View style={styles.header}>
        <Button title="수정 완료" onPress={handleSubmit} />
      </View>
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.titleContainer}>
          <TextInput
            style={styles.titleInput}
            value={title}
            onChangeText={setTitle}
          />
        </View>
        <View style={styles.textContainer}>
          <TextInput
            style={styles.textInput}
            multiline
            numberOfLines={10}
            value={boardContent} // 변수 이름 변경
            onChangeText={setBoardContent} // 변수 이름 변경
          />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: WHITE,
    padding: 20,
  },
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: GRAY.BACKGROUND,
    borderRadius: 15,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
  },
  titleContainer: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: WHITE,
  },
  titleInput: {
    fontSize: 16,
  },
  textContainer: {
    padding: 20,
  },
  textInput: {
    textAlignVertical: 'top',
    fontSize: 16,
  },
});

export default EditScreen;
