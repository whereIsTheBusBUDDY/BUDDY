import React, { useState, useEffect } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { View, StyleSheet, Text, ScrollView, SafeAreaView } from 'react-native';
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field';
import ProgressBar from '../../components/ProgressBar';
import RegistButton from '../../components/RegistButton';
import { mmAuth } from '../../api/auth';

const CELL_COUNT = 5;

const word = require('../../../assets/word.json');

// 랜덤 숫자 만들기
const generateRandomCode = () => {
  return Math.floor(10000 + Math.random() * 90000).toString();
};

const getRandomWord = (wordJson, category) => {
  const categoryWord = wordJson[category];
  const randomIndex = Math.floor(Math.random() * categoryWord.length);
  return categoryWord[randomIndex];
};

const MMScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [value, setValue] = useState('');
  const [combinedWord, setCombinedWord] = useState('');
  const [mmText, setMmText] = useState(generateRandomCode()); // mmText를 상태로 저장
  const [isDisabled, setIsDisabled] = useState(true); // 버튼 활성화 상태
  const step = 3;
  const ref = useBlurOnFulfill({ value, cellCount: CELL_COUNT });
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });

  // 컴포넌트가 마운트될 때 인증 코드를 생성하고 전송
  useEffect(() => {
    const sendAuthCode = async () => {
      try {
        const randomAd = getRandomWord(word, 'ad');
        const randomNone = getRandomWord(word, 'none');

        const wordCombination = randomAd + ' ' + randomNone;
        setCombinedWord(wordCombination);

        const message = `<${wordCombination}>님에게 <${mmText}>가 전송되었습니다`;
        const mmData = {
          text: message,
        };
        const result = await mmAuth(mmData);
        console.log('인증 코드 전송 완료');
      } catch (error) {
        console.log('', error.message);
      }
    };

    sendAuthCode();
  }, [mmText]);

  useEffect(() => {
    if (value === mmText) {
      setIsDisabled(false);
    } else {
      setIsDisabled(true);
    }
  }, [value, mmText]);

  const handleNext = () => {
    if (value === mmText) {
      navigation.navigate('Login');
    } else {
    }
  };

  return (
    <SafeAreaView style={styles.wholebox}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          <ProgressBar step={step} />
          <View>
            <Text style={styles.origintxt}>
              Mattermost {'<11기 공지 전용>'} 채널에서{'\n'}
              <Text style={styles.pointxt}>Buddy MM 인증방</Text>을
              추가해주세요!{'\n'}
              {'\n'}
              인증채널에{'\n'}
              <Text style={styles.pointxt}>{combinedWord}</Text>님에게 전송된{' '}
              {'\n'}
              <Text style={styles.pointxt}>인증코드</Text>를 입력해주세요
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
          {/* <Text style={styles.subtxt}>
            코드를 받지 못하셨나요?{' '}
            <Text style={styles.pointxt}>인증코드 재전송</Text>
          </Text> */}
          <View style={styles.flexGrow} />
          <View style={styles.buttonContainer}>
            <RegistButton
              title={step === 3 ? '완료' : '다음'}
              onPress={handleNext}
              buttonType={'PRIMARY'}
              height={63}
              disabled={isDisabled}
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
    paddingBottom: 20,
    paddingTop: 25,
    marginRight: 15,
  },
});

export default MMScreen;
