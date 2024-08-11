import axios from 'axios';

import { CameraView, useCameraPermissions } from 'expo-camera';
import { CameraType } from 'expo-camera/build/legacy/Camera.types';
import { useState, useRef } from 'react';
import {
  Button,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  Pressable,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { GRAY, PRIMARY, WHITE, BLACK } from '../../constant/color';

const CameraScreen = () => {
  const [facing, setFacing] = useState(CameraType.back);
  const [permission, requestPermission] = useCameraPermissions();
  const [photo, setPhoto] = useState(null);
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const cameraRef = useRef(null);
  const navigation = useNavigation();

  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View style={styles.container}>
        <Text style={styles.message}>
          카메라를 사용하려면 권한이 필요합니다
        </Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  function toggleCameraFacing() {
    setFacing((current) => (current === 'back' ? 'front' : 'back'));
  }

  const takePicture = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync({ base64: true });
      setPhoto(photo);
    }
  };

  const sendPhotoToServer = async () => {
    if (photo) {
      try {
        // 버튼을 비활성화 상태로 설정
        setButtonDisabled(true);

        const formData = new FormData();
        const fileUri = photo.uri;
        const fileName = fileUri.split('/').pop();
        const fileType = `image/${fileName.split('.').pop()}`;

        formData.append('image', {
          uri: fileUri,
          type: fileType,
          name: fileName,
        });

        console.log('Sending photo to server...', formData);

        // 서버로 요청 보내기
        const response = await axios.post(
          'http://i11b109.p.ssafy.io:8080/upload', // 올바른 URL인지 확인
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data', // 정확한 헤더 설정
            },
          }
        );

        console.log('서버 응답:', response.data);
        navigation.navigate('IDScreen', { result: response.data });
      } catch (error) {
        console.error(
          '이미지 업로드 에러:',
          error.response ? error.response.data : error.message
        );
        // 오류 발생 시 버튼을 다시 활성화
        setButtonDisabled(false);
      }
    }
  };

  return (
    <View style={styles.container}>
      {photo ? (
        <Image source={{ uri: photo.uri }} style={styles.photo} />
      ) : (
        <View style={styles.cameraContainer}>
          <CameraView style={styles.camera} facing={facing} ref={cameraRef}>
            <View style={styles.overlay}>
              <View style={styles.cardOutline} />
            </View>
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.button} onPress={takePicture}>
                <Text style={styles.text}>촬영</Text>
              </TouchableOpacity>
            </View>
          </CameraView>
        </View>
      )}
      {photo && (
        <View style={styles.buttonRow}>
          <Pressable
            onPress={() => setPhoto(null)}
            style={styles.repressableButton}
          >
            <Text style={styles.buttonText}>다시 촬영하기</Text>
          </Pressable>
          <Pressable
            onPress={buttonDisabled ? null : sendPhotoToServer}
            style={[
              styles.pressableButton,
              buttonDisabled && styles.disabledButton,
            ]}
          >
            <Text
              style={[
                styles.usebuttonText,
                buttonDisabled && styles.disabledText,
              ]}
            >
              사용
            </Text>
          </Pressable>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: WHITE, // 배경색을 추가하여 사진 외의 부분을 검은색으로
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
  },
  cameraContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  camera: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardOutline: {
    width: '90%',
    height: '30%',
    borderColor: WHITE,
    borderWidth: 2,
    borderRadius: 10,
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    margin: 50,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    // marginVertical: 10,
    marginHorizontal: 10,
    marginBottom: 20,
  },
  button: {
    flex: 1,
    backgroundColor: PRIMARY.DEFAULT,
    width: '100%',
    height: 60,
    borderRadius: 15,
    alignSelf: 'flex-end',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 20,
    color: WHITE,
  },
  photo: {
    flex: 1,
    resizeMode: 'contain', // 사진을 여백 없이 꽉 차게
    marginVertical: 10, // 약간의 수직 여백
  },
  photobutton: {
    marginBottom: 20,
  },
  repressableButton: {
    width: '44%',
    paddingVertical: 20,
    paddingHorizontal: 20,
    backgroundColor: GRAY.BACKGROUND, // 버튼 배경색
    borderRadius: 10, // 둥근 모서리
    marginHorizontal: 5, // 양옆 여백
    alignItems: 'center',
  },
  pressableButton: {
    width: '44%',
    paddingVertical: 20,
    paddingHorizontal: 20,
    backgroundColor: PRIMARY.DEFAULT, // 버튼 배경색
    borderRadius: 10, // 둥근 모서리
    marginHorizontal: 5, // 양옆 여백
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: GRAY.CLICK, // 비활성화된 버튼 배경색
  },
  disabledText: {
    color: WHITE, // 비활성화된 텍스트 색상
  },
  buttonText: {
    color: BLACK, // 버튼 텍스트 색상
    fontSize: 20,
    // fontWeight: 'bold',
  },
  usebuttonText: {
    color: WHITE, // 버튼 텍스트 색상
    fontSize: 20,
    // fontWeight: 'bold',
  },
});

export default CameraScreen;
