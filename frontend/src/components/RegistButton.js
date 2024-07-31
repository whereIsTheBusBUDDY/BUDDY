import { Pressable, StyleSheet, Text, View } from 'react-native';
import { GRAY, PRIMARY, WHITE } from '../constant/color';

export const ButtonType = {
  PRIMARY: 'PRIMARY',
  GRAY: 'GRAY',
};
const RegistButton = ({ title, onPress, disabled, buttonType }) => {
  const colors = { PRIMARY, GRAY };
  return (
    <View style={styles.container}>
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [
          styles.container,
          { backgroundColor: colors[buttonType].BTN },
          pressed && { backgroundColor: colors[buttonType].CLICK },
          disabled && { backgroundColor: GRAY.BTN },
        ]}
        disabled={disabled}
      >
        <Text style={styles.title}>{title}</Text>
      </Pressable>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 15,
    width: '100%',
    paddingHorizontal: 10,
    marginHorizontal: 10,
  },
  title: {
    color: '#000000',
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 20,
  },
});
export default RegistButton;
