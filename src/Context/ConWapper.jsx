import React, {useState, } from 'react'
import GlobalContext from './GlobleContext'
import dayjs from 'dayjs'
import TimeRangePicker from '../Components/TimeAuto'

export default function ConWapper(props) {
const [monthIndex, setMonthIndex] = useState (dayjs().month)
c
  return (
    <GlobalContext.Provider value={{ monthIndex, setMonthIndex, TimeRangePicker }}>
         {props.children}
    </GlobalContext.Provider>
  )
}

