import React from 'react';
import { Pressable, StyleSheet, Text, Image, View } from 'react-native';
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

const ImageButton = ({
  title,
  onPress,
  buttonStyle,
  buttonColor = ButtonColors.GRAY,
  width,
  height,
  textAlign = 'center',
  imageSource,
  imageWidth = 70,
  imageHeight = 70,
  titleFontSize = 12,
}) => {
  const titleColor = getTextColor(buttonColor);
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        { backgroundColor: Colors[buttonColor][0], width, height },
        pressed && { backgroundColor: Colors[buttonColor][1] },
        buttonStyle,
      ]}
    >
      <View style={styles.content}>
        {imageSource && (
          <Image
            source={imageSource}
            style={[styles.image, { width: imageWidth, height: imageHeight }]}
            resizeMode="contain"
          />
        )}
        <Text style={{ color: titleColor, textAlign, fontSize: titleFontSize }}>
          {title}
        </Text>
      </View>
    </Pressable>
  );
};

ImageButton.propTypes = {
  title: PropTypes.string.isRequired,
  onPress: PropTypes.func.isRequired,
  buttonStyle: PropTypes.object,
  buttonColor: PropTypes.oneOf(Object.values(ButtonColors)),
  width: PropTypes.number,
  height: PropTypes.number,

  textAlign: PropTypes.oneOf(['left', 'center', 'right']),
  imageSource: PropTypes.oneOfType([PropTypes.number, PropTypes.object]),
  imageWidth: PropTypes.number,
  imageHeight: PropTypes.number,
  titleFontSize: PropTypes.number,
};

const styles = StyleSheet.create({
  button: {
    justifyContent: 'center',
    paddingHorizontal: 15,
    borderRadius: 15,
    marginBottom: 10,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  image: {
    marginRight: 5,
  },
});

export default ImageButton;
