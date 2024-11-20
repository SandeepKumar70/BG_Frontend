import dayjs from 'dayjs';

export function getMonth(month = dayjs().month()) {
month = Math.floor(month)

  // Validate month input
  if (month < 0 || month > 360) {
    throw new Error('Month must be between 0 and 12');
    console.log("month", month)
  }

  const year = dayjs().year();
  const firstDayOfTheMonth = dayjs(new Date(year, month, 1)).day();
  const daysInMonth = dayjs(new Date(year, month + 1, 0)).date();
 {daysInMonth}
  let currentMonthCount = 0 - firstDayOfTheMonth;
  console.log("firstDayOfTheMonth", firstDayOfTheMonth);
  
  // Use 6 rows to ensure all months can be displayed properly
  const  daysMatrix  = new Array(6).fill([]).map(() => {
    return new Array(6).fill(null).map(() => {
      currentMonthCount++;
      return dayjs(new Date(year, month, currentMonthCount));

    //  console.log("daysMatrix", daysMatrix)
    });

  });
  
  return daysMatrix;
}

// Test the function
try {
  const monthMatrix = getMonth();
  console.log(monthMatrix);
} catch (error) {
  console.error('Error:', error.message);
}

