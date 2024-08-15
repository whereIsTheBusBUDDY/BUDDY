import React, { useEffect, useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ChatScreen from '../screen/CheckIn/ChatScreen';
import MainStack from './MainStack';
import { Ionicons } from '@expo/vector-icons';
import { GRAY, PRIMARY } from '../constant/color';
import BoardStack from './BoardStack';
import ProfileStack from './ProfileStack';
import BusScreen from '../screen/Map/BusScreen';
import { Keyboard } from 'react-native';

const Tab = createBottomTabNavigator();

const ContentTab = () => {
  const [isTabBarVisible, setIsTabBarVisible] = useState(true);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setIsTabBarVisible(false); // 키보드가 올라오면 TabBar 숨기기
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setIsTabBarVisible(true); // 키보드가 내려가면 TabBar 보이기
      }
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === '홈') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === '채팅') {
            iconName = focused ? 'chatbubbles' : 'chatbubbles-outline';
          } else if (route.name === '실시간셔틀') {
            iconName = focused ? 'bus' : 'bus-outline';
          } else if (route.name === '게시판') {
            iconName = focused ? 'clipboard' : 'clipboard-outline';
          } else if (route.name === '마이페이지') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={28} color={color} />;
        },
        tabBarActiveTintColor: PRIMARY.DEFAULT,
        tabBarInactiveTintColor: GRAY.FONT,
        tabBarStyle: [
          {
            height: '8%',
            padding: 5,
          },
          {
            display: isTabBarVisible ? 'flex' : 'none', // TabBar의 가시성을 조정
          },
        ],
        tabBarLabelStyle: {
          paddingBottom: 10,
          fontSize: 13,
        },
      })}
    >
      <Tab.Screen
        name={'홈'}
        component={MainStack}
        options={{ headerShown: false }}
      />
      {/* <Tab.Screen
        name={'채팅'}
        component={ChatScreen}
        options={{
          headerTitle: '채팅',
          headerShadowVisible: false,
        }}
      /> */}
      <Tab.Screen
        name={'실시간셔틀'}
        component={BusScreen}
        options={{
          headerTitle: '실시간 셔틀',
          headerShown: false,
        }}
      />
      <Tab.Screen
        name={'게시판'}
        component={BoardStack}
        options={{
          headerShown: false,
        }}
      />
      <Tab.Screen
        name={'마이페이지'}
        component={ProfileStack}
        options={{
          headerShown: false,
        }}
      />
    </Tab.Navigator>
  );
};

export default ContentTab;
