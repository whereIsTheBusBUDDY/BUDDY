import { createStackNavigator } from '@react-navigation/stack';
import BoardScreen from '../screen/Board/BoardScreen';
import DetailScreen from '../screen/Board/DetailScreen';
import CreateScreen from '../screen/Board/CreateScreen';
import QrScanner from '../screen/CheckIn/QrScreen';
import { Fontisto } from '@expo/vector-icons';
import { Image } from 'react-native';

const Stack = createStackNavigator();

const BoardStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Board"
        component={BoardScreen}
        options={{
          headerTitle: '게시판',
          headerShadowVisible: false,
        }}
      />
      <Stack.Screen
        name="Detail"
        component={DetailScreen}
        options={{
          headerTitle: '',
          headerShadowVisible: false,
        }}
      />
      <Stack.Screen
        name="Create"
        component={CreateScreen}
        options={{
          headerTitle: '글쓰기',
          headerShadowVisible: false,
        }}
      />
    </Stack.Navigator>
  );
};

export default BoardStack;
