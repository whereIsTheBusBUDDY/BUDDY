import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoadingPage from '../screen/LoadingScreen';
import IntroduceScreen from '../screen/IntroduceScreen';
import { Fontisto, Entypo } from '@expo/vector-icons';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import LoginScreen from '../screen/Account/LoginScreen';
import IDScreen from '../screen/Account/IDScreen';
import SignupScreen from '../screen/Account/SignupScreen';
import MMScreen from '../screen/Account/MMScreen';
import CameraScreen from '../screen/Account/CameraScreen';
import MainScreen from '../screen/MainScreen';
import { useContext } from 'react';
import { NotificationContext } from '../context/NotificationContext';
import MainStack from './MainStack';
import AdminStack from './AdminStack';

const Stack = createNativeStackNavigator();
const FirstStack = () => {
  const { hasUnreadNotifications, setHasUnreadNotifications } =
    useContext(NotificationContext);
  return (
    <Stack.Navigator>
      <Stack.Screen
        name={'Loading'}
        component={LoadingPage}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={'introduce'}
        component={IntroduceScreen}
        options={{
          headerShown: false,
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
          // headerRight: () => <Fontisto name="bell" size={24} color="black" />,
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
          // headerRight: () => <Fontisto name="bell" size={24} color="black" />,
          headerStyle: {
            shadowColor: 'transparent',
            elevation: 0,
          },
          headerShadowVisible: false,
        }}
      />
      <Stack.Screen name={'CameraScreen'} component={CameraScreen} />
      <Stack.Screen
        name={'Signup'}
        component={SignupScreen}
        options={{
          headerTitle: '',
          headerLeft: () => (
            <Image source={require('../../assets/BUDDY.png')} />
          ),
          // headerRight: () => <Fontisto name="bell" size={24} color="black" />,
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
          // headerRight: () => <Fontisto name="bell" size={24} color="black" />,
          headerStyle: {
            shadowColor: 'transparent',
            elevation: 0,
          },
          headerShadowVisible: false,
        }}
      />
      <Stack.Screen
        name={'MainStack'}
        component={MainStack}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name={'AdminStack'}
        component={AdminStack}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  noti: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dot: {
    position: 'absolute',
    top: -12,
    right: -8,
  },
});

export default FirstStack;
