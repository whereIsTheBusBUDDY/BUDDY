import React from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
} from 'react-native';
import { GRAY, PRIMARY, WHITE } from '../constant/color';

const InputWithButton = ({
  placeholder,
  buttonText,
  value,
  onChangeText,
  onPress,
  secureTextEntry = false,
  keyboardType,
  maxLength,
  disabled,
}) => {
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder={placeholder}
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
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    height: 48,
    borderColor: GRAY.BTN,
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  input: {
    flex: 1,
    height: '100%',
  },
  button: {
    backgroundColor: PRIMARY.DEFAULT,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 15,
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
