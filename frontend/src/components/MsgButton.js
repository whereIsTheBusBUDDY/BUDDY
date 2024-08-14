import { Pressable, StyleSheet, Text, View } from 'react-native';
import { GRAY, PRIMARY, WHITE } from '../constant/color';

export const ButtonType = {
  PRIMARY: 'PRIMARY',
  GRAY: 'GRAY',
  WHITE: 'WHITE',
};

const MsgButton = ({ title, onPress, buttonType }) => {
  const colors = { PRIMARY, GRAY };
  const textColor = buttonType === ButtonType.PRIMARY ? '#ffffff' : '#000000';
  return (
    <View>
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [
          styles.container,
          { backgroundColor: colors[buttonType].BTN },
          pressed && { backgroundColor: colors[buttonType].CLICK },
        ]}
      >
        <Text style={[styles.title, { color: textColor }]}>{title}</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 23,
    width: '100%',
    paddingHorizontal: 40,
    // marginHorizontal: 10,
    marginVertical: 15,
  },
  title: {
    fontSize: 27,
    fontWeight: 'bold',
    textAlignVertical: 'center',
  },
});

export default MsgButton;
