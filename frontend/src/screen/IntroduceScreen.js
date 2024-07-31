import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { BLACK, GRAY, PRIMARY, WHITE } from '../constant/color';
import { useNavigation } from '@react-navigation/native';
import { useFirstContext } from '../context/FirstContent';

const IntroduceScreen = () => {
  const navigate = useNavigation();
  const { screen, setScreen } = useFirstContext();
  return (
    <View style={styles.container}>
      <Text>소개 페이지</Text>
      <Pressable style={styles.goLoginBtn}>
        <Text
          style={{ color: BLACK }}
          onPress={() => navigate.navigate('IDScreen')}
        >
          회원가입 하러가기
        </Text>
      </Pressable>
      <Pressable style={styles.goLoginBtn}>
        <Text
          style={{ color: BLACK }}
          onPress={() => {
            navigate.navigate('Login');
            setScreen(false);
          }}
        >
          로그인 하러가기
        </Text>
      </Pressable>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  goLoginBtn: {
    backgroundColor: GRAY.BTN,
    borderRadius: 8,
    padding: 10,
  },
});
export default IntroduceScreen;
