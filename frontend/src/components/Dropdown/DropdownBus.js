import React, { useState, useEffect } from 'react';
import DropDownPicker from 'react-native-dropdown-picker';
import { WHITE, BLACK, PRIMARY, SKYBLUE } from '../../constant/color';

const DropdownBus = ({
  selectedValue,
  onChangeValue,
  backgroundColor = PRIMARY.DEFAULT,
}) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(selectedValue || '1호차'); // 기본값
  const [items, setItems] = useState([
    { label: '1호차', value: '1호차' },
    { label: '2호차', value: '2호차' },
    { label: '3호차', value: '3호차' },
    { label: '4호차', value: '4호차' },
    { label: '5호차', value: '5호차' },
    { label: '6호차', value: '6호차' },
  ]);

  useEffect(() => {
    setValue(selectedValue); // 외부에서 받은 selectedValue가 변경될 때마다 value를 업데이트
  }, [selectedValue]);

  return (
    <DropDownPicker
      open={open}
      value={value}
      items={items}
      setOpen={setOpen}
      setValue={(callback) => {
        setValue(callback);
        if (onChangeValue) {
          onChangeValue(callback());
        }
      }}
      setItems={setItems}
      containerStyle={{
        width: 120,
        zIndex: 1000,
      }}
      style={{
        backgroundColor: backgroundColor,
        borderRadius: 10,
      }}
      dropDownContainerStyle={{
        borderWidth: 0,
        borderRadius: 10,
      }}
      textStyle={{
        fontSize: 16,
        fontWeight: 'bold',
        color: WHITE,
      }}
      placeholder="Select item"
    />
  );
};

export default DropdownBus;
