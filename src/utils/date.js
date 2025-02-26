import { ONE_DAY } from '../constants/times';

export const convertYMD = (date) => date.toISOString().split('T')[0];

export const getCurrentKST = () => {
  const offset = new Date().getTimezoneOffset() * 60 * 1000;
  const kst = new Date(Date.now() - offset);
  return kst;
};

const getPastDate = (dateString, duration) => {
  const initialDateObject = new Date(dateString);
  initialDateObject.setDate(initialDateObject.getDate() - duration);
  return convertYMD(initialDateObject);
};

export const getFutureDate = (dateString, duration) => {
  const initialDateObject = new Date(dateString);
  initialDateObject.setDate(initialDateObject.getDate() + duration);
  return convertYMD(initialDateObject);
};

export const getPreviousMonth = (dateString) => {
  const arr = dateString.split('-');

  if (arr[1] === '01') {
    arr[1] = 12;
    arr[0] = Number(arr[0]) - 1;
  } else {
    arr[1] = Number(arr[1]) - 1;
  }

  if (arr[1] < 10) {
    arr[1] = `0${arr[1]}`;
  }

  return arr.join('-');
};

export const getNextMonth = (dateString) => {
  const arr = dateString.split('-');

  if (arr[1] === '12') {
    arr[1] = '01';
    arr[0] = Number(arr[0]) + 1;
  } else {
    arr[1] =
      Number(arr[1]) + 1 < 10 ? `0${Number(arr[1]) + 1}` : Number(arr[1]) + 1;
  }

  return arr.join('-');
};

export default function getDateList(date) {
  const fullYear = date.getFullYear();
  const today = convertYMD(date);
  const currentMonth = today.split('-')[1];
  const month = date.getMonth();
  const firstDayOfMonth = new Date(fullYear, month).getDay();
  const firstDateOfCurrentMonth = `${fullYear}-${
    month + 1 < 10 ? `0${month + 1}` : month + 1
  }-01`;
  const lastDateOfPreviousMonth = getPastDate(firstDateOfCurrentMonth, 1);

  let d = firstDateOfCurrentMonth;
  let l = lastDateOfPreviousMonth;
  let isFirstWeek = true;
  let dates = [];

  for (let i = 0; i < 6; i++) {
    const week = new Array(7).fill(null);

    for (let j = 0; j < 7; j++) {
      if (isFirstWeek) {
        if (j >= firstDayOfMonth) {
          week[j] = {
            day: d,
            dimmed: d.split('-')[1] !== currentMonth,
            disabled: d < today,
          };

          d = getFutureDate(d, 1);

          if (j === 6) {
            isFirstWeek = false;
            dates.push(week);
            break;
          }
        }
      } else {
        week[j] = {
          day: d,
          disabled: d < today,
          dimmed: d.split('-')[1] !== currentMonth,
        };
        d = getFutureDate(d, 1);
      }

      if (j === 6) {
        dates.push(week);
      }
    }
  }

  dates = dates.flat();
  const lastNullIndex = dates.lastIndexOf(null);

  for (let i = lastNullIndex; i >= 0; i--) {
    dates[i] = {
      day: l,
      disabled: l < today,
      dimmed: true,
    };
    l = getPastDate(l, 1);
  }

  const result = [];

  for (let i = 7; i <= dates.length; i += 7) {
    result.push([...dates.slice(i - 7, i)]);
  }

  return result;
}

export const getRangeBetweenTwoDates = (previousDateString, nextDateString) => {
  const previousDate = new Date(previousDateString);
  const nextDate = new Date(nextDateString);

  const difference = Math.abs(nextDate - previousDate);

  return difference / ONE_DAY + 1;
};

export const toggleDay = (base, id) => {
  if (!base.length) {
    return String(id);
  }

  const arr = base.split('').map(Number);

  if (arr.includes(id)) {
    arr.splice(arr.indexOf(id), 1);
    return arr.join('');
  }

  if (id < arr[0]) {
    return [id, ...arr].join('');
  }

  if (arr[arr.length - 1] < id) {
    return [...arr, id].join('');
  }

  let index;

  for (let i = 0; i < arr.length; i++) {
    const current = arr[i];
    const next = arr[i + 1];

    if (current < id && id < next) {
      index = i + 1;
      break;
    }
  }

  return [...arr.slice(0, index), id, ...arr.slice(index)].join('');
};

export const renderDays = (days) => {
  if (days.length === 7) {
    return '매일';
  }

  const week = [null, '월', '화', '수', '목', '금', '토', '일'];
  return Array.from(days, (dayIndex) => week[dayIndex]).join(' ');
};

export const addMonths = (date, amount) => {
  const tempDate = date ? date : new Date();
  const year = tempDate.getFullYear();
  const month = tempDate.getMonth();
  const day = tempDate.getDate();

  return new Date(year, month + amount, day);
};

export const addMonths2 = (date, months) => {
  const expectedMonth = (((date.getMonth() + months) % 12) + 12) % 12;
  let result = new Date(date);
  result.setMonth(result.getMonth() + months);

  if (result.getMonth() !== expectedMonth) {
    result.setDate(0);
  }

  return result;
};

export const subMonths = (date, amount) => {
  const tempDate = date ? date : new Date();
  const year = tempDate.getFullYear();
  const month = tempDate.getMonth();
  const day = tempDate.getDate();

  return new Date(year, month - amount, day);
};

export const formatMonth = (date, format) => {
  const tempDate = new Date(date);
  const year = tempDate.getFullYear();
  const month = tempDate.getMonth() + 1;
  let newMonth = `${month}`;

  if (month < 10) newMonth = `0${newMonth}`;

  const result = format
    ? `${year}${format}${newMonth}`
    : `${year}년 ${newMonth}월`;

  return result;
};
