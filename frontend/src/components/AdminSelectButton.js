import { Pressable, StyleSheet, Text, View } from 'react-native';
import { BLACK, GRAY, PRIMARY, WHITE } from '../constant/color';

export const ButtonType = {
  PRIMARY: 'PRIMARY',
  GRAY: 'GRAY',
};

const AdminSelectButton = ({ title, onPress, disabled, buttonType }) => {
  // 버튼 타입에 따른 배경색 및 텍스트 색상 결정
  const backgroundColor =
    buttonType === ButtonType.PRIMARY ? PRIMARY.BTN : GRAY.BTN;

  const titleColor = buttonType === ButtonType.PRIMARY ? WHITE : BLACK;

  const pressedBackgroundColor =
    buttonType === ButtonType.PRIMARY ? PRIMARY.CLICK : GRAY.CLICK;

  return (
    <View style={styles.container}>
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [
          styles.container,
          {
            backgroundColor: pressed ? pressedBackgroundColor : backgroundColor,
          },
        ]}
        disabled={disabled}
      >
        <Text style={[styles.title, { color: titleColor }]}>{title}</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 25,
    marginVertical: 5,
  },
  title: {
    fontSize: 20,
    paddingVertical: 22,
  },
});

export default AdminSelectButton;
