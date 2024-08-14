// CustomPopup.js
import React, { useEffect, useRef, useState } from 'react';
import { Modal, StyleSheet, Text, View, Animated } from 'react-native';
import MsgButton from './MsgButton';

const CustomPopup = ({
  visible,
  firstLine,
  secondLine,
  thirdLine,
  onClose,
}) => {
  const fadeAnim = useRef(new Animated.Value(1)).current; // 초기값: 완전 불투명
  const [showPopup, setShowPopup] = useState(visible);

  useEffect(() => {
    if (visible) {
      setShowPopup(true);
      fadeAnim.setValue(1); // 애니메이션 시작 전 초기값 설정
      const timer = setTimeout(() => {
        // 1초 뒤 애니메이션 시작
        Animated.timing(fadeAnim, {
          toValue: 0, // 완전 투명
          duration: 1000, // 1초
          useNativeDriver: true,
        }).start(() => {
          setShowPopup(false); // 애니메이션 종료 후 상태 업데이트
          onClose(); // 모달 닫기
        });
      }, 1000); // 1초 지연

      return () => clearTimeout(timer); // 타이머 정리
    } else {
      setShowPopup(false);
      fadeAnim.setValue(1); // 모달이 닫힐 때 초기 상태로 설정
    }
  }, [visible]);

  return (
    <Modal
      transparent={true}
      animationType="none" // 기본 애니메이션 제거
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <Animated.View style={[styles.modalView, { opacity: fadeAnim }]}>
          <Text style={styles.modalText}>{firstLine}</Text>
          <Text style={[styles.modalText, styles.highlightedText]}>
            {secondLine}
          </Text>
          <Text style={styles.modalText}>{thirdLine}</Text>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)', // 배경색 투명도 조절
  },
  modalView: {
    margin: 20,
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 5,
    padding: 60,
    paddingVertical: 80,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 16,
    fontSize: 20,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  highlightedText: {
    color: '#f97316',
    fontSize: 23,
  },
});

export default CustomPopup;
