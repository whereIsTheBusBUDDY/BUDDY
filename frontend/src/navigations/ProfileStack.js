import { createStackNavigator } from '@react-navigation/stack';
import ProfileScreen from '../screen/Account/ProfileScreen';
import { Fontisto } from '@expo/vector-icons';
import { Image } from 'react-native';
import EditProfileScreen from '../screen/Account/EditProfileScreen';
import LoginScreen from '../screen/Account/LoginScreen';

const Stack = createStackNavigator();

const ProfileStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          headerTitle: '마이페이지',
          headerShadowVisible: false,
        }}
      />
      <Stack.Screen
        name="EditProfile"
        component={EditProfileScreen}
        options={{
          headerTitle: '프로필 수정하기',
          headerShadowVisible: false,
        }}
      />
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
};

export default ProfileStack;
