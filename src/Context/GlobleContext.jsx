import React, { createContext, useContext, useState } from 'react';
// import { useGlobalContext } from '../Context/GlobleContext'



export const GlobalContext = React.createContext();

export const useGlobalContext = () => useContext(GlobalContext);

export const GlobalProvider = ({ children }) => {
  const [monthIndex, setMonthIndex] = useState(0);
  const [showEventModel, setShowEventModel] = useState(false);

  return (
    <GlobalContext.Provider value={{ monthIndex, setMonthIndex, showEventModel, setShowEventModel }}>
      {children}
    </GlobalContext.Provider>
  );
};