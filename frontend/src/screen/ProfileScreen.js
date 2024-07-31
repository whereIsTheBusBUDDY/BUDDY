import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ImageBackground,
} from 'react-native';
import { BLACK, GRAY, SKYBLUE, WHITE } from '../constant/color';
import Button, { ButtonColors } from '../components/Button';
import { useUserContext } from '../context/UserContext';

const ProfileScreen = () => {
  const { setLoginUser } = useUserContext();
  const logOut = () => {
    setLoginUser(null);
    console.log('로그아웃');
  };
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <ImageBackground
        source={require('../../assets/idcard.png')}
        style={styles.profileImage}
      >
        <Text style={styles.imageText}>김싸피</Text>
      </ImageBackground>
      <Text style={styles.infoText}>김싸피님, 안녕하세요!</Text>
      <View style={styles.infoContainer}>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>이름</Text>
          <Text style={styles.infoValue}>김싸피</Text>
        </View>
        <View style={styles.separator} />
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>학번</Text>
          <Text style={styles.infoValue}>1130123</Text>
        </View>
        <View style={styles.separator} />
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>닉네임</Text>
          <Text style={styles.infoValue}>사과</Text>
        </View>
        <View style={styles.separator} />
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>이메일</Text>
          <Text style={styles.infoValue}>kim@ssafy.com</Text>
        </View>
        <View style={styles.separator} />
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>선호노선</Text>
          <Text style={styles.infoValue}>1호차</Text>
        </View>
      </View>
      <Button
        title="수정하기"
        onPress={() => {}}
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
    padding: 20,
  },

  profileContainer: {
    alignItems: 'center',
    marginTop: 30,
  },
  profileImage: {
    marginTop: 50,
    marginVertical: 30,
    width: '100%',
    height: 190,
  },
  // profileName: {
  //   fontSize: 20,
  //   fontWeight: 'bold',
  //   marginTop: 10,
  // },
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
    // textAlign: 'left',
  },
  editButton: {
    width: '100%',
    padding: 15,
    backgroundColor: WHITE,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: SKYBLUE.FONT,
    borderRadius: 10,
  },
  editButtonText: {
    color: BLACK,
    fontSize: 16,
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
