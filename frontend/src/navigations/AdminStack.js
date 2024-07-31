import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Image } from 'react-native';
import { Fontisto } from '@expo/vector-icons';
import AdminMainScreen from '../screen/admin/AdminMainScreen';
import AdminSelectBus from '../screen/admin/AdminSelectBusScreen';
import AdminSelectBusScreen from '../screen/admin/AdminSelectBusScreen';
import AdminMapScreen from '../screen/admin/AdminMapScreen';

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
          headerRight: () => <Fontisto name="bell" size={24} color="black" />,
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
          headerRight: () => <Fontisto name="bell" size={24} color="black" />,
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
    </Stack.Navigator>
  );
};
export default AdminStack;
