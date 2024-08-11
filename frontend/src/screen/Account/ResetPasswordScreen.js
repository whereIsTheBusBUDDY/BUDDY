import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  View,
} from 'react-native';
import { PRIMARY, WHITE } from '../../constant/color';
import Input, { keyboardTypes } from '../../components/Input';
import RegistButton, { ButtonType } from '../../components/RegistButton';
import apiClient from '../../api/api';
import { useNavigation } from '@react-navigation/native';

const ResetPasswordScreen = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  const onResetPassword = async () => {
    if (!email) {
      Alert.alert('Error', '이메일을 입력해주세요.');
      return;
    }

    setLoading(true);
    try {
      await apiClient.post(
        `/reset-password?email=${encodeURIComponent(email)}`
      );
      Alert.alert(
        '임시 비밀번호 전송 완료',
        '전송된 임시 비밀번호로 로그인 후 마이페이지에서 비밀번호를 변경해주세요.',
        [
          {
            text: '확인',
            onPress: () => navigation.navigate('Login'), // 로그인 페이지로 이동
          },
        ]
      );
    } catch (e) {
      console.error('네트워크 오류:', e.message);
      Alert.alert('Error', '비밀번호 재설정 요청에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.avoid}
      behavior={Platform.select({ ios: 'padding' })}
    >
      <View style={styles.container}>
        <Input
          title={'이메일'}
          placeholder={'이메일을 입력해주세요.'}
          keyboardType={keyboardTypes.EMAIL}
          value={email}
          secureTextEntry={false}
          onChangeText={(text) => setEmail(text.trim())}
        />
        <RegistButton
          title={'임시 비밀번호 발급'}
          onPress={onResetPassword}
          buttonType={ButtonType.PRIMARY}
          disabled={!email || loading}
        />
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: WHITE,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  avoid: {
    flex: 1,
  },
});

export default ResetPasswordScreen;
