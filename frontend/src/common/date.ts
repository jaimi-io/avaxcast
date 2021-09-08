/**
 * Changes a Date to a string in the format yyyy/mm/dd
 * @param date - The date to be formatted
 * @returns The date as a formatted string
 */
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

/**
 * Gets the current date as a string in the format yyyy/mm/dd
 * @returns The current date as a formatted string
 */
export function getCurrentDateString(): string {
  return dateToString(new Date());
}

const MONTH_OFFSET = 1;

/**
 * Gets the date one month after the given date in the format yyyy/mm/dd
 * @param oldDate - A date in the format yyyy/mm/dd
 * @returns The new date
 */
export function monthAfter(oldDate: string): string {
  const date = new Date(oldDate);
  return dateToString(new Date(date.setMonth(date.getMonth() + MONTH_OFFSET)));
}
