import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ProgressBar = ({ step }) => {
  const progress = (step / 2) * 100;

  return (
    <View style={styles.container}>
      <View style={styles.progressBackground}>
        <View style={[styles.progressBar, { width: `${progress - 50}%` }]} />
      </View>
      <View style={styles.stepsContainer}>
        <Text style={[styles.step, step >= 1 && styles.activeStep]}>1</Text>
        <Text style={[styles.step, step >= 2 && styles.activeStep]}>2</Text>
        <Text style={[styles.step, step >= 3 && styles.activeStep]}>3</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    padding: 10,
    marginBottom: 10,
    paddingHorizontal: 20,
  },
  progressBackground: {
    height: 10,
    backgroundColor: '#e0e0e0',
    borderRadius: 5,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#f97316',
  },
  stepsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  step: {
    fontSize: 18,
    color: '#bbb',
  },
  activeStep: {
    color: '#f97316',
    fontWeight: 'bold',
  },
});

export default ProgressBar;
