export const formatDistance = (distance: number | null | undefined): string => {
  const value = distance ?? 0;
  return value >= 1000 ? `${value / 1000} km` : `${value} m`;
};

export const formatDuration = (duration: number | null | undefined): string => {
  const totalSeconds = Math.max(0, duration ?? 0);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};