import React, { useState } from 'react';
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

export default function App({ route }) {
  const [category, setcategory] = useState(route.params.selectedCategory);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  console.log(category);

  const handleSubmit = async () => {
    if (!title || !content) {
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
        `http://i11b109.p.ssafy.io:8080/board/${category}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`, // 액세스 토큰을 Authorization 헤더에 추가
          },
          body: JSON.stringify({
            title: title,
            content: content,
          }),
        }
      );

      if (response.ok) {
        Alert.alert('성공', '게시글이 성공적으로 작성되었습니다!');
        // 입력 필드 초기화
        setTitle('');
        setContent('');
      } else {
        Alert.alert('오류', `게시글 작성 실패: ${response.statusText}`);
      }
    } catch (error) {
      Alert.alert('오류', `에러가 발생했습니다: ${error.message}`);
    }
  };

  return (
    <View style={styles.container}>
      {/* 헤더 컴포넌트 수정 및 교체 */}
      <View style={styles.header}>
        <Button title="작성" onPress={handleSubmit} />
      </View>
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.titleContainer}>
          <TextInput
            style={styles.titleInput}
            placeholder="제목"
            value={title}
            onChangeText={setTitle}
          />
        </View>
        <View style={styles.textContainer}>
          <TextInput
            style={styles.textInput}
            placeholder="내용"
            multiline
            numberOfLines={10}
            value={content}
            onChangeText={setContent}
          />
        </View>
      </ScrollView>
    </View>
  );
}

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
