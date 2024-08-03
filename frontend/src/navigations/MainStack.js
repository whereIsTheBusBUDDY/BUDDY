import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MainScreen from '../screen/MainScreen';
import ChatScreen from '../screen/CheckIn/ChatScreen';
import BoardScreen from '../screen/Board/BoardScreen';
import MessageScreen from '../screen/CheckIn/MessageScreen';
import { Image, TouchableOpacity, requireNativeComponent } from 'react-native';
import { Fontisto } from '@expo/vector-icons';
import NotificationScreen from '../screen/Notification/NotificationScreen';
import MapScreen from '../screen/Map/MapScreen';
import QrScreen from '../screen/CheckIn/QrScreen';
import FavoriteScreen from '../screen/Favorite/FavoriteScreen';
import BusScreen from '../screen/Map/BusScreen';
import CreateScreen from '../screen/Board/CreateScreen';

const Stack = createNativeStackNavigator();
const MainStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Main"
        component={MainScreen}
        options={({ navigation }) => ({
          headerTitle: '',
          headerLeft: () => (
            <Image source={require('../../assets/BUDDY.png')} />
          ),
          headerRight: () => (
            <TouchableOpacity
              onPress={() => navigation.navigate('Notification')}
            >
              <Fontisto name="bell" size={24} color="black" />
            </TouchableOpacity>
          ),
          headerStyle: {
            shadowColor: 'transparent',
            elevation: 0,
          },
          headerShadowVisible: false,
        })}
      />

      <Stack.Screen
        name="Notification"
        component={NotificationScreen}
        options={{
          headerTitle: '알림',
          headerShadowVisible: false,
        }}
      />
      <Stack.Screen
        name="Board"
        component={BoardScreen}
        options={{
          headerTitle: '게시판',
          headerShadowVisible: false,
        }}
      />
      <Stack.Screen
        name="Create"
        component={CreateScreen}
        options={{
          headerTitle: '게시판',
          headerShadowVisible: false,
        }}
      />
      <Stack.Screen
        name="Bus"
        component={BusScreen}
        options={{
          headerTitle: '실시간 셔틀버스',
          headerShadowVisible: false,
        }}
      />
      <Stack.Screen
        name="Qr"
        component={QrScreen}
        options={{
          headerTitle: 'QR 탑승하기',
          headerShadowVisible: false,
        }}
      />
      <Stack.Screen
        name="Message"
        component={MessageScreen}
        options={{
          headerTitle: '기사님께 건의하기',
          headerShadowVisible: false,
        }}
      />
      <Stack.Screen
        name="Chat"
        component={ChatScreen}
        options={{
          headerTitle: '채팅',
          headerShadowVisible: false,
        }}
      />
      <Stack.Screen
        name="Map"
        component={MapScreen}
        options={{
          headerTitle: '셔틀 노선도',
          headerShadowVisible: false,
        }}
      />
      <Stack.Screen
        name="Favorite"
        component={FavoriteScreen}
        options={{
          headerTitle: '즐겨찾기',
          headerShadowVisible: false,
        }}
      />
    </Stack.Navigator>
  );
};
export default MainStack;
