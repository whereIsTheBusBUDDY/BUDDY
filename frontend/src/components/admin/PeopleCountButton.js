import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { BLACK, GRAY, PRIMARY, WHITE } from '../../constant/color';

export const ButtonType = {
  PRIMARY: 'PRIMARY',
  GRAY: 'GRAY',
};
const PeopleCountButton = ({
  title,
  onPress,
  disabled,
  buttonType,
  height,
  value,
}) => {
  const colors = { PRIMARY, GRAY };
  const textColor = buttonType === ButtonType.PRIMARY ? WHITE : BLACK;
  return (
    <View style={[styles.container]}>
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [
          styles.button,
          { height: height },
          { backgroundColor: colors[buttonType].DEFAULT },
          pressed && { backgroundColor: colors[buttonType].CLICK },
        ]}
        disabled={disabled}
      >
        <View style={styles.img_contianer}>
          <View style={styles.title_contianer}>
            <Text style={[styles.title, { color: textColor }]}>{title}</Text>
            <Text style={[styles.count, { color: PRIMARY.DEFAULT }]}>
              {`${value}명`}
            </Text>
          </View>
        </View>
      </Pressable>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
    width: '100%',
    paddingHorizontal: 25,
    marginHorizontal: 5,
  },
  button: {
    // height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    width: '100%',
    height: '100%',
  },
  title: {
    color: '#000',
    fontSize: 23,
    fontWeight: '700',
    justifyContent: 'center',
  },
  img_contianer: {
    // alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  img: {
    width: 110,
    height: 90,
    resizeMode: 'cover',
    marginRight: 20,
  },
  title_contianer: {
    alignItems: 'center',
  },
  count: {
    fontSize: 46,
    fontWeight: 'bold',
    marginTop: 10,
  },
});
export default PeopleCountButton;
