import { StyleSheet, Text, View, Button } from 'react-native';
import RegistButton, { ButtonType } from '../../components/RegistButton';
import { useNavigation } from '@react-navigation/native';
import AdminSelectButton from '../../components/AdminSelectButton';
import { useAdminContext } from '../../context/AdminContext';

const AdminSelectBusScreen = () => {
  const navigate = useNavigation();
  const { setBusNumber } = useAdminContext();
  const goMap = (title) => () => {
    setBusNumber(title);
    navigate.navigate('AdminMain');
  };
  return (
    <View style={styles.container}>
      <Text style={styles.description}>운행하실 버스 호차를 선택해주세요</Text>
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
      <Button
        title="게시판 보기"
        onPress={() => {
          navigate.navigate('Board');
        }}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  description: {
    fontSize: 20,
  },
});

export default AdminSelectBusScreen;
