import { useNavigation } from '@react-navigation/native';
import { ActivityIndicator, Image, StyleSheet, Text, View } from 'react-native';

const RenderingScreen = () => {
  const navigate = useNavigation();
  return (
    <View style={styles.container}>
      <View style={styles.centerImageContainer}>
        <Image
          source={require('../../../assets/busLogo.png')}
          style={styles.busImg}
        />
        <View style={styles.horizontal}>
          <Image
            source={require('../../../assets/loadingText.png')}
            style={styles.loadingText}
          />
          <ActivityIndicator size="large" color="#f97316" />
        </View>
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
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    width: 140,
    height: 60,
    marginRight: 15,
    resizeMode: 'contain',
  },
  busImg: {
    width: 160,
    height: 160,
    // marginRight: 15,
    resizeMode: 'contain',
  },
  horizontal: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    // padding: 10,
  },
});
export default RenderingScreen;
