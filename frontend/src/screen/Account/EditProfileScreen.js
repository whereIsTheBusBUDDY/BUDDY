import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  ImageBackground,
} from 'react-native';
import { BLACK, GRAY, WHITE } from '../../constant/color';
import Button, { ButtonColors } from '../../components/Button';
import apiClient from '../../api/api';
import { useNavigation } from '@react-navigation/native';
import ModalDropdown from 'react-native-modal-dropdown';

const EditProfileScreen = ({ route }) => {
  const { profileData } = route.params;
  const navigation = useNavigation(); // navigation 객체를 가져옴

  const [name, setName] = useState(profileData.이름);
  const [studentId, setStudentId] = useState(profileData.학번);
  const [email, setEmail] = useState(profileData.이메일);
  const [nickname, setNickname] = useState(profileData.닉네임);
  const [favoriteLine, setFavoriteLine] = useState(profileData.선호노선);
  const [password, setPassword] = useState(profileData.비밀번호);

  const handleSave = async () => {
    try {
      await apiClient.put('/members/me', {
        nickname,
        password,
        favoriteLine,
      });
      navigation.goBack(); // 수정 후 이전 화면으로 돌아가기
    } catch (error) {
      console.error('프로필 수정 중 오류 발생:', error);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <ImageBackground
        source={require('../../../assets/idcard.png')}
        style={styles.profileImage}
      >
        <TextInput
          value={name}
          onChangeText={setName}
          style={styles.imageTextInput}
          placeholder="이름"
        />
      </ImageBackground>
      <Text style={styles.infoText}>
        {name ? `${name}님, 안녕하세요!` : '안녕하세요!'}
      </Text>
      <View style={styles.infoContainer}>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>이름</Text>
          <Text>{name}</Text>
        </View>
        <View style={styles.separator} />
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>학번</Text>
          <Text>{studentId}</Text>
        </View>
        <View style={styles.separator} />
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>닉네임</Text>
          <TextInput
            value={nickname}
            onChangeText={setNickname}
            style={styles.infoValueInput}
            placeholder="닉네임"
          />
        </View>
        <View style={styles.separator} />
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>이메일</Text>
          <Text>{email}</Text>
        </View>
        <View style={styles.separator} />
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>선호노선</Text>
          <ModalDropdown
            options={['1호차', '2호차', '3호차', '4호차', '5호차', '6호차']}
            defaultValue={
              favoriteLine ? `${favoriteLine}` : '선호노선을 선택하세요'
            }
            onSelect={(index, value) =>
              setFavoriteLine(value.replace('호차', ''))
            }
            style={styles.dropdown}
            textStyle={styles.dropdownText}
            dropdownStyle={styles.dropdownStyle}
            dropdownTextStyle={styles.dropdownTextStyle}
          />
        </View>
        <View style={styles.separator} />
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>비밀번호</Text>
          <TextInput
            value={password}
            onChangeText={setPassword}
            style={styles.infoValueInput}
            placeholder="기존 비밀번호를 입력해주세요."
          />
        </View>
      </View>
      <Button
        title="저장하기"
        onPress={handleSave}
        buttonColor={ButtonColors.GRAY}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: WHITE,
    alignItems: 'left',
    paddingHorizontal: 20,
  },
  profileImage: {
    marginVertical: 30,
    width: '100%',
    height: 190,
  },
  infoContainer: {
    width: '100%',
    backgroundColor: WHITE,
    padding: 20,
    borderWidth: 1,
    borderColor: GRAY.BTN,
    borderRadius: 10,
    marginVertical: 20,
    marginBottom: 70,
    padding: 0,
  },
  infoText: {
    fontSize: 16,
    margin: 10,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'start',
    paddingVertical: 5,
    paddingHorizontal: 20,
    marginVertical: 8,
  },
  infoLabel: {
    flex: 0.7,
    fontSize: 14,
    color: GRAY.FONT,
  },
  infoValueInput: {
    flex: 1.3,
    fontSize: 14,
    color: BLACK,
    borderBottomColor: GRAY.BTN,
  },
  imageTextInput: {
    fontSize: 18,
    letterSpacing: 5,
    position: 'absolute',
    left: 150,
    top: 80,
    color: BLACK,
    borderBottomWidth: 1,
    borderBottomColor: GRAY.BTN,
  },
  separator: {
    height: 1,
    backgroundColor: GRAY.BTN,
  },
  dropdown: {
    flex: 1,
    padding: 10,
    backgroundColor: WHITE,
    borderColor: GRAY.BTN,
    borderWidth: 1,
    borderRadius: 5,
  },
  dropdownText: {
    fontSize: 14,
    color: BLACK,
  },
  dropdownStyle: {
    width: '80%',
  },
  dropdownTextStyle: {
    fontSize: 14,
    color: BLACK,
  },
});

export default EditProfileScreen;
