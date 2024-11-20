import dayjs from 'dayjs';
import React, { useContext, useEffect, useState } from 'react';
import { getMonth } from '../CostemCalender';
// import { MdOutlineArrowForwardIos } from "react-icons/md";
import { MdArrowBackIos } from "react-icons/md";
import { MdArrowForwardIos } from "react-icons/md";
// import GlobalContext from './Context/GlobleContext';
import { GlobalContext, useGlobalContext } from '../Context/GlobleContext';
import { Rows } from 'lucide-react'; 
import handleClick from './Day';


// import Header from './Header';


function SmallCalendar() {
    const [currentMonthIndex, setCurrentMonthIndex] = useState(dayjs().month());
    const [currentMonth, setCurrentMonth] = useState(getMonth(currentMonthIndex));

    useEffect(() => {
        setCurrentMonth(getMonth(currentMonthIndex));
    }, [currentMonthIndex]);

const { monthIndex } = useContext(GlobalContext)
useEffect(() => {
    setCurrentMonthIndex(monthIndex);
}, [monthIndex])

function handlePrevMonth() {
    setCurrentMonthIndex(currentMonthIndex - 1)
}
function handleNextMonth () {
    setCurrentMonthIndex(currentMonthIndex + 1)
}

function getDayClass(day){
  const format = "DD-MM-YY"
  const nowDay = dayjs().format(format)
  const currDay = day.format(format)

  if(nowDay === currDay) {
    return 'bg-blue-500 rounded-full text-white'
  } else {
    return "";
  }
}

// function getDayClass(day) {
// const format = "DD-MM-YY"
// const nowDay = dayjs().format(format) 
// const currDay = day.format(format)
// if (nowDay === currDay) {
//     return 'bg-blue-500 rounded-full text-white'
// } else {
//     return ""; 
// }
// }  
    return (
        <div>
       <div className='pt-8 ml-6 flex'>
        <p className='text-gray-500 font-bold'>
        {dayjs(new Date(dayjs().year(), currentMonthIndex)).format("MMMM YYYY")}
        </p>
        <div>
            
        </div>
        <button > 
            <span className='flex ml-4 gap-3'>
            <MdArrowBackIos onClick={handlePrevMonth} /> <MdArrowForwardIos onClick={handleNextMonth}/>
            </span>
        </button>
      </div>

      <div 
      onClick={handleClick}
       className='grid grid-cols-7 grid-rows-6'>
    {currentMonth[0].map((day,i) => (
        <span key={i} className='text-sm py-1 text-center'>
            {day.format('dd').charAt(0)}
        </span>
    ))}

    {currentMonth.map((row, i) => (
        <React.Fragment key={i}>

{row.map((day, indx) => (
    <button key={indx} className={`py-1 w-full ${getDayClass(day)}` }>
        <span className='text-sm '>
            {day.format('D')}
        </span>
    </button>
))}
        </React.Fragment>
    ))}
        </div>
              
        </div>
        
    );
}  

export default SmallCalendar;
