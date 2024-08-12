import React, { useState, useEffect } from 'react';
import { Picker } from '@react-native-picker/picker';
import { View, StyleSheet } from 'react-native';
import { WHITE, BLACK, PRIMARY } from '../../constant/color';

const DropdownBus = ({
  selectedValue,
  onChangeValue,
  backgroundColor = PRIMARY.DEFAULT,
}) => {
  const [value, setValue] = useState(selectedValue || '1호차'); // 기본값
  const items = [
    { label: '1호차', value: '1호차' },
    { label: '2호차', value: '2호차' },
    { label: '3호차', value: '3호차' },
    { label: '4호차', value: '4호차' },
    { label: '5호차', value: '5호차' },
    { label: '6호차', value: '6호차' },
  ];

  useEffect(() => {
    setValue(selectedValue); // 외부에서 받은 selectedValue가 변경될 때마다 value를 업데이트
  }, [selectedValue]);

  return (
    <View style={styles.container}>
      <Picker
        selectedValue={value}
        onValueChange={(itemValue) => {
          setValue(itemValue);
          if (onChangeValue) {
            onChangeValue(itemValue);
          }
        }}
        style={[styles.picker, { backgroundColor }]}
      >
        {items.map((item) => (
          <Picker.Item
            key={item.value}
            label={item.label}
            value={item.value}
            color={BLACK}
          />
        ))}
      </Picker>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 120,
    borderRadius: 10,
    overflow: 'hidden',
  },

  picker: {
    height: 50,
    color: WHITE,
    borderRadius: 10,
  },
});

export default DropdownBus;
