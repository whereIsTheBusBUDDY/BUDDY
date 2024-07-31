import {
  TouchableOpacity,
  Text,
  StyleSheet,
  useWindowDimensions,
  View,
  Pressable,
} from 'react-native';
import { BLACK, PRIMARY, WHITE, GRAY } from '../constant/color';

const TabButton = ({ title, isActive, onPress }) => {
  const width = useWindowDimensions().width / 4;

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
    borderWidth: 1,
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

export default TabButton;
