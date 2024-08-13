import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  View,
} from 'react-native';
import { WHITE } from '../../constant/color';
import Input, { keyboardTypes } from '../../components/Input';
import RegistButton, { ButtonType } from '../../components/RegistButton';
import apiClient from '../../api/api';
import { useNavigation } from '@react-navigation/native';

const ResetPasswordScreen = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  const onResetPassword = async () => {
    setLoading(true);
    try {
      await apiClient.post(`/send-email?email=${encodeURIComponent(email)}`);
      Alert.alert('', '이메일을 확인해주세요.', [
        {
          text: '확인',
          onPress: () => navigation.navigate('Login'),
        },
      ]);
    } catch (e) {
      Alert.alert('', '입력한 이메일을 확인해주세요.');
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
          title={'EMAIL'}
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
