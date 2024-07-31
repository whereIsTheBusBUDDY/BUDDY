import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { BLACK, SKYBLUE, WHITE } from '../constant/color';

const TimeTable = ({ data }) => {
  return (
    <View style={styles.container}>
      {data.map((item, index) => (
        <View key={index} style={styles.itemContainer}>
          <Text style={styles.time}>{item.time}</Text>
          <View style={styles.lineContainer}>
            <View style={styles.circle} />
            {index !== data.length - 1 && <View style={styles.line} />}
          </View>
          <View style={styles.detailContainer}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.description}>{item.description}</Text>
          </View>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  time: {
    textAlign: 'center',
    color: BLACK,
    width: 50,
  },
  lineContainer: {
    alignItems: 'center',
    marginHorizontal: 10,
  },
  circle: {
    width: 12,
    height: 12,
    borderColor: SKYBLUE.FONT,
    borderWidth: 3,
    borderRadius: 6,
    backgroundColor: WHITE,
    zIndex: 1,
  },
  line: {
    width: 3,
    height: '140%',
    flex: 1,
    backgroundColor: SKYBLUE.FONT,
    position: 'absolute',
    top: 6,
    // bottom: -40,
    zIndex: 0,
  },
  detailContainer: {
    flex: 1,
    borderRadius: 10,
  },
  title: {
    fontSize: 16,
    marginBottom: 5,
  },
  description: {
    fontSize: 14,
    color: 'gray',
  },
});

export default TimeTable;
