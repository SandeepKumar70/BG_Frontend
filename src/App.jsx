import React, { useState, useEffect } from "react";
import { getMonth } from "./CostemCalender";
import "./App.css";
// import CalenderHeader from "./Components/CalenderHeader";
import SideBar from "./Components/SideBar";
import Month from "./Components/Month";
import Day from "./Components/Day";
// import { GlobalProvider, useGlobalContext } from './Context/GlobalContext';
import { useGlobalContext } from "./Context/GlobleContext";
import { GlobalProvider } from "./Context/GlobleContext";
import Header from "./Components/Header";
// import CreateEventButton from "./Components/CreateEventButton";
import EventModel from "./Components/EventModel";
import TaskPopUP from "./Components/TaskPopUP";
// import TimeAuto from './Components/TimeAuto';


function AppContent() {
  const [currentMonth, setCurrentMonth] = useState(getMonth());
  const { monthIndex } = useGlobalContext();

  useEffect(() => {
    setCurrentMonth(getMonth(monthIndex));
  }, [monthIndex]);

  return (
    <>
      <Header  />
   
      <EventModel />
       {/* <TimeAuto />  */}
      <div className="h-screen flex flex-col">
        <div className="flex flex-1">
        <SideBar />
          {/* <CalenderHeader /> */}
         
          <Month Month={currentMonth} />
          <Day />
       
        </div>
      </div>
    </>
  );
}

function App() {
  return (
    <GlobalProvider>
      <AppContent />
    </GlobalProvider>
  );
}

export default App;