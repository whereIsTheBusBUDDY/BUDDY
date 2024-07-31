import { createContext, useContext, useState } from 'react';
import PropTypes from 'prop-types';

const FirstContext = createContext();
export const FirstProvider = ({ children }) => {
  const [screen, setScreen] = useState(true);
  return (
    <FirstContext.Provider value={{ screen, setScreen }}>
      {children}
    </FirstContext.Provider>
  );
};
FirstProvider.prototypes = {
  children: PropTypes.node,
};

export const useFirstContext = () => useContext(FirstContext);
export default FirstProvider;
