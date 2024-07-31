import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Input, { keyboardTypes } from '../components/SignupInput';
// import Dropdown from '../components/dropdown';
import RegistButton from '../components/RegistButton';
import ProgressBar from '../components/ProgressBar';

const SignupScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const handleNext = () => {
    if (step < 3) {
      navigation.navigate('MM');
    } else {
      navigation.navigate('MM', { step });
    }
  };
  const step = 2;
  return (
    <SafeAreaView style={styles.box}>
      <ScrollView>
        <View style={styles.container}>
          <ProgressBar step={step} />

          <View style={styles.middlebox}>
            <Input title={'이름*'} placeholder="" style={styles.input} />
            <Input title={'학번*'} placeholder="" style={styles.input} />
            <Input title={'닉네임*'} placeholder="" style={styles.input} />
            <Input
              title={'이메일*'}
              placeholder=""
              style={styles.input}
              keyboardType={keyboardTypes.EMAIL}
            />
            <Input
              title={'비밀번호*'}
              placeholder=""
              secureTextEntry
              style={styles.input}
            />
            <Input
              title={'비밀번호 확인*'}
              placeholder=""
              secureTextEntry
              style={styles.input}
            />
            {/* <Dropdown title={'선호하는 노선*'} /> */}
          </View>

          <View style={styles.buttonContainer}>
            <RegistButton
              title={step === 3 ? '완료' : '다음'}
              onPress={handleNext}
              buttonType={'GRAY'}
              height={63}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    // alignItems: 'stretch',
    padding: 20,
    width: '100%',
    backgroundColor: '#ffffff',
  },
  input: {
    width: '50%',
    height: 48,
    borderColor: '#EFEEEC',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    marginHorizontal: 20,
  },
  button: {
    backgroundColor: '#e7e5e4',
    width: '100%',
    padding: 20,
    marginTop: 40,
    paddingHorizontal: 30,
    justifyContent: 'center',
  },
  box: {
    flex: 1,
    backgroundColor: 'white',
  },
  buttonContainer: {
    // paddingHorizontal: 10,
    paddingBottom: 20,
    paddingTop: 25,
    marginRight: 15,
    justifyContent: 'flex-end',
  },
  middlebox: {
    paddingHorizontal: 10,
  },
});

export default SignupScreen;
