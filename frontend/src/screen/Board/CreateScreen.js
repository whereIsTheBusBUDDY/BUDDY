import React from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { BLACK, WHITE, SKYBLUE, GRAY } from '../../constant/color';

export default function App() {
  return (
    <View style={styles.container}>
      {/* header 컴포넌트 수정하고 바꾸기 */}
      <View style={styles.header}>
        <Text>{'< 글쓰기'}</Text>
        <Button title="작성" onPress={() => alert('작성 버튼 클릭')} />
      </View>
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.titleContainer}>
          <TextInput style={styles.titleInput} placeholder="제목" />
        </View>
        <View style={styles.textContainer}>
          <TextInput
            style={styles.textInput}
            placeholder="내용"
            multiline
            numberOfLines={10}
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
  writeContainer: {
    justifyContent: 'flex-start',
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
  titleInput: {},
  textContainer: {
    padding: 20,
  },
  textInput: {
    textAlignVertical: 'top',
  },
});
