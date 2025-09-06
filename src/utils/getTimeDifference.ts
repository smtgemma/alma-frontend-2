const getTimeDifference = (dateString: string | Date): string => {
  const givenDate = new Date(dateString);
  const currentDate = new Date();

  // Validate if givenDate is a valid date
  if (isNaN(givenDate.getTime())) {
    return "Invalid date";
  }

  const diffInSeconds = Math.floor(
    (currentDate.getTime() - givenDate.getTime()) / 1000
  );

  const secondsInMinute = 60;
  const secondsInHour = 60 * secondsInMinute;
  const secondsInDay = 24 * secondsInHour;
  const secondsInWeek = 7 * secondsInDay;
  const secondsInMonth = 30 * secondsInDay;
  const secondsInYear = 365 * secondsInDay;

  if (diffInSeconds < secondsInMinute) {
    return `${diffInSeconds} seconds ago`;
  } else if (diffInSeconds < secondsInHour) {
    return `${Math.floor(diffInSeconds / secondsInMinute)} minutes ago`;
  } else if (diffInSeconds < secondsInDay) {
    return `${Math.floor(diffInSeconds / secondsInHour)} hours ago`;
  } else if (diffInSeconds < secondsInWeek) {
    return `${Math.floor(diffInSeconds / secondsInDay)} days ago`;
  } else if (diffInSeconds < secondsInMonth) {
    return `${Math.floor(diffInSeconds / secondsInWeek)} weeks ago`;
  } else if (diffInSeconds < secondsInYear) {
    return `${Math.floor(diffInSeconds / secondsInMonth)} months ago`;
  } else {
    return `${Math.floor(diffInSeconds / secondsInYear)} years ago`;
  }
};

export default getTimeDifference;
