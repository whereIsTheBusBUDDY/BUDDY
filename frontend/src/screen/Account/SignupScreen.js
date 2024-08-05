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

const SignupScreen = () => {
  const [name, setName] = useState('');
  const [studentId, setStudentId] = useState('');
  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [selectedLine, setSelectedLine] = useState(null);
  const [isDisabled, setIsDisabled] = useState(true); // 버튼 활성화 상태

  const navigation = useNavigation();
  const step = 2;

  useEffect(() => {
    // 유효성 검사 함수
    const validateForm = () => {
      if (
        name &&
        studentId &&
        nickname &&
        email &&
        password &&
        passwordConfirm &&
        selectedLine
      ) {
        setIsDisabled(false); // 모든 필드가 입력되면 버튼 활성화
      } else {
        setIsDisabled(true); // 하나라도 비어 있으면 버튼 비활성화
      }
    };

    validateForm(); // 유효성 검사 실행
  }, [
    name,
    studentId,
    nickname,
    email,
    password,
    passwordConfirm,
    selectedLine,
  ]);

  const handleRegister = async () => {
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
      favoriteLine: parseInt(selectedLine, 10), // favoriteLine을 정수형으로 변환
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

  // 드롭다운 위치를 조정하는 함수
  const adjustDropdownFrame = (frameStyle) => {
    const dropdownHeight = 150; // 드롭다운 메뉴의 높이 설정
    // 드롭다운이 화면 위로 열리도록 y 좌표를 조정
    const topPosition = frameStyle.y - dropdownHeight;
    return {
      ...frameStyle,
      y: topPosition < 0 ? frameStyle.y : topPosition, // 화면 밖으로 나가지 않도록 y를 조정
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
              onChangeText={(text) => setStudentId(text)}
              placeholder=""
              style={styles.input}
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
              value={passwordConfirm} // 비밀번호 확인 상태와 연결
              onChangeText={(text) => setPasswordConfirm(text)} // 비밀번호 확인 상태 변경
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
                adjustFrame={adjustDropdownFrame} // 위치 조정 함수 연결
              />
            </View>
            <View style={styles.container1}>
              <RegistButton
                title={step === 3 ? '완료' : '다음'}
                buttonType="PRIMARY"
                onPress={handleRegister}
                height={63}
                disabled={isDisabled} // 버튼 활성화 상태 적용
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
    marginBottom: 20,
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
