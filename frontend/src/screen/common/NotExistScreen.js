import { useNavigation } from '@react-navigation/native';
import { Image, StyleSheet, Text, View } from 'react-native';

const NotExistScreen = ({ busNumber }) => {
  const navigate = useNavigation();
  return (
    <View style={styles.container}>
      <View style={styles.centerImageContainer}>
        <Image
          source={require('../../../assets/busLogo.png')}
          style={styles.busImg}
        />
        <Text style={styles.loadingText}>
          {busNumber}호차는
          {'\n'}
          현재 운행중이 아닙니다.
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  centerImageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontWeight: '900',
    color: 'black',
    fontSize: 20,
    textAlign: 'center', // 텍스트를 각 줄에서 가운데 정렬
    marginTop: 10, // 이미지와 텍스트 사이의 간격을 조정
  },
  busImg: {
    width: 160,
    height: 160,
    resizeMode: 'contain',
  },
});

export default NotExistScreen;
