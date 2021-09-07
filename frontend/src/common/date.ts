export function getDate(): string {
  const MAX_DATE_NUM = 9;
  const currentDate = new Date(Date.now());
  const day = currentDate.getDate();
  const month = currentDate.getMonth() + 1;
  const year = currentDate.getFullYear();
  const dateString = `${year}-${month <= MAX_DATE_NUM ? `0${month}` : month}-${
    day <= MAX_DATE_NUM ? `0${day}` : day
  }`;
  return dateString;
}

function dateToString(date: Date): string {
  const MAX_DATE_NUM = 9;
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  const dateString = `${year}-${month <= MAX_DATE_NUM ? `0${month}` : month}-${
    day <= MAX_DATE_NUM ? `0${day}` : day
  }`;
  return dateString;
}

const MONTH_OFFSET = 1;

export function monthAfter(dt: string): string {
  const date = new Date(dt);
  return dateToString(new Date(date.setMonth(date.getMonth() + MONTH_OFFSET)));
}
