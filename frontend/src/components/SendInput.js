import React from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
} from 'react-native';
import { WHITE, GRAY, PRIMARY } from '../constant/color';

const SendInput = ({
  placeholder,
  buttonText,
  value,
  onChangeText,
  onPress,
}) => {
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
      />
      <TouchableOpacity style={styles.sendButton} onPress={onPress}>
        <Text style={styles.sendButtonText}>{buttonText}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
    padding: 3,
    borderRadius: 15,
    backgroundColor: GRAY.BACKGROUND,
  },
  input: {
    flex: 1,
    height: 40,
    borderRadius: 15,
    backgroundColor: GRAY.BACKGROUND,
    paddingHorizontal: 10,
  },
  sendButton: {
    backgroundColor: PRIMARY.DEFAULT,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 15,
    zIndex: 1,
  },
  sendButtonText: {
    color: WHITE,
    fontWeight: 'bold',
  },
});

export default SendInput;
