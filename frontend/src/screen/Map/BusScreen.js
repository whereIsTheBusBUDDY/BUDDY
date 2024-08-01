import { StyleSheet, Text, View } from 'react-native';

const BusScreen = () => {
  return (
    <View style={styles.container}>
      <Text>BusScreen</Text>
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
});

export default BusScreen;
