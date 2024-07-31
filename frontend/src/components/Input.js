import { StyleSheet, Text, View, TextInput } from 'react-native';
import PropTypes from 'prop-types';
import { useState } from 'react';
import { BLACK, GRAY, PRIMARY } from '../constant/color';

export const keyboardTypes = {
  DEFAULT: 'default',
  EMAIL: 'email-address',
};
export const ReturnKeyTypes = {
  DONE: 'done',
  NEXT: 'next',
};

const Input = ({
  title,
  placeholder,
  keyboardType,
  value,
  onChangeText,
  secureTextEntry,
  ...props
}) => {
  const [isFocus, setIsFocus] = useState(false);
  return (
    <View style={styles.container}>
      <Text
        style={[
          styles.title,
          value && styles.hasValueTitle,
          isFocus && styles.focusedTitle,
        ]}
      >
        {title}
      </Text>

      <TextInput
        {...props}
        style={[
          styles.input,
          value && styles.hasValueInput,
          isFocus && styles.focusedInput,
        ]}
        placeholder={placeholder ?? title}
        placeholderTextColor={GRAY.FONT}
        autoCapitalize={'none'}
        autoCorrect={false}
        textContentType={'none'}
        keyboardType={keyboardType}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        onBlur={() => setIsFocus(false)}
        onFocus={() => setIsFocus(true)}
      />
    </View>
  );
};

Input.propTypes = {
  title: PropTypes.string,
  placeholder: PropTypes.string,
  keyboardType: PropTypes.oneOf(Object.values(keyboardTypes)),
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingHorizontal: 10,
    marginVertical: 5,
  },
  title: {
    marginBottom: 5,
    color: GRAY.FONT,
    paddingLeft: 5,
    fontSize: 14,
    // paddingBottom: 3,
  },
  input: {
    borderColor: GRAY.BTN,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 20,
    height: 50,
  },
  hasValueInput: {
    borderWidth: 1,
    boaderColor: PRIMARY.DEFAULT,
    color: BLACK,
  },
  hasValueTitle: {
    color: BLACK,
  },
  focusedInput: {
    borderWidth: 2,
    borderColor: PRIMARY.DEFAULT,
    color: BLACK,
  },
  focusedTitle: {
    color: PRIMARY.DEFAULT,
    fontWeight: '600',
  },
  notFocusInput: {},
});

export default Input;
