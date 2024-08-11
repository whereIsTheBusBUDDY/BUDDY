import { createNativeStackNavigator } from '@react-navigation/native-stack';
import IntroduceScreen from '../screen/IntroduceScreen';
import { Image } from 'react-native';
import LoginScreen from '../screen/Account/LoginScreen';
import IDScreen from '../screen/Account/IDScreen';
import SignupScreen from '../screen/Account/SignupScreen';
import MMScreen from '../screen/Account/MMScreen';
import AdminStack from '../navigations/AdminStack';
import MainStack from '../navigations/MainStack';
import CameraScreen from '../screen/Account/CameraScreen';
import ResetPasswordScreen from '../screen/Account/ResetPasswordScreen';

const Stack = createNativeStackNavigator();
const LoginStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name={'introduce'}
        component={IntroduceScreen}
        options={{
          headerTitle: '',
          headerLeft: () => (
            <Image source={require('../../assets/BUDDY.png')} />
          ),
          headerStyle: {
            shadowColor: 'transparent',
            elevation: 0,
          },
          headerShadowVisible: false,
        }}
      />
      <Stack.Screen
        name={'Login'}
        component={LoginScreen}
        options={{
          headerTitle: '',
          headerLeft: () => (
            <Image source={require('../../assets/BUDDY.png')} />
          ),
          headerStyle: {
            shadowColor: 'transparent',
            elevation: 0,
          },
          headerShadowVisible: false,
        }}
      />
      <Stack.Screen
        name={'ResetPassword'}
        component={ResetPasswordScreen}
        options={{
          headerTitle: '',
          headerLeft: () => (
            <Image source={require('../../assets/BUDDY.png')} />
          ),
          headerStyle: {
            shadowColor: 'transparent',
            elevation: 0,
          },
          headerShadowVisible: false,
        }}
      />
      <Stack.Screen
        name={'IDScreen'}
        component={IDScreen}
        options={{
          headerTitle: '',
          headerLeft: () => (
            <Image source={require('../../assets/BUDDY.png')} />
          ),
          headerStyle: {
            shadowColor: 'transparent',
            elevation: 0,
          },
          headerShadowVisible: false,
        }}
      />
      <Stack.Screen
        name={'CameraScreen'}
        component={CameraScreen}
        options={{
          headerTitle: '학생증 촬영하기',
          headerLeft: () => (
            <Image source={require('../../assets/BUDDY.png')} />
          ),
          headerStyle: {
            shadowColor: 'transparent',
            elevation: 0,
          },
          headerShadowVisible: false,
        }}
      />
      <Stack.Screen
        name={'Signup'}
        component={SignupScreen}
        options={{
          headerTitle: '',
          headerLeft: () => (
            <Image source={require('../../assets/BUDDY.png')} />
          ),
          headerStyle: {
            shadowColor: 'transparent',
            elevation: 0,
          },
          headerShadowVisible: false,
        }}
      />
      <Stack.Screen
        name={'MM'}
        component={MMScreen}
        options={{
          headerTitle: '',
          headerLeft: () => (
            <Image source={require('../../assets/BUDDY.png')} />
          ),
          headerStyle: {
            shadowColor: 'transparent',
            elevation: 0,
          },
          headerShadowVisible: false,
        }}
      />
      <Stack.Screen
        name={'AdminStack'}
        component={AdminStack}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name={'MainStack'}
        component={MainStack}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
};

export default LoginStack;
