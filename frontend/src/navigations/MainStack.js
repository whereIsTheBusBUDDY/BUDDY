import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MainScreen from '../screen/MainScreen';
import ChatScreen from '../screen/ChatScreen';
import BoardScreen from '../screen/Board/BoardScreen';
import MessageScreen from '../screen/MessageScreen';
import { Image } from 'react-native';
import { Fontisto } from '@expo/vector-icons';

const Stack = createNativeStackNavigator();
const MainStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Main"
        component={MainScreen}
        options={{
          headerTitle: '',
          headerLeft: () => (
            <Image source={require('../../assets/BUDDY.png')} />
          ),
          headerRight: () => <Fontisto name="bell" size={24} color="black" />,
          headerStyle: {
            shadowColor: 'transparent',
            elevation: 0,
          },
          headerShadowVisible: false,
        }}
      />
      <Stack.Screen name="Chat" component={ChatScreen} />
      <Stack.Screen name="Board" component={BoardScreen} />
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
