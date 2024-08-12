import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { BLACK, GRAY, PRIMARY, WHITE } from '../../constant/color';
import { useAdminContext } from '../../context/AdminContext';

export const ButtonType = {
  PRIMARY: 'PRIMARY',
  GRAY: 'GRAY',
};
const StartTrackingButton = ({
  title,
  onPress,
  disabled,
  buttonType,
  height,
}) => {
  const colors = { PRIMARY, GRAY };
  const textColor = buttonType === ButtonType.PRIMARY ? WHITE : BLACK;
  const { isTracking } = useAdminContext();
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
        <View style={styles.img_contianer}>
          <Image
            source={require('../../../assets/busLogo.png')}
            style={styles.img}
          />
          <View style={styles.title_contianer}>
            <Text style={[styles.title, { color: textColor }]}>{title}</Text>
            <Text style={[styles.title, { color: textColor }]}>
              {isTracking ? '운행종료' : '운행시작'}
            </Text>
          </View>
        </View>
      </Pressable>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
    width: '100%',
    paddingHorizontal: 25,
    marginHorizontal: 5,
  },
  title: {
    color: '#000',
    fontSize: 30,
    fontWeight: 'bold',
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
});
export default StartTrackingButton;
