import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';

const Dropdown = ({ title }) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState([
    { label: '1호차', value: '1호차' },
    { label: '2호차', value: '2호차' },
    { label: '3호차', value: '3호차' },
    { label: '4호차', value: '4호차' },
    { label: '5호차', value: '5호차' },
    { label: '6호차', value: '6호차' },
  ]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <DropDownPicker
        open={open}
        value={value}
        items={items}
        setOpen={setOpen}
        setValue={setValue}
        setItems={setItems}
        placeholder=""
        style={styles.dropdown}
        containerStyle={styles.containerStyle}
        dropDownContainerStyle={styles.dropdownContainer}
        textStyle={styles.text} // 텍스트 스타일 추가
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 40,
    height: 40,
    paddingHorizontal: 10,
  },
  title: {
    marginBottom: 5,
    fontSize: 14,
    color: '#949089',
    padding,
  },
  dropdown: {
    borderColor: '#e7e5e4',
    borderWidth: 1,
    paddingHorizontal: 10,

    // height: 30,

    width: '100%',
  },
  dropdownContainer: {
    borderColor: '#e7e5e4',
    borderWidth: 1,
    width: '100%',
    // height: 10,
  },
  containerStyle: {
    height: 10,
  },
  text: {
    color: '#949089', // 원하는 폰트 색상으로 변경
  },
});

export default Dropdown;
