import { StyleSheet, Text, View, ScrollView } from 'react-native';
import RegistButton, { ButtonType } from '../../components/RegistButton';
import { useNavigation } from '@react-navigation/native';
import AdminSelectButton from '../../components/AdminSelectButton';
import { useAdminContext } from '../../context/AdminContext';
import { PRIMARY, SKYBLUE } from '../../constant/color';
import { useUserContext } from '../../context/UserContext';
import { BASEurl } from '../../api/url';
import apiClient from '../../api/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AdminSelectBusScreen = () => {
  const navigate = useNavigation();
  const { setBusNumber, handleStopTracking } = useAdminContext();
  const { loginUser, setLoginUser } = useUserContext();

  const goMap = (title) => () => {
    setBusNumber(title);
    navigate.navigate('AdminMain');
  };

  const logout = async () => {
    handleStopTracking();
    try {
      const refreshToken = await AsyncStorage.getItem('refreshToken');
      console.log(refreshToken);
      if (refreshToken) {
        await apiClient.post(`/out?refreshToken=${refreshToken}`);
        console.log('로그아웃 요청 보냈음');
      }
      await AsyncStorage.removeItem('accessToken');
      await AsyncStorage.removeItem('refreshToken');
      await AsyncStorage.clear();

      setLoginUser(null);
    } catch (error) {
      console.error('로그아웃 중 오류 발생:', error.message, error.response);
    }
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <Text style={styles.description}>
          운행하실 버스 호차를 선택해주세요
        </Text>
        <View style={styles.buttonbox}>
          <AdminSelectButton
            title={'1호차'}
            onPress={goMap(1)}
            buttonType={ButtonType.GRAY}
            disabled={false}
          />
          <AdminSelectButton
            title={'2호차'}
            onPress={goMap(2)}
            buttonType={ButtonType.GRAY}
            disabled={false}
          />
          <AdminSelectButton
            title={'3호차'}
            onPress={goMap(3)}
            buttonType={ButtonType.GRAY}
            disabled={false}
          />
          <AdminSelectButton
            title={'4호차'}
            onPress={goMap(4)}
            buttonType={ButtonType.GRAY}
            disabled={false}
          />
          <AdminSelectButton
            title={'5호차'}
            onPress={goMap(5)}
            buttonType={ButtonType.GRAY}
            disabled={false}
          />
          <AdminSelectButton
            title={'6호차'}
            onPress={goMap(6)}
            buttonType={ButtonType.GRAY}
            disabled={false}
          />
        </View>
        <AdminSelectButton
          title="게시판 보기"
          onPress={() => {
            navigate.navigate('UserBoard');
          }}
          buttonType={ButtonType.PRIMARY}
          disabled={false}
        />
        <Text style={styles.logout} onPress={logout}>
          로그아웃
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    marginBottom: 30,
    paddingBottom: 30,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 15,
  },
  description: {
    fontSize: 20,
    marginBottom: 20,
  },
  buttonbox: {
    width: '100%',
    marginBottom: 20,
  },
  logout: {
    color: PRIMARY.BTN,
    fontWeight: 'bold',
    marginTop: 15,
    marginBottom: 35,
    fontSize: 18,
  },
});

export default AdminSelectBusScreen;
