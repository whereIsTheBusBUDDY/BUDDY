import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Alert, Dimensions } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GRAY, PRIMARY, WHITE } from '../../constant/color';
import apiClient from '../../api/api';

export default function QrScanner() {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [busNumber, setBusNumber] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleBarCodeScanned = async ({ type, data }) => {
    setScanned(true);
    const number = `${data}`;
    setBusNumber(number);
    console.log(number);

    try {
      await AsyncStorage.setItem('busNumber', number);
      console.log(`저장된 호차 번호: ${number}`);

      const response = await apiClient.post(`/scan?busNumber=${number}`);

      if (response.status !== 201) {
        throw new Error('문제가 발생했습니다.');
      }

      const responseData = response.data;
      console.log('Response:', responseData);

      Alert.alert(
        `${number}호차 탑승 완료`,
        `채팅방과 건의하기 기능이 활성화되었습니다.`,
        [{ text: '확인', onPress: () => navigation.navigate('Main') }]
      );
    } catch (error) {
      console.error('', error);
      Alert.alert('', '다시 시도해주세요.', [
        { text: '확인', onPress: () => navigation.goBack() },
      ]);
    }
  };

  const renderCamera = () => {
    const screenWidth = Dimensions.get('window').width;
    const cameraSize = screenWidth * 0.6;

    return (
      <View
        style={[
          styles.cameraContainer,
          { width: cameraSize, height: cameraSize },
        ]}
      >
        <View style={{ width: '100%', height: '133%' }}>
          <BarCodeScanner
            onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
            style={StyleSheet.absoluteFillObject}
          />
        </View>
        <View style={styles.overlay}>
          <View style={styles.borderTopLeft} />
          <View style={styles.borderTopRight} />
          <View style={styles.borderBottomLeft} />
          <View style={styles.borderBottomRight} />
        </View>
      </View>
    );
  };

  if (hasPermission === null) {
    return <View />;
  }

  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>카메라 권한이 없습니다.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.paragraph}>
        승차시 <Text style={{ color: PRIMARY.DEFAULT }}>QR코드</Text>를
        찍어주세요!
      </Text>
      {renderCamera()}
    </View>
  );
}

const BORDER_SIZE = 30;
const BORDER_WIDTH = 5;
const BORDER_RADIUS = 10;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: WHITE,
  },
  paragraph: {
    fontSize: 20,
    marginBottom: 40,
  },
  cameraContainer: {
    overflow: 'hidden',
    borderRadius: 10,
    marginBottom: 40,
    position: 'relative',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  borderTopLeft: {
    position: 'absolute',
    top: 10,
    left: 10,
    width: BORDER_SIZE,
    height: BORDER_SIZE,
    borderTopWidth: BORDER_WIDTH,
    borderLeftWidth: BORDER_WIDTH,
    borderColor: PRIMARY.DEFAULT,
    borderTopLeftRadius: BORDER_RADIUS,
  },
  borderTopRight: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: BORDER_SIZE,
    height: BORDER_SIZE,
    borderTopWidth: BORDER_WIDTH,
    borderRightWidth: BORDER_WIDTH,
    borderColor: PRIMARY.DEFAULT,
    borderTopRightRadius: BORDER_RADIUS,
  },
  borderBottomLeft: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    width: BORDER_SIZE,
    height: BORDER_SIZE,
    borderBottomWidth: BORDER_WIDTH,
    borderLeftWidth: BORDER_WIDTH,
    borderColor: PRIMARY.DEFAULT,
    borderBottomLeftRadius: BORDER_RADIUS,
  },
  borderBottomRight: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    width: BORDER_SIZE,
    height: BORDER_SIZE,
    borderBottomWidth: BORDER_WIDTH,
    borderRightWidth: BORDER_WIDTH,
    borderColor: PRIMARY.DEFAULT,
    borderBottomRightRadius: BORDER_RADIUS,
  },
  button: {
    position: 'absolute',
    backgroundColor: GRAY.BTN,
    width: '80%',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderRadius: 5,
    bottom: 100,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
