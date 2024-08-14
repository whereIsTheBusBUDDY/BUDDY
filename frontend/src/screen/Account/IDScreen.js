import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Text,
  Image,
  ScrollView,
  SafeAreaView,
  useWindowDimensions,
  Alert,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import RegistButton from '../../components/RegistButton';
import ProgressBar from '../../components/ProgressBar';
import { PRIMARY } from '../../constant/color';

const IDScreen = () => {
  const width = useWindowDimensions().width;
  const navigate = useNavigation();
  const route = useRoute();
  const step = 1;
  const [photo, setPhoto] = useState(null);
  const [result, setResult] = useState('');
  const [isPopupVisible, setIsPopupVisible] = useState(false);

  useEffect(() => {
    if (route.params?.result) {
      setResult(route.params.result);
      setPhoto(route.params.result.photo); // 카메라에서 받은 사진 URI 저장
      setIsPopupVisible(true); // 팝업을 표시하도록 설정
    }
  }, [route.params?.result]);

  useEffect(() => {
    if (isPopupVisible) {
      if (result && result.allow !== undefined) {
        const message =
          result.allow == true
            ? '학생증 인증이 완료되었습니다!'
            : '인증에 실패하였습니다. 다시 시도해주세요.';

        Alert.alert(
          result.allow ? '인증 완료' : '인증 실패',
          message,
          [
            {
              text: '확인',
              onPress: () => {
                console.log('확인 버튼이 눌렸습니다');
                setIsPopupVisible(false); // 팝업만 닫기
              },
            },
          ],
          { cancelable: false }
        );
      }
    }
  }, [isPopupVisible, result]);

  const handleNext = () => {
    if (step < 3) {
      navigate.navigate('Signup');
    } else {
      // 완료 로직 추가
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
                source={require('../../../assets/studentid.png')}
                style={styles.image}
              />
              <Text style={styles.name}>김 싸 피</Text>
            </View>
          </View>
          <View>
            <Text style={styles.content}>
              ① 학생증의 앞면이 보이도록 놓아주세요.{'\n'}
              닥에 놓은면 더 잘 인식됩니다.
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

          {!result || !result.allow ? (
            <View style={styles.buttonContainer}>
              <RegistButton
                title="학생증 촬영하기"
                buttonType="GRAY"
                onPress={() => navigate.navigate('CameraScreen')}
                height={63}
              />
              {!result.allow && result && (
                <Text style={styles.compmsg}>
                  인증에 실패하였습니다. 다시 시도해주세요.
                </Text>
              )}
            </View>
          ) : (
            <View>
              <View style={styles.buttonContainer}>
                <RegistButton
                  title={step === 3 ? '완료' : '다음'}
                  buttonType="PRIMARY"
                  onPress={handleNext}
                  height={63}
                />
                <Text style={styles.compmsg}>
                  학생증 인증이 완료되었습니다 !
                </Text>
              </View>
            </View>
          )}
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
    paddingBottom: 20,
    paddingTop: 25,
    marginRight: 15,
  },
  origintxt: {
    marginTop: 30,
    textAlign: 'center',
    fontSize: 18,
    marginBottom: 50,
  },
  pointxt: {
    color: PRIMARY.DEFAULT,
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
    fontSize: 20,
  },
  content: {
    fontSize: 16,
    marginBottom: 20,
    paddingHorizontal: 25,
  },
  camera: {
    flex: 1,
    height: 300, // 카메라 뷰의 높이 설정
    marginBottom: 30, // 카메라 뷰 아래의 요소와 간격 조절
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  photo: {
    flex: 1,
    resizeMode: 'contain',
    marginVertical: 20,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
    fontSize: 18,
  },
  compmsg: {
    fontSize: 18,
    textAlign: 'center',
    color: '#f97316',
    marginLeft: 10,
  },
});

export default IDScreen;
