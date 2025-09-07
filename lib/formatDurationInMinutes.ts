export function formatDurationInMinutes(durationInMinutes: number) {
  // how many hours are in duration
  const hours = Math.floor(durationInMinutes / 60);
  const minutes = durationInMinutes % 60; //will return remained minutes (if they exists) after dividing all minutes by 60

  const minutesString = `${minutes} ${minutes > 1 ? "minutes" : "minute"}`;
  const hoursString = `${hours} ${hours > 1 ? "hours" : "hour"}`;

  if (hours === 0) return minutesString;
  if (minutes === 0) return hoursString;

  return `${hoursString} ${minutesString}`;
}

export function parseDateInISOString(isoTimeString: Date) {
  const isoDate = new Date(isoTimeString).toISOString();
  const isoTime = isoDate.slice(11, 16);
  return isoTime;
}

export function parseIsoDateInLocalHoursAndMinutes(
  isoTimeString: string | undefined
) {
  if (!isoTimeString) return "";
  const hours = new Date(isoTimeString).getHours();
  const minutes = new Date(isoTimeString).getMinutes();
  const time = `${hours < 10 ? "0" + hours : hours}:${
    minutes < 10 ? "0" + minutes : minutes
  }`;

  return time;
}
