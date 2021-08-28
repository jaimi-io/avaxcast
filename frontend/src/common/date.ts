function getDate(): string {
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

export { getDate };
