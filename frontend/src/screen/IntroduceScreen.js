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
    <ScrollView contentContainerStyle={styles.container}>
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
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    paddingVertical: 0,
    backgroundColor: WHITE,
    paddingVertical: 30,
  },
  firstImage: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height / 1.5,
    marginBottom: 70,
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
});

export default IntroduceScreen;
