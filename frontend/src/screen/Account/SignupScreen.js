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
import ModalDropdown from 'react-native-modal-dropdown';
import apiClient from '../../api/api';

const SignupScreen = () => {
  const [name, setName] = useState('');
  const [studentId, setStudentId] = useState('');
  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [selectedLine, setSelectedLine] = useState(null);
  const [isDisabled, setIsDisabled] = useState(true);
  const [isStudentIdChecked, setIsStudentIdChecked] = useState(false); // 학번 중복 확인 상태

  const navigation = useNavigation();
  const step = 2;

  useEffect(() => {
    const validateForm = () => {
      if (
        name &&
        studentId &&
        nickname &&
        email &&
        password &&
        passwordConfirm &&
        selectedLine &&
        isStudentIdChecked
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
  ]);

  const handleRegister = async () => {
    if (!isStudentIdChecked) {
      Alert.alert('Error', '학번 중복 확인을 해주세요.');
      return;
    }

    if (password !== passwordConfirm) {
      Alert.alert('Error', '비밀번호가 일치하지 않습니다.');
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

    console.log('User Data to be sent:', userData);

    try {
      const result = await signUp(userData);
      navigation.navigate('MM');
    } catch (error) {
      console.log('Registration Error:', error.response?.data || error.message);
      Alert.alert(
        'Registration Error',
        error.response?.data?.message || 'Registration failed'
      );
    }
  };

  const handleCheckStudentId = async () => {
    try {
      const response = await apiClient.get(
        `/check-studentId?studentId=${studentId}`
      );

      if (response.data === true) {
        // 중복된 학번인 경우
        Alert.alert('', '이미 가입된 학번입니다.');
        setStudentId('');
        setIsStudentIdChecked(false);
      } else {
        // 사용 가능한 학번인 경우
        Alert.alert('', '사용 가능한 학번입니다.');
        setIsStudentIdChecked(true);
      }
    } catch (error) {
      console.error('Request failed:', error.message);
      Alert.alert('오류 발생', '학번 확인 중 문제가 발생했습니다.');
    }
  };

  // 학번이 변경되면 중복 확인 상태를 초기화
  const handleStudentIdChange = (text) => {
    setStudentId(text);
    setIsStudentIdChecked(false);
  };

  // 드롭다운 위치를 조정하는 함수
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
              placeholder=""
              style={styles.input}
            />
            <Input
              title={'학번*'}
              value={studentId}
              onChangeText={handleStudentIdChange}
              placeholder=""
              style={styles.input}
            />
            <RegistButton
              title="중복 확인"
              buttonType={studentId && !isStudentIdChecked ? 'PRIMARY' : 'GRAY'}
              onPress={handleCheckStudentId}
              disabled={!studentId || isStudentIdChecked}
            />

            <Input
              title={'닉네임*'}
              value={nickname}
              onChangeText={(text) => setNickname(text)}
              placeholder=""
              style={styles.input}
            />
            <Input
              title={'이메일*'}
              value={email}
              onChangeText={(text) => setEmail(text)}
              placeholder=""
              style={styles.input}
              keyboardType={keyboardTypes.EMAIL}
            />
            <Input
              title={'비밀번호*'}
              value={password}
              onChangeText={(text) => setPassword(text)}
              placeholder=""
              secureTextEntry
              style={styles.input}
            />
            <Input
              title={'비밀번호 확인*'}
              value={passwordConfirm}
              onChangeText={(text) => setPasswordConfirm(text)}
              placeholder=""
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
    backgroundColor: '#ffffff',
  },
  container1: {
    alignItems: 'center',
  },
  input: {
    width: '100%',
    height: 48,
    borderColor: '#EFEEEC',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 10,
    paddingHorizontal: 10,
    justifyContent: 'center',
  },
  box: {
    flex: 1,
    backgroundColor: 'white',
  },
  label: {
    fontSize: 14,
    marginBottom: 5,
    color: '#949089',
  },
  dropdown: {
    justifyContent: 'center',
  },
  dropdownText: {
    fontSize: 16,
    color: '#000',
  },
  dropdownStyle: {
    width: '80%',
  },
  dropdownTextStyle: {
    fontSize: 16,
    color: '#000',
  },
  dropdowncon: {
    marginTop: 5,
    marginHorizontal: 10,
  },
});

export default SignupScreen;
