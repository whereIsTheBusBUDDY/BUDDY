import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  ImageBackground,
} from 'react-native';
import { BLACK, GRAY, PRIMARY, WHITE } from '../../constant/color';
import Button, { ButtonColors } from '../../components/Button';
import apiClient from '../../api/api';
import { useNavigation } from '@react-navigation/native';
import DropdownBus from '../../components/Dropdown/DropdownBus';

const EditProfileScreen = ({ route }) => {
  const { profileData } = route.params;
  const navigation = useNavigation();

  const name = profileData.이름;
  const studentId = profileData.학번;
  const email = profileData.이메일;
  const [nickname, setNickname] = useState(profileData.닉네임);
  const [favoriteLine, setFavoriteLine] = useState(profileData.선호노선);

  const handleSave = async () => {
    try {
      const updatedNickName = nickname || profileData.닉네임;
      const updatedFavoriteLine = favoriteLine.replace('호차', '');

      await apiClient.put('/members/me', {
        nickname: updatedNickName,
        favoriteLine: updatedFavoriteLine,
      });
      navigation.goBack();
    } catch (error) {
      console.error('프로필 수정 중 오류 발생:', error);
    }
  };

  return (
    <SafeAreaView style={styles.safeContainer}>
      <ScrollView contentContainerStyle={styles.container}>
        <ImageBackground
          source={require('../../../assets/idcard.png')}
          style={styles.profileImage}
        >
          <Text style={styles.imageText}>
            {profileData.이름 || '이름 없음'}
          </Text>
        </ImageBackground>
        <Text style={styles.infoText}>
          {profileData.이름
            ? `${profileData.이름}님, 안녕하세요!`
            : '안녕하세요!'}
        </Text>
        <View style={styles.infoContainer}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>이름</Text>
            <Text style={styles.infoFixedValue}>{name}</Text>
          </View>
          <View style={styles.separator} />
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>학번</Text>
            <Text style={styles.infoFixedValue}>{studentId}</Text>
          </View>
          <View style={styles.separator} />
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>닉네임</Text>
            <TextInput
              value={nickname}
              onChangeText={setNickname}
              style={styles.infoValue}
              placeholder="닉네임"
            />
          </View>
          <View style={styles.separator} />
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>이메일</Text>
            <Text style={styles.infoFixedValue}>{email}</Text>
          </View>
          <View style={styles.separator} />
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>선호노선</Text>
            <DropdownBus
              selectedValue={favoriteLine} // 선택한 값을 상태로 유지
              onChangeValue={setFavoriteLine} // 선택 시 상태 업데이트
              backgroundColor={WHITE}
              color={PRIMARY.DEFAULT}
              style={styles.dropdown}
            />
          </View>
        </View>
        <Button
          title="저장하기"
          onPress={handleSave}
          buttonColor={ButtonColors.GRAY}
          buttonStyle={styles.btn}
        />
        <Button
          title="비밀번호 수정"
          onPress={() => {
            navigation.navigate('ChangePassword');
          }}
          buttonColor={ButtonColors.ORANGE}
          buttonStyle={styles.btn}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeContainer: {
    backgroundColor: WHITE,
    height: '100%',
  },
  container: {
    backgroundColor: WHITE,
    paddingHorizontal: 20,
  },
  profileImage: {
    marginTop: 10,
    marginBottom: 10,
    width: '100%',
    height: 210,
  },
  infoContainer: {
    width: '100%',
    backgroundColor: WHITE,
    padding: 20,
    borderWidth: 1,
    borderColor: GRAY.BTN,
    borderRadius: 10,
    marginVertical: 20,
    marginBottom: 30,
    padding: 0,
  },
  infoText: {
    fontSize: 16,
    margin: 10,
  },
  infoRow: {
    flexDirection: 'row',
    paddingVertical: 5,
    paddingHorizontal: 20,
    marginVertical: 8,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  infoLabel: {
    flex: 0.7,
    fontSize: 14,
    color: GRAY.FONT,
  },
  infoValue: {
    flex: 1.3,
    fontSize: 14,
    color: PRIMARY.DEFAULT,
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
    alignSelf: 'flex-start',
  },
  imageText: {
    left: 150,
    top: 80,
    fontSize: 18,
    letterSpacing: 5,
  },
  infoFixedValue: {
    flex: 1.3,
    fontSize: 14,
    color: GRAY.FONT,
  },
  btn: {
    width: '100%',
  },
});

export default EditProfileScreen;
