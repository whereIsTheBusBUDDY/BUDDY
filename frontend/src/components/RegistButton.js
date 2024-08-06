import { Pressable, StyleSheet, Text, View } from 'react-native';
import { BLACK, GRAY, PRIMARY, WHITE } from '../constant/color';

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
        <Text
          style={[
            styles.title,
            buttonType === ButtonType.PRIMARY && { color: WHITE },
            disabled && { color: GRAY.TEXT }, // 버튼이 비활성화될 때 텍스트 색상 변경 (옵션)
          ]}
        >
          {title}
        </Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 15,
    width: '100%',
    paddingHorizontal: 10,
  },
  title: {
    color: BLACK,
    fontSize: 18,
  },
});

export default RegistButton;
