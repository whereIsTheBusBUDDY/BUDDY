import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import PropTypes from 'prop-types';
import { WHITE, BLACK, PRIMARY, GRAY } from '../constant/color';

export const ButtonColors = {
  ORANGE: 'ORANGE',
  GRAY: 'GRAY',
};

const Colors = {
  ORANGE: [PRIMARY.DEFAULT, PRIMARY.CLICK],
  GRAY: [GRAY.BACKGROUND, GRAY.BTN],
};

const getTextColor = (buttonColor) => {
  switch (buttonColor) {
    case ButtonColors.ORANGE:
      return WHITE;
    case ButtonColors.GRAY:
      return BLACK;
  }
};

const Button = ({
  title,
  onPress,
  buttonStyle,
  buttonColor = GRAY.BACKGROUND,
}) => {
  const titleColor = getTextColor(buttonColor);

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        { backgroundColor: Colors[buttonColor][0] },

        pressed && { backgroundColor: Colors[buttonColor][1] },
        buttonStyle,
      ]}
    >
      <View style={styles.content}>
        <Text style={[styles.contentText, { color: titleColor }]}>{title}</Text>
      </View>
    </Pressable>
  );
};

Button.propTypes = {
  title: PropTypes.string.isRequired,
  onPress: PropTypes.func.isRequired,
  buttonStyle: PropTypes.object,
  buttonColor: PropTypes.string,
};

const styles = StyleSheet.create({
  button: {
    color: GRAY.BTN,
    justifyContent: 'center',
    paddingHorizontal: 15,
    borderRadius: 15,
    marginBottom: 10,
    height: 50,
  },
  content: {
    alignItems: 'center',
  },
  contentText: {
    fontSize: 20,
  },
});

export default Button;
