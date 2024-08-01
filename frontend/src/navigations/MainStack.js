import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MainScreen from '../screen/MainScreen';
import ChatScreen from '../screen/CheckIn/ChatScreen';
import BoardScreen from '../screen/Board/BoardScreen';
import MessageScreen from '../screen/CheckIn/MessageScreen';
import { Image, TouchableOpacity } from 'react-native';
import { Fontisto } from '@expo/vector-icons';
import NotificationScreen from '../screen/NotificationScreen';

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
        name="Chat"
        component={ChatScreen}
        options={{
          headerTitle: '채팅',
          headerShadowVisible: false,
        }}
      />
      <Stack.Screen name="Board" component={BoardScreen} />
      <Stack.Screen
        name="Notification"
        component={NotificationScreen}
        options={{
          headerTitle: '알림',
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
    </Stack.Navigator>
  );
};
export default MainStack;
