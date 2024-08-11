import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import { PRIMARY, WHITE, GRAY } from '../../constant/color';
import { useUserContext } from '../../context/UserContext';
import { useFirstContext } from '../../context/FirstContent';
import Input, { keyboardTypes } from '../../components/Input';
import RegistButton, { ButtonType } from '../../components/RegistButton';
import { useEffect, useState } from 'react';
import { signIn } from '../../api/auth';
import { useNavigation } from '@react-navigation/native';

const LoginScreen = () => {
  const { setUser, setLoginUser } = useUserContext();
  const { setScreen } = useFirstContext();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [disabled, setDisabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    setDisabled(!email || !password);
  }, [email, password]);

  const onSubmit = async () => {
    if (!loading && !disabled) {
      Keyboard.dismiss();
      setLoading(true);

      try {
        const data = await signIn(email, password);
        setScreen(false);
        setLoginUser({ email, role: data.role });
      } catch (e) {
        Alert.alert('Login Error', e.message);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.avoid}
      behavior={Platform.select({ ios: 'padding' })}
    >
      <View style={styles.container}>
        <Input
          title={'Email'}
          placeholder={'이메일을 입력해주세요.'}
          keyboardType={keyboardTypes.EMAIL}
          value={email}
          secureTextEntry={false}
          onChangeText={(text) => setEmail(text.trim())}
        />
        <Input
          title={'Password'}
          placeholder={'비밀번호를 입력해주세요.'}
          keyboardType={keyboardTypes.DEFAULT}
          value={password}
          secureTextEntry={true}
          onChangeText={(text) => setPassword(text.trim())}
        />
        <RegistButton
          title={'로그인'}
          onPress={onSubmit}
          buttonType={ButtonType.PRIMARY}
          disabled={disabled}
        />

        <View style={styles.linkContainer}>
          <TouchableOpacity
            onPress={() => navigation.navigate('ResetPassword')}
          >
            <Text style={styles.linkText}>비밀번호 찾기</Text>
          </TouchableOpacity>
          <Text style={styles.linkDivider}></Text>
          <TouchableOpacity onPress={() => navigation.navigate('IDScreen')}>
            <Text style={styles.linkText}>
              아직 회원이 아니신가요?{' '}
              <Text style={styles.highlightText}>회원가입 바로가기</Text>
            </Text>
          </TouchableOpacity>
        </View>
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
  goLoginBtn: {
    backgroundColor: PRIMARY.DEFAULT,
    borderRadius: 8,
    padding: 10,
  },
  avoid: {
    flex: 1,
  },
  linkContainer: {
    // flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  linkText: {
    color: GRAY.DARK,
    fontSize: 14,
  },
  linkDivider: {
    marginHorizontal: 10,
    color: GRAY.DARK,
    fontSize: 14,
  },
  highlightText: {
    color: PRIMARY.DEFAULT,
  },
});

export default LoginScreen;
