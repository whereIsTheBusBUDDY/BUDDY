import { useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
} from 'react-native';
import { GRAY, PRIMARY, WHITE, BLACK } from '../constant/color';

const InputWithButton = ({
  title,
  buttonText,
  value,
  onChangeText,
  onPress,
  secureTextEntry = false,
  keyboardType,
  maxLength,
  disabled,
}) => {
  const [isFocus, setIsFocus] = useState(false);
  return (
    <View style={styles.outside}>
      <Text
        style={[
          styles.title,
          value && styles.hasValueTitle,
          isFocus && styles.focusedTitle,
        ]}
      >
        {title}
      </Text>
      <View style={styles.container}>
        <TextInput
          style={[
            styles.input,
            value && styles.hasValueInput,
            isFocus && styles.focusedInput,
          ]}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          maxLength={maxLength}
        />
        <TouchableOpacity
          style={[styles.button, disabled && styles.buttonDisabled]}
          onPress={onPress}
          disabled={disabled}
        >
          <Text style={styles.buttonText}>{buttonText}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  outside: {
    paddingHorizontal: 10,
    marginVertical: 5,
  },
  container: {
    flexDirection: 'row',
    width: '100%',
    paddingHorizontal: 20,
    marginVertical: 5,
    height: 48,
    borderColor: GRAY.DEFAULT,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    alignItems: 'center',
  },
  title: {
    color: GRAY.FONT,
    paddingLeft: 5,
    fontSize: 14,
  },
  input: {
    flex: 1,
    paddingHorizontal: 10,
  },
  button: {
    backgroundColor: PRIMARY.DEFAULT,
    justifyContent: 'center',
    height: '75%',
    borderRadius: 10,
    paddingVertical: 1,
    paddingHorizontal: 10,
    marginLeft: 10,
  },
  buttonDisabled: {
    backgroundColor: GRAY.BTN,
  },
  buttonText: {
    color: WHITE,
    fontSize: 16,
  },
});

export default InputWithButton;
