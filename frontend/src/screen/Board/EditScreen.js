import React, { useState, useEffect } from 'react';
import { View, TextInput, StyleSheet, ScrollView, Alert } from 'react-native';
import { WHITE, GRAY } from '../../constant/color';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Button, { ButtonColors } from '../../components/Button';
import { updateBoard } from '../../api/user';

const EditScreen = ({ route, navigation }) => {
  const { board } = route.params;
  const [title, setTitle] = useState('');
  const [boardContent, setBoardContent] = useState('');

  useEffect(() => {
    if (board) {
      setTitle(board.title);
      setBoardContent(board.boardContent);
    }
  }, [board]);

  const handleSubmit = async () => {
    if (!title || !boardContent) {
      Alert.alert('오류', '제목과 내용을 모두 입력하세요.');
      return;
    }

    try {
      const accessToken = await AsyncStorage.getItem('accessToken');

      if (!accessToken) {
        console.error('Access token is missing');
        return;
      }

      await updateBoard(board.boardId, title, boardContent, accessToken);
      Alert.alert('성공', '게시글이 성공적으로 수정되었습니다!');
      navigation.navigate('Board');
    } catch (error) {
      Alert.alert('오류', `게시글 수정 실패: ${error.message}`);
    }
  };

  return (
    <View style={styles.container}>
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
            value={boardContent}
            onChangeText={setBoardContent}
          />
        </View>
      </ScrollView>

      <Button
        title="수정 완료"
        onPress={handleSubmit}
        buttonColor={ButtonColors.SKYBLUE}
        buttonStyle={styles.createBtn}
      />
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
  createBtn: {
    marginTop: 10,
    width: '100%',
    color: WHITE,
  },
});

export default EditScreen;
