import { Pressable, StyleSheet, Text, View } from 'react-native';
import { BLACK, GRAY, PRIMARY, WHITE } from '../../constant/color';

export const ButtonType = {
  PRIMARY: 'PRIMARY',
  GRAY: 'GRAY',
};
const AdminMainButton = ({ title, onPress, disabled, buttonType, height }) => {
  const colors = { PRIMARY, GRAY };
  const textColor = buttonType === ButtonType.PRIMARY ? WHITE : BLACK;
  return (
    <View style={[styles.container]}>
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [
          styles.container,
          { height: height },
          { backgroundColor: colors[buttonType].DEFAULT },
          pressed && { backgroundColor: colors[buttonType].CLICK },
        ]}
        disabled={disabled}
      >
        <Text style={[styles.title, { color: textColor }]}>{title}</Text>
      </Pressable>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
    width: '100%',
    paddingHorizontal: 25,
    marginHorizontal: 5,
  },
  title: {
    color: BLACK,
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 20,
  },
});
export default AdminMainButton;
