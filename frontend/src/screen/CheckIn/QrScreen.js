import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Alert } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { useNavigation } from '@react-navigation/native';
import { GRAY, PRIMARY, WHITE } from '../../constant/color';
import apiClient from '../../api/api'; // Ensure this is correctly configured

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
      const response = await apiClient.post(`/scan?busNumber=${number}`);

      if (response.status !== 201) {
        throw new Error('Network response was not ok');
      }

      const responseData = response.data;
      console.log('Response:', responseData);

      Alert.alert(
        `${number}호차 탑승 완료`,
        `${number}호차 채팅방으로 이동합니다!`,
        [
          { text: '확인', onPress: () => navigation.navigate('Chat') }, // 'ChatRoom' 화면으로 이동
        ]
      );
    } catch (error) {
      console.error('Error posting data:', error);
      Alert.alert('Error', 'QR 코드 전송 중 문제가 발생했습니다.');
    }
  };

  const renderCamera = () => {
    return (
      <View style={styles.cameraContainer}>
        <BarCodeScanner
          onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
          style={StyleSheet.absoluteFillObject}
        />
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
        <Text style={styles.text}>Camera permission not granted</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.paragraph}>승차시 QR코드를 찍어주세요!</Text>
      {renderCamera()}
      {busNumber && <Text>스캔된 버스 번호: {busNumber}</Text>}
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
    width: '60%',
    aspectRatio: 1,
    overflow: 'hidden',
    borderRadius: 10,
    marginBottom: 40,
    position: 'relative',
  },
  camera: {
    flex: 1,
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
