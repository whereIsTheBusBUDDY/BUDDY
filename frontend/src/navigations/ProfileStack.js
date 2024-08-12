import { createStackNavigator } from '@react-navigation/stack';
import ProfileScreen from '../screen/Account/ProfileScreen';
import EditProfileScreen from '../screen/Account/EditProfileScreen';
import ChangePassword from '../screen/Account/ChangePassword';
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
        name="ChangePassword"
        component={ChangePassword}
        options={{
          headerTitle: '비밀번호 변경하기',
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
