import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import MsgButton from '../../components/MsgButton';
import CustomPopup from '../../components/MsgPopup';

const MessageScreen = () => {
  const [popupVisible, setPopupVisible] = useState(false);
  const [popupFirstLine, setPopupFirstLine] = useState('');
  const [popupSecondLine, setPopupSecondLine] = useState('');
  const [popupThirdLine, setPopupThirdLine] = useState('');

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
  return (
    <View style={styles.container}>
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
          onPress={() => showPopup('"멈춰주세요"')}
        />
        <MsgButton
          title={'더워요'}
          buttonType={'GRAY'}
          onPress={() => showPopup('"더워요"')}
        />
        <MsgButton
          title={'추워요'}
          buttonType={'GRAY'}
          onPress={() => showPopup('"추워요"')}
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
  origintxt: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 15,
    color: '#737373',
  },
  pointxt: {
    color: '#f97316',
  },
  button: {
    marginTop: 70,
  },
});

export default MessageScreen;
