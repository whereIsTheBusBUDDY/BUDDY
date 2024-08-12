// NotificationContext.js
import React, { createContext, useState } from 'react';

export const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(false);

  return (
    <NotificationContext.Provider
      value={{ hasUnreadNotifications, setHasUnreadNotifications }}
    >
      {children}
    </NotificationContext.Provider>
  );
};
