import { createContext, useContext, useState } from 'react';
import PropTypes from 'prop-types';

const UserContext = createContext();
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(false);
  const [loginUser, setLoginUser] = useState(null);
  return (
    <UserContext.Provider value={{ user, setUser, loginUser, setLoginUser }}>
      {children}
    </UserContext.Provider>
  );
};
UserProvider.prototypes = {
  children: PropTypes.node,
};

export const useUserContext = () => useContext(UserContext);
export default UserContext;
