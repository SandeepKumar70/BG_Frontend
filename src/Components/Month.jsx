import React from "react";
import Day from "./Day";

export default function Month({ Month }) {
  return (
    <div className="flex-1 grid grid-cols-7 grid-row-5">
      {Month.map((row, i) => (
        <React.Fragment key={i}>
          {row.map((day, index) => (
            <Day day={day} key={index}  rowIndex={index}/>
          ))}
        </React.Fragment>
      ))}
    </div>
  );
}
