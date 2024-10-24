import ContentTab from './ContentTab';
import { useFirstContext } from '../context/FirstContent';
import FirstStack from './FirstStack';
import { useUserContext } from '../context/UserContext';
import LoginStack from './LoginStack';
import AdminStack from './AdminStack';
import { AppRegistry } from 'react-native';
// import App from '../App'; // App 컴포넌트의 정확한 경로를 확인하세요.
import { name as appName } from '../../app.json'; // app.json 파일의 정확한 경로를 확인하세요.

AppRegistry.registerComponent(appName, () => App);

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
