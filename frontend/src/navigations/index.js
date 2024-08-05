import { NavigationContainer } from '@react-navigation/native';
import ContentTab from './ContentTab';
import MainStack from './MainStack';
import { useFirstContext } from '../context/FirstContent';
import FirstStack from './FirstStack';
import { useUserContext } from '../context/UserContext';
import LoginStack from './LoginStack';
import AdminStack from './AdminStack';
import AdminContext, { AdminProvider } from '../context/AdminContext';

const Navigation = () => {
  const { screen } = useFirstContext();
  const { user, loginUser } = useUserContext();
  console.log('user', user);
  console.log('screen', screen);
  console.log('login User', loginUser);
  if (screen && loginUser == null) {
    return <FirstStack />;
  } else if (!screen && loginUser != null) {
    if (loginUser.role === 'ADMIN') {
      return <AdminStack />;
    } else {
      return <ContentTab />;
    }
  } else if (!screen && loginUser == null) {
    return <LoginStack />;
  }
};

export default Navigation;
