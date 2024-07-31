import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  Image,
  ScrollView,
  SafeAreaView,
  useWindowDimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import RegistButton from '../components/RegistButton';
import ProgressBar from '../components/ProgressBar';

const IDScreen = () => {
  const width = useWindowDimensions().width;
  const navigate = useNavigation();
  const step = 1;
  const handleNext = () => {
    if (step < 3) {
      navigate.navigate('Signup');
    } else {
    }
  };

  return (
    <SafeAreaView style={styles.wholebox}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          <ProgressBar step={step} />

          <Text style={styles.origintxt}>
            <Text style={styles.pointxt}>SSAFY인</Text> 인증을 위해{'\n'}
            <Text style={styles.pointxt}>학생증</Text>을 준비해주세요
          </Text>

          <View style={[styles.box, { height: width / 2.3 }]}>
            <Text style={styles.logo}>multicampus</Text>
            <View style={styles.profile}>
              <Image
                source={require('../../assets/studentid.png')}
                style={styles.image}
              />
              <Text style={styles.name}>김 싸 피</Text>
            </View>
          </View>

          <View>
            <Text style={styles.content}>
              ① 학생증의 앞면이 보이도록 놓아주세요.{'\n'}
              <Text style={styles.indented}>
                어두운 바닥에 놓은면 더 잘 인식됩니다.
              </Text>
            </Text>
            <Text style={styles.content}>
              ② 가이드 영역에 맞추어 학생증을 촬영해주세요.
            </Text>
            <Text style={styles.content}>
              ③ 빛이 반사되지 않도록 주의하세요.{'\n'}
              카드의 일부가 가려지거나 훼손이 심한 경우 인식되지 않을 수
              있습니다.
            </Text>
          </View>

          <View style={styles.buttonContainer}>
            <RegistButton
              title={step === 3 ? '완료' : '다음'}
              buttonType={'GRAY'}
              onPress={handleNext}
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
  buttonContainer: {
    // paddingHorizontal: 10,
    paddingBottom: 20,
    paddingTop: 25,
    marginRight: 15,
  },
  origintxt: {
    marginTop: 30,
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 15,
    marginBottom: 50,
  },
  pointxt: {
    color: '#f97316',
  },
  box: {
    backgroundColor: '#f5f5f4',
    borderRadius: 15,
    marginBottom: 30,
    marginHorizontal: 20,
    padding: 5,
  },
  logo: {
    color: '#737373',
    textAlign: 'right',
    fontSize: 16,
    marginRight: 10,
    marginTop: 2,
  },
  profile: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginTop: 5,
  },
  image: {
    width: 70,
    height: 100,
    marginHorizontal: 10,
  },
  name: {
    marginTop: 30,
    marginLeft: 20,
    fontSize: 15,
  },
  content: {
    fontSize: 13,
    marginBottom: 20,
    paddingHorizontal: 25,
  },
  indented: {
    marginLeft: 10,
  },
});

export default IDScreen;
