export const formatDuration = (durationInMinutes: number): string => {
  if (durationInMinutes === null || durationInMinutes === undefined || durationInMinutes < 0) {
    return 'N/A';
  }
  const hours = Math.floor(durationInMinutes / 60);
  const minutes = durationInMinutes % 60;

  if (hours > 0 && minutes > 0) {
    return `${hours}h ${minutes}m`;
  } else if (hours > 0) {
    return `${hours}h`;
  } else if (minutes > 0) {
    return `${minutes}m`;
  } else {
    return '0m';
  }
};