import { createStackNavigator } from '@react-navigation/stack';
import BoardScreen from '../screen/Board/BoardScreen';
import DetailScreen from '../screen/Board/DetailScreen';

const Stack = createStackNavigator();

const BoardStack = () => {
  return (
    <Stack.Navigator initialRouteName="Board">
      <Stack.Screen
        name="Board"
        component={BoardScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Detail"
        component={DetailScreen}
        options={{ title: 'Detail' }}
      />
    </Stack.Navigator>
  );
};

export default BoardStack;
