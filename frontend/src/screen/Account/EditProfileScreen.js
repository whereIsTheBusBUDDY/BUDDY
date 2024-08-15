import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  ImageBackground,
  TouchableOpacity,
  Alert,
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
  const [isNicknameChecked, setIsNicknameChecked] = useState(true); // 기본값을 true로 설정

  const handleSave = async () => {
    // 닉네임이 변경되었고, 중복 확인이 되지 않았다면 경고 메시지
    if (nickname !== profileData.닉네임 && !isNicknameChecked) {
      Alert.alert('', '닉네임 중복 확인을 해주세요.');
      return;
    }

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

  const handleCheckNickname = async () => {
    try {
      const response = await apiClient.get(
        `/check-nickname?nickname=${nickname}`
      );

      if (response.data === true) {
        Alert.alert('', '이미 사용 중인 닉네임입니다.');
        setNickname('');
        setIsNicknameChecked(false);
      } else {
        Alert.alert('', '사용 가능한 닉네임입니다.');
        setIsNicknameChecked(true);
      }
    } catch (error) {
      console.error('닉네임 중복 확인 중 오류 발생:', error.message);
    }
  };

  const handleNicknameChange = (text) => {
    setNickname(text);
    if (text !== profileData.닉네임) {
      setIsNicknameChecked(false); // 닉네임이 변경되었을 때만 중복 확인 필요
    } else {
      setIsNicknameChecked(true); // 원래 닉네임으로 돌아가면 중복 확인 필요 없음
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
              onChangeText={handleNicknameChange}
              style={styles.infoValue}
              placeholder="닉네임"
            />
            <TouchableOpacity
              style={[
                styles.button,
                nickname.trim() === '' || isNicknameChecked
                  ? styles.buttonDisabled
                  : {},
              ]}
              onPress={handleCheckNickname}
              disabled={nickname.trim() === '' || isNicknameChecked}
            >
              <Text style={styles.checkButtonText}>중복확인</Text>
            </TouchableOpacity>
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
          disabled={nickname !== profileData.닉네임 && !isNicknameChecked} // 닉네임이 변경된 경우 중복 확인이 완료되지 않으면 버튼 비활성화
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
    marginLeft: 45,
  },
  infoFixedValue: {
    flex: 1.3,
    fontSize: 14,
    color: GRAY.FONT,
  },
  checkButtonText: {
    color: WHITE,
    fontSize: 14,
    paddingVertical: 4,
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
  btn: {
    width: '100%',
  },
  button: {
    backgroundColor: PRIMARY.DEFAULT,
    justifyContent: 'center',
    // height: '40%',
    borderRadius: 10,
    paddingVertical: 1,
    paddingHorizontal: 10,
    marginLeft: 10,
  },
  buttonDisabled: {
    backgroundColor: GRAY.BTN,
  },
});

export default EditProfileScreen;
