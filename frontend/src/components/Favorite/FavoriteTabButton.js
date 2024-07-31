import { Pressable, Text, StyleSheet, useWindowDimensions } from 'react-native';
import { PRIMARY, WHITE, GRAY } from '../../constant/color';

const FavoriteTabButton = ({ title, isActive, onPress }) => {
  const width = useWindowDimensions().width / 2;

  return (
    <Pressable
      style={[styles.tabButton, isActive && styles.activeTabButton, { width }]}
      onPress={onPress}
    >
      <Text
        style={[styles.tabButtonText, isActive && styles.activeTabButtonText]}
      >
        {title}
      </Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  tabButton: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
    backgroundColor: WHITE,
    marginHorizontal: 5,
    borderWsidth: 1,
    borderRadius: 20,
    borderColor: PRIMARY.DEFAULT,
  },
  activeTabButton: {
    borderColor: PRIMARY.DEFAULT,
    backgroundColor: PRIMARY.DEFAULT,
  },
  tabButtonText: {
    fontSize: 16,
    color: PRIMARY.DEFAULT,
  },
  activeTabButtonText: {
    color: WHITE,
  },
});

export default FavoriteTabButton;
