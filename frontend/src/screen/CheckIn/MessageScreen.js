import React, { useState } from 'react';
import { StyleSheet, Text, View, Alert } from 'react-native';
import MsgButton from '../../components/MsgButton';
import CustomPopup from '../../components/MsgPopup';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASEurl } from '../../api/url';
import { SKYBLUE, PRIMARY, BLACK } from '../../constant/color';

const MessageScreen = () => {
  const [popupVisible, setPopupVisible] = useState(false);
  const [popupFirstLine, setPopupFirstLine] = useState('');
  const [popupSecondLine, setPopupSecondLine] = useState('');
  const [popupThirdLine, setPopupThirdLine] = useState('');
  const [busNumber, setBusNumber] = useState(null);

  getBusId = async () => {
    try {
      const busNumber = await AsyncStorage.getItem('busNumber');
      setBusNumber(busNumber);
    } catch (error) {
      console.error('오류 발생', error);
    }
  };
  getBusId();

  const showPopup = (buttonTitle) => {
    setPopupFirstLine('기사님께');
    setPopupSecondLine(`'${buttonTitle}'`);
    setPopupThirdLine('메세지가 전달되었습니다.');
    setPopupVisible(true);
  };

  const closePopup = () => {
    setPopupVisible(false);
    setPopupFirstLine('');
    setPopupSecondLine('');
    setPopupThirdLine('');
  };

  const handleSubmit = async (value) => {
    try {
      // AsyncStorage에서 액세스 토큰 불러오기
      const accessToken = await AsyncStorage.getItem('accessToken');

      if (!accessToken) {
        console.error('Access token is missing');
        return;
      }

      const response = await fetch(
        `http://i11b109.p.ssafy.io:8080/suggestions?type=${value}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`, // 액세스 토큰을 Authorization 헤더에 추가
          },
          body: JSON.stringify({
            title: value, // title을 value로 사용
            content: `${value} 요청이 전송되었습니다.`, // content에 대한 설명
          }),
        }
      );

      if (response.ok) {
        showPopup(value);
      } else {
        Alert.alert('오류', `오류: ${response.statusText}`);
      }
    } catch (error) {
      Alert.alert('오류', `에러가 발생했습니다: ${error.message}`);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.bustxt}>{busNumber}호차</Text>
      <Text style={styles.origintxt}>
        <Text style={styles.pointxt}>본인의 실명</Text>으로 기사님께 전달되니
      </Text>
      <Text style={styles.origintxt}>
        <Text style={styles.pointxt}>긴급 상황</Text>이나
        <Text style={styles.pointxt}>꼭 필요한 경우</Text>에만 사용해주세요!
      </Text>
      <View style={styles.button}>
        <MsgButton
          title={'멈춰주세요'}
          buttonType={'PRIMARY'}
          onPress={() => handleSubmit('멈춰주세요')}
        />
        <MsgButton
          title={'더워요'}
          buttonType={'GRAY'}
          onPress={() => handleSubmit('더워요')}
        />
        <MsgButton
          title={'추워요'}
          buttonType={'GRAY'}
          onPress={() => handleSubmit('추워요')}
        />
      </View>
      <CustomPopup
        visible={popupVisible}
        firstLine={popupFirstLine}
        secondLine={popupSecondLine}
        thirdLine={popupThirdLine}
        onClose={closePopup}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bustxt: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 30,
    marginBottom: 20,
    color: PRIMARY.DEFAULT,
  },
  origintxt: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 15,
    color: BLACK,
  },
  pointxt: {
    color: PRIMARY.DEFAULT,
  },
  button: {
    marginTop: 70,
  },
});

export default MessageScreen;
