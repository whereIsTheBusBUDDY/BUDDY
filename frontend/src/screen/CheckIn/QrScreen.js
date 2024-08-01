import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Linking } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { GRAY, PRIMARY, WHITE } from '../../constant/color';

export default function QrScanner() {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    alert(`{1호차}에 탑승했습니다. 채팅방, 건의하기 기능이 활성화됩니다.`);

    if (data.startsWith('http://') || data.startsWith('https://')) {
      Linking.openURL(data).catch((err) =>
        console.error('An error occurred', err)
      );
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
      <TouchableOpacity
        style={styles.button}
        onPress={() => setScanned(false)}
        disabled={!scanned}
      >
        <Text style={styles.buttonText}>완료</Text>
      </TouchableOpacity>
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
