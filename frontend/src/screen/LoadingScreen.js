import { useNavigation } from '@react-navigation/native';
import { Image, StyleSheet, View } from 'react-native';

const LoadingPage = () => {
  const navigate = useNavigation();
  setTimeout(() => {
    navigate.navigate('introduce');
  }, 2000);
  return (
    <View style={styles.container}>
      <View style={styles.centerImageContainer}>
        <Image
          source={require('../../assets/file.png')}
          resizeMode="cover"
          style={styles.image}
        />
        <Image source={require('../../assets/busLogo.png')} />
      </View>
      <View style={styles.bottomImageContainer}>
        <Image source={require('../../assets/BUDDY.png')} />
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerImageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomImageContainer: {
    position: 'absolute',
    bottom: 50, // 하단 여백 조절
    width: '100%',
    alignItems: 'center',
  },
  image: {
    width: 200,
    height: 25,
  },
});
export default LoadingPage;
