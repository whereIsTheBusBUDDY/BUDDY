import React, { useState, useEffect } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { View, StyleSheet, Text, ScrollView, SafeAreaView } from 'react-native';
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field';
import ProgressBar from '../components/ProgressBar'; // Adjust the path as necessary
import RegistButton from '../components/RegistButton';

const CELL_COUNT = 6;

const MMScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [value, setValue] = useState('');
  const step = 3;
  const ref = useBlurOnFulfill({ value, cellCount: CELL_COUNT });
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });

  useEffect(() => {
    if (route.params?.step) {
      setStep(route.params.step);
    }
  }, [route.params]);

  const handleNext = () => {
    if (step < 3) {
    } else {
      // 완료 버튼 클릭 시 실행할 코드
      navigation.navigate('Login');
    }
  };

  return (
    <SafeAreaView style={styles.wholebox}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          <ProgressBar step={step} />
          <View>
            <Text style={styles.origintxt}>
              Mattermost 인증채널에{'\n'}
              전송된 <Text style={styles.pointxt}>인증코드</Text>를 입력해주세요
            </Text>
          </View>
          <CodeField
            ref={ref}
            {...props}
            value={value}
            onChangeText={setValue}
            cellCount={CELL_COUNT}
            rootStyle={styles.codeFieldRoot}
            keyboardType="number-pad"
            textContentType="oneTimeCode"
            renderCell={({ index, symbol, isFocused }) => (
              <View
                key={index}
                style={[styles.cellRoot, isFocused && styles.focusCellRoot]}
                onLayout={getCellOnLayoutHandler(index)}
              >
                <Text style={styles.cellText}>
                  {symbol || (isFocused ? <Cursor /> : null)}
                </Text>
              </View>
            )}
          />
          <Text style={styles.subtxt}>
            코드를 받지 못하셨나요?{' '}
            <Text style={styles.pointxt}>인증코드 재전송</Text>
          </Text>
          <View style={styles.flexGrow} />
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
  wholebox: {
    flex: 1,
    backgroundColor: 'white',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'space-between',
  },
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    padding: 20,
    width: '100%',
    backgroundColor: '#ffffff',
  },
  origintxt: {
    marginTop: '20%',
    textAlign: 'center',
    fontSize: 15,
    marginBottom: '10%',
  },
  pointxt: {
    color: '#f97316',
  },
  subtxt: {
    textAlign: 'center',
    fontSize: 12,
    marginTop: 20,
  },
  codeFieldRoot: {
    marginTop: 20,
    width: '80%',
    marginLeft: '10%',
  },
  cellRoot: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#00000030',
    borderRadius: 5,
    marginHorizontal: 3,
  },
  cellText: {
    fontSize: 24,
    textAlign: 'center',
  },
  focusCellRoot: {
    borderColor: '#000',
  },
  flexGrow: {
    flexGrow: 1,
  },
  buttonContainer: {
    // paddingHorizontal: 10,
    paddingBottom: 20,
    paddingTop: 25,
    marginRight: 15,
  },
});

export default MMScreen;
