import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ImageBackground,
} from 'react-native';
import { BLACK, GRAY, WHITE } from '../../constant/color';
import Button, { ButtonColors } from '../../components/Button';
import { useUserContext } from '../../context/UserContext';
import apiClient from '../../api/api';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ProfileScreen = () => {
  const [profileData, setProfileData] = useState({});
  const { setLoginUser } = useUserContext();
  const navigation = useNavigation();

  const fetchProfileData = async () => {
    try {
      const response = await apiClient.get('/members/me'); // API 호출
      const mappedData = mapProfileData(response.data); // 데이터 가공
      setProfileData(mappedData); // 응답 데이터를 상태에 저장
      console.log(response.data);
    } catch (error) {
      console.error('프로필 정보를 가져오는 중 오류 발생:', error);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchProfileData(); // 화면에 포커스될 때 데이터를 새로 고침
    }, [])
  );

  const mapProfileData = (data) => {
    return {
      이름: data.name,
      학번: data.studentId,
      이메일: data.email,
      닉네임: data.nickname,
      선호노선: `${data.favoriteLine}호차`,
    };
  };

  const logOut = async () => {
    try {
      // Refresh 토큰을 서버로 보내 로그아웃 요청 - 로그아웃 api 생기나?
      // const refreshToken = await AsyncStorage.getItem('refreshToken');
      // if (refreshToken) {
      //   await apiClient.post('/logout', { token: refreshToken });
      // }

      // 클라이언트에 저장된 Access 토큰과 Refresh 토큰 삭제
      await AsyncStorage.removeItem('authToken');
      await AsyncStorage.removeItem('refreshToken');

      // 사용자 상태 초기화
      setLoginUser(null);

      // 로그인 화면으로 이동
      navigation.navigate('');
    } catch (error) {
      console.error('로그아웃 중 오류 발생:', error);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <ImageBackground
        source={require('../../../assets/idcard.png')}
        style={styles.profileImage}
      >
        <Text style={styles.imageText}>{profileData.이름 || '이름 없음'}</Text>
      </ImageBackground>
      <Text style={styles.infoText}>
        {profileData.이름
          ? `${profileData.이름}님, 안녕하세요!`
          : '안녕하세요!'}
      </Text>
      <View style={styles.infoContainer}>
        {Object.entries(profileData).map(([key, value]) => (
          <View style={styles.infoRow} key={key}>
            <Text style={styles.infoLabel}>{key}</Text>
            <Text style={styles.infoValue}>{value || '정보 없음'}</Text>
          </View>
        ))}
      </View>
      <Button
        title="수정하기"
        onPress={() => navigation.navigate('EditProfile', { profileData })}
        buttonColor={ButtonColors.GRAY}
      />
      <Button
        title="로그아웃"
        onPress={logOut}
        buttonColor={ButtonColors.ORANGE}
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
  infoValue: {
    flex: 1.3,
    fontSize: 14,
    color: BLACK,
  },
  imageText: {
    left: 150,
    top: 80,
    fontSize: 18,
    letterSpacing: 5,
  },
  separator: {
    height: 1,
    backgroundColor: GRAY.BTN,
  },
});

export default ProfileScreen;
