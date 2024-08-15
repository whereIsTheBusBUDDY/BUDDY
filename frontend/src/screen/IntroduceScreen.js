import React, { useRef, useEffect } from 'react';
import {
  View,
  ScrollView,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Animated,
  BackHandler,
  ToastAndroid,
} from 'react-native';
import { PRIMARY, WHITE } from '../constant/color';
import Button, { ButtonColors } from '../components/Button';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useFirstContext } from '../context/FirstContent';
const DOUBLE_PRESS_DELAY = 2000;
const IntroduceScreen = () => {
  const navigation = useNavigation();
  const { screen, setScreen } = useFirstContext();
  const [lastBackPressed, setLastBackPressed] = React.useState(0);

  const scrollY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.timing(scrollY, {
        toValue: -100,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(scrollY, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, [scrollY]);

  useFocusEffect(
    React.useCallback(() => {
      const handleBackPress = () => {
        const now = Date.now();
        if (now - lastBackPressed < DOUBLE_PRESS_DELAY) {
          BackHandler.exitApp();
        } else {
          setLastBackPressed(now);
          ToastAndroid.show('두 번 눌러 앱 종료하기', ToastAndroid.SHORT);
        }
        return true;
      };
      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        handleBackPress
      );
      return () => backHandler.remove();
    }, [lastBackPressed])
  );

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.scrollableContainer,
          { transform: [{ translateY: scrollY }] },
        ]}
      >
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          <View style={styles.imageContainer}>
            <Image
              source={require('../../assets/001.png')}
              style={styles.firstImage}
              resizeMode="cover"
            />
            <Image
              source={require('../../assets/002.png')}
              style={styles.image}
              resizeMode="cover"
            />
            <Image
              source={require('../../assets/003.png')}
              style={styles.image}
              resizeMode="cover"
            />
            <Image
              source={require('../../assets/004.png')}
              style={styles.image}
              resizeMode="cover"
            />
          </View>
        </ScrollView>
      </Animated.View>
      <View style={styles.fixedContainer}>
        <Button
          title="회원가입하러 가기"
          onPress={() => navigation.navigate('IDScreen')}
          buttonColor={ButtonColors.GRAY}
          buttonStyle={styles.navigationButton}
        />
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('Login');
            setScreen(false);
          }}
        >
          <Text style={styles.linkText}>
            이미 회원이신가요?{' '}
            <Text style={styles.highlightText}>로그인 바로가기</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: WHITE,
  },
  scrollableContainer: {
    flex: 1,
  },
  scrollViewContent: {
    paddingVertical: 30,
    paddingBottom: 120,
  },
  firstImage: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height / 1.5,
    marginTop: -30,
  },
  image: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height / 1.5,
  },
  imageContainer: {
    marginBottom: 10,
  },
  navigationButton: {
    width: '90%',
    height: 60,
  },
  highlightText: {
    color: PRIMARY.DEFAULT,
  },
  fixedContainer: {
    position: 'absolute',
    bottom: 10,
    left: 0,
    right: 0,
    padding: 10,
    alignItems: 'center',
  },
});

export default IntroduceScreen;
