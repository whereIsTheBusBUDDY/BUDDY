import { View, Text, StyleSheet } from 'react-native';
import { BLACK } from '../constant/color';

const Pagename = ({ title }) => {
  return (
    <View>
      <Text style={styles.page}>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  page: {
    fontSize: 20,
    color: BLACK,
    fontWeight: 'bold',
    marginTop: 45,
    marginBottom: 20,
    marginHorizontal: 20,
  },
});

export default Pagename;
