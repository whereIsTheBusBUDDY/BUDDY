import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
  Pressable,
} from 'react-native';
import apiClient from '../../api/api';
import { useNavigation } from '@react-navigation/native';
import { BLACK, GRAY, PRIMARY, WHITE } from '../../constant/color';
import RegistButton from '../../components/RegistButton';

const ChangePasswordScreen = () => {
  const navigation = useNavigation();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isDisabled, setIsDisabled] = useState(true);

  useEffect(() => {
    const validateForm = () => {
      if (currentPassword && newPassword && confirmPassword) {
        setIsDisabled(false);
      } else {
        setIsDisabled(true);
      }
    };
    validateForm();
  }, [currentPassword, newPassword, confirmPassword]);

  const handleChangePassword = async () => {
    try {
      const response = await apiClient.post('/check-password', {
        password: currentPassword,
      });

      if (response.data === true) {
        if (newPassword !== confirmPassword) {
          Alert.alert('', '새 비밀번호가 일치하지 않습니다.');
          return;
        }

        await apiClient.put('/update-password', {
          password: newPassword,
        });

        Alert.alert(
          '',
          '비밀번호가 변경되었습니다.',
          [{ text: '확인', onPress: () => navigation.goBack() }]
        );
      } else {
        Alert.alert('', '현재 비밀번호가 올바르지 않습니다.');
      }
    } catch (error) {
      console.error(
        '비밀번호 변경 중 오류 발생:',
        error.response ? error.response.data : error.message
      );
    }
  };

  return (
    <SafeAreaView style={styles.safeContainer}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>현재 비밀번호</Text>
          <TextInput
            value={currentPassword}
            onChangeText={setCurrentPassword}
            secureTextEntry
            style={styles.input}
            placeholder="현재 비밀번호를 입력하세요"
            placeholderTextColor={GRAY.PLACEHOLDER}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>새 비밀번호</Text>
          <TextInput
            value={newPassword}
            onChangeText={setNewPassword}
            secureTextEntry
            style={styles.input}
            placeholder="새 비밀번호를 입력하세요"
            placeholderTextColor={GRAY.PLACEHOLDER}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>비밀번호 확인</Text>
          <TextInput
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            style={styles.input}
            placeholder="새 비밀번호를 다시 입력하세요"
            placeholderTextColor={GRAY.PLACEHOLDER}
          />
        </View>

        <RegistButton
          title={'비밀번호 변경'}
          buttonType="PRIMARY"
          onPress={handleChangePassword}
          height={63}
          disabled={isDisabled}
        />
        <Text style={styles.buttonText}>비밀번호 변경</Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: WHITE,
  },
  container: {
    padding: 20,
    justifyContent: 'center',
    // alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: GRAY.FONT,
    marginBottom: 20,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: GRAY.FONT,
    marginBottom: 5,
  },
  input: {
    backgroundColor: WHITE,
    padding: 15,
    borderRadius: 10,
    fontSize: 16,
    color: BLACK,
    borderWidth: 1,
    borderColor: GRAY.BTN,
  },
  button: {
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: WHITE,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ChangePasswordScreen;
