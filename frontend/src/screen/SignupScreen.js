import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Input, { keyboardTypes } from '../components/SignupInput';
import RegistButton from '../components/RegistButton';
import ProgressBar from '../components/ProgressBar';
import { signUp } from '../api/auth';

const SignupScreen = () => {
  const [name, setName] = useState('');
  const [studentId, setStudentId] = useState('');
  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [favoriteLine, setFavoriteLine] = useState('');

  const navigation = useNavigation();
  const step = 2;

  const handleRegister = async () => {
    const userData = {
      name,
      studentId,
      nickname,
      email,
      password,
      favoriteLine,
    };

    console.log('User Data to be sent:', userData);

    try {
      const result = await signUp(userData);
      // Alert.alert('Success', '회원가입 성공!');
      navigation.navigate('MM');
    } catch (error) {
      console.log('Registration Error:', error.message);
      Alert.alert('Registration Error', error.message);
    }
  };

  return (
    <SafeAreaView style={styles.box}>
      <ScrollView>
        <View style={styles.container}>
          <ProgressBar step={step} />

          <View>
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
              placeholder=""
              secureTextEntry
              style={styles.input}
            />
            {/* <Dropdown title={'선호하는 노선*'} value={favoriteLine} onChange={value => setFavoriteLine(value)} /> */}

            <Input
              title={'선호노선*'}
              value={favoriteLine.toString()} // 숫자를 문자열로 변환
              onChangeText={(text) => {
                // 문자열을 숫자로 변환하고, 유효하지 않은 입력에 대해서는 기본값으로 처리
                const number = parseInt(text, 10);
                if (!isNaN(number)) {
                  setFavoriteLine(number);
                }
              }}
              placeholder="1~6호차 중 자주타는 노선을 입력해주세요"
              style={styles.input}
              keyboardType={keyboardTypes.NUMERIC}
            />
            <RegistButton
              title={step === 3 ? '완료' : '다음'}
              onPress={handleRegister}
              buttonType={'GRAY'}
              height={63}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    padding: 20,
    width: '100%',
    backgroundColor: '#ffffff',
  },
  input: {
    width: '100%',
    height: 48,
    borderColor: '#EFEEEC',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  button: {
    backgroundColor: '#e7e5e4',
    width: '100%',
    padding: 20,
    marginTop: 40,
    // textAlign: 'center',
    paddingHorizontal: 30,
    justifyContent: 'center',
  },
  box: {
    flex: 1,
    backgroundColor: 'white',
  },
});

export default SignupScreen;
