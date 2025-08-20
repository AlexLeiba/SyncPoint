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
