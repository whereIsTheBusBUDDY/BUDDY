import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MainScreen from '../screen/MainScreen';
import ChatScreen from '../screen/CheckIn/ChatScreen';
import MapScreen from '../screen/Map/MapScreen';
import BoardScreen from '../screen/Board/BoardScreen';
import ProfileScreen from '../screen/Account/ProfileScreen';
import MainStack from './MainStack';
import { Ionicons } from '@expo/vector-icons';
import { GRAY, PRIMARY } from '../constant/color';

const Tab = createBottomTabNavigator();

const ContentTab = () => {
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
        tabBarStyle: {
          height: '10%',
          padding: 5,
        },
        tabBarLabelStyle: {
          paddingBottom: 10,
        },
      })}
    >
      <Tab.Screen
        name={'홈'}
        component={MainStack}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name={'채팅'}
        component={ChatScreen}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name={'실시간셔틀'}
        component={MapScreen}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name={'게시판'}
        component={BoardScreen}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name={'마이페이지'}
        component={ProfileScreen}
        options={{ headerShown: false }}
      />
    </Tab.Navigator>
  );
};

export default ContentTab;
