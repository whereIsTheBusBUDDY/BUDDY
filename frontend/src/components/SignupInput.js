import { StyleSheet, Text, View, TextInput } from 'react-native';
import PropTypes from 'prop-types';

export const keyboardTypes = {
  DEFAULT: 'default',
  EMAIL: 'email-address',
  NUMERIC: 'numeric',
};

const Input = ({
  title,
  placeholder,
  value,
  onChangeText,
  keyboardType,
  secureTextEntry,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>

      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder ?? title}
        placeholderTextColor={'#a3a3a3'}
        autoCapitalize={'none'}
        keyboardType={keyboardType}
        secureTextEntry={secureTextEntry}
      />
    </View>
  );
};

Input.propTypes = {
  title: PropTypes.string,
  placeholder: PropTypes.string,
  value: PropTypes.string,
  onChangeText: PropTypes.func,
  keyboardType: PropTypes.oneOf(Object.values(keyboardTypes)),
  secureTextEntry: PropTypes.bool,
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    marginVertical: 5,
  },
  title: {
    marginBottom: 5,
    color: '#949089',
    paddingLeft: 5,
    fontSize: 14,
  },
  input: {
    borderColor: '#e7e5e4',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 20,
    height: 50,
  },
});

export default Input;
