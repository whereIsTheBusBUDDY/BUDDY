import React from 'react';
import {
  View,
  ScrollView,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { PRIMARY, WHITE } from '../constant/color';
import Button, { ButtonColors } from '../components/Button';
import { useNavigation } from '@react-navigation/native';

const IntroduceScreen = () => {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
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
      <View style={styles.fixedContainer}>
        <Button
          title="회원가입하러 가기"
          onPress={() => navigation.navigate('IDScreen')}
          buttonColor={ButtonColors.GRAY}
          buttonStyle={styles.navigationButton}
        />
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
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
