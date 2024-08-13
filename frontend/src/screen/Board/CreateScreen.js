import React, { useState } from 'react';
import { View, TextInput, StyleSheet, ScrollView, Alert } from 'react-native';
import { WHITE, GRAY } from '../../constant/color';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Button, { ButtonColors } from '../../components/Button';
import { useNavigation } from '@react-navigation/native';
import { createBoard } from '../../api/user';

export default function App({ route }) {
  const [category, setCategory] = useState(route.params.selectedCategory);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const navigation = useNavigation();

  const handleSubmit = async () => {
    if (!title || !content) {
      Alert.alert('', '제목과 내용을 모두 입력해주세요.');
      return;
    }

    try {
      const accessToken = await AsyncStorage.getItem('accessToken');

      await createBoard(category, title, content, accessToken);
      Alert.alert('', '게시글이 성공적으로 작성되었습니다!');
      navigation.navigate('Board');
    } catch (error) {
      Alert.alert('', `게시글 작성 실패: ${error.message}`);
    }
  };

  return (
    <View style={styles.container}>
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
      <Button
        title="작성"
        onPress={handleSubmit}
        buttonColor={ButtonColors.SKYBLUE}
        buttonStyle={styles.createBtn}
      />
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
  createBtn: {
    marginTop: 10,
    width: '100%',
    color: WHITE,
  },
});
