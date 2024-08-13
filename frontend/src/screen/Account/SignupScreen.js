import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Text,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Input, { keyboardTypes } from '../../components/SignupInput';
import RegistButton from '../../components/RegistButton';
import ProgressBar from '../../components/ProgressBar';
import { signUp } from '../../api/auth';
import apiClient from '../../api/api';
import InputWithButton from '../../components/InputWithButton';
import ModalDropdown from 'react-native-modal-dropdown';
import { GRAY, PRIMARY, WHITE, BLACK } from '../../constant/color';

const SignupScreen = () => {
  const [name, setName] = useState('');
  const [studentId, setStudentId] = useState('');
  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [selectedLine, setSelectedLine] = useState(null);
  const [isDisabled, setIsDisabled] = useState(true);
  const [isStudentIdChecked, setIsStudentIdChecked] = useState(false);
  const [isNicknameChecked, setIsNicknameChecked] = useState(false);
  const [emailError, setEmailError] = useState('');

  const navigation = useNavigation();
  const step = 2;

  useEffect(() => {
    const validateForm = () => {
      if (
        name &&
        studentId.length === 7 &&
        isStudentIdChecked &&
        nickname.trim() !== '' &&
        isNicknameChecked &&
        validateEmail(email) &&
        password &&
        passwordConfirm &&
        selectedLine
      ) {
        setIsDisabled(false);
      } else {
        setIsDisabled(true);
      }
    };

    validateForm();
  }, [
    name,
    studentId,
    nickname,
    email,
    password,
    passwordConfirm,
    selectedLine,
    isStudentIdChecked,
    isNicknameChecked,
  ]);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValid = emailRegex.test(email);
    setEmailError(isValid ? '' : '이메일 형식이 아닙니다.');
    return isValid;
  };

  const handleRegister = async () => {
    if (!isStudentIdChecked) {
      Alert.alert('', '학번 중복 확인을 해주세요.');
      return;
    }

    if (!isNicknameChecked) {
      Alert.alert('', '닉네임 중복 확인을 해주세요.');
      return;
    }

    if (password !== passwordConfirm) {
      Alert.alert('', '비밀번호가 일치하지 않습니다.');
      return;
    }

    const userData = {
      name,
      studentId,
      nickname,
      email,
      password,
      favoriteLine: parseInt(selectedLine, 10),
    };

    try {
      const result = await signUp(userData);
      navigation.navigate('MM');
    } catch (error) {
      Alert.alert('', '이미 가입된 이메일입니다.');
      console.log('Registration Error:', error.response?.data || error.message);
    }
  };

  const handleCheckStudentId = async () => {
    try {
      const response = await apiClient.get(
        `/check-studentId?studentId=${studentId}`
      );

      if (response.data === true) {
        Alert.alert('', '이미 가입된 학번입니다.');
        setStudentId('');
        setIsStudentIdChecked(false);
      } else {
        Alert.alert('', '사용 가능한 학번입니다.');
        setIsStudentIdChecked(true);
      }
    } catch (error) {
      console.error('Request failed:', error.message);
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
      console.error('Request failed:', error.message);
    }
  };

  const handleStudentIdChange = (text) => {
    const numericText = text.replace(/[^0-9]/g, '');
    setStudentId(numericText);
    setIsStudentIdChecked(false);
  };

  const handleNicknameChange = (text) => {
    setNickname(text);
    setIsNicknameChecked(false);
  };

  const adjustDropdownFrame = (frameStyle) => {
    const dropdownHeight = 150;
    const topPosition = frameStyle.y - dropdownHeight;
    return {
      ...frameStyle,
      y: topPosition < 0 ? frameStyle.y : topPosition,
      height: dropdownHeight,
    };
  };

  return (
    <SafeAreaView style={styles.box}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingContainer}
      >
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          <View style={styles.container}>
            <ProgressBar step={step} />
            <Input
              title={'이름*'}
              value={name}
              onChangeText={(text) => setName(text)}
              style={styles.input}
            />
            <InputWithButton
              title={'학번*'}
              buttonText="중복확인"
              value={studentId}
              onChangeText={handleStudentIdChange}
              onPress={handleCheckStudentId}
              keyboardType="numeric"
              maxLength={7}
              disabled={studentId.length !== 7 || isStudentIdChecked}
            />
            <InputWithButton
              title={'닉네임*'}
              buttonText="중복확인"
              value={nickname}
              onChangeText={handleNicknameChange}
              onPress={handleCheckNickname}
              keyboardType="default"
              disabled={nickname.trim() === '' || isNicknameChecked}
            />
            <Input
              title={'이메일*'}
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                validateEmail(text);
              }}
              style={styles.input}
              keyboardType={keyboardTypes.EMAIL}
            />
            {email && emailError ? (
              <Text style={styles.errorText}>{emailError}</Text>
            ) : null}
            <Input
              title={'비밀번호*'}
              value={password}
              onChangeText={(text) => setPassword(text)}
              secureTextEntry
              style={styles.input}
            />
            <Input
              title={'비밀번호 확인*'}
              value={passwordConfirm}
              onChangeText={(text) => setPasswordConfirm(text)}
              secureTextEntry
              style={styles.input}
            />
            <View style={styles.dropdowncon}>
              <Text style={styles.label}>선호하는 노선*</Text>
              <ModalDropdown
                options={['1호차', '2호차', '3호차', '4호차', '5호차', '6호차']}
                style={[styles.input, styles.dropdown]}
                textStyle={styles.dropdownText}
                dropdownStyle={styles.dropdownStyle}
                dropdownTextStyle={styles.dropdownTextStyle}
                defaultValue="노선을 선택하세요"
                onSelect={(index, value) => setSelectedLine(value)}
                adjustFrame={adjustDropdownFrame}
              />
            </View>
            <View style={styles.container1}>
              <RegistButton
                title={step === 3 ? '완료' : '다음'}
                buttonType="PRIMARY"
                onPress={handleRegister}
                height={63}
                disabled={isDisabled}
              />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  keyboardAvoidingContainer: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    padding: 20,
    width: '100%',
  },
  container1: {
    alignItems: 'center',
  },
  input: {
    width: '100%',
    height: 48,
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 10,
    paddingHorizontal: 10,
    justifyContent: 'center',
  },
  box: {
    flex: 1,
    backgroundColor: WHITE,
  },
  label: {
    marginLeft: 5,
    fontSize: 14,
    marginBottom: 5,
    color: GRAY.FONT,
  },
  errorText: {
    color: PRIMARY.DEFAULT,
    marginLeft: 15,
    fontSize: 12,
    marginBottom: 10,
  },
  dropdown: {
    justifyContent: 'center',
    borderColor: GRAY.DEFAULT,
  },
  dropdownText: {
    fontSize: 16,
    color: GRAY.FONT,
  },
  dropdownStyle: {
    width: '80%',
  },
  dropdownTextStyle: {
    fontSize: 16,
    color: GRAY.FONT,
  },
  dropdowncon: {
    marginTop: 5,
    marginHorizontal: 10,
    // borderColor: GRAY.DEFAULT,
  },
});

export default SignupScreen;
