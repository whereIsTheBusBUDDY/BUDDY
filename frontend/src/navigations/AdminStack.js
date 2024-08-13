import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Image } from 'react-native';
import { Fontisto } from '@expo/vector-icons';
import AdminMainScreen from '../screen/admin/AdminMainScreen';
import AdminSelectBus from '../screen/admin/AdminSelectBusScreen';
import AdminSelectBusScreen from '../screen/admin/AdminSelectBusScreen';
import AdminMapScreen from '../screen/admin/AdminMapScreen';
import BoardStack from './BoardStack';
import AdminSuggestScreen from '../screen/admin/AdminSuggestScreen';

const Stack = createNativeStackNavigator();
const AdminStack = () => {
  return (
    <Stack.Navigator initialRouteName="SelectBusAdmin">
      <Stack.Screen
        name="SelectBusAdmin"
        component={AdminSelectBusScreen}
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
        name="AdminMain"
        component={AdminMainScreen}
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
        name="AdminMapScreen"
        component={AdminMapScreen}
        options={{
          headerTitle: '',
          headerStyle: {
            shadowColor: 'transparent',
            elevation: 0,
          },
          headerShadowVisible: false,
          headerTransparent: true,
        }}
      />
      <Stack.Screen
        name="Suggest"
        component={AdminSuggestScreen}
        options={{
          headerTitle: '건의함 보기',
          headerShadowVisible: false,
        }}
      />
      <Stack.Screen
        name="UserBoard"
        component={BoardStack}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
};
export default AdminStack;
