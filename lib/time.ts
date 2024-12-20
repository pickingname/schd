export function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  const seconds = 0; // We'll keep seconds as 0 since we're working with minute precision

  const parts = [];
  
  if (hours > 0) {
    parts.push(`${hours} hour${hours !== 1 ? 's' : ''}`);
  }
  if (remainingMinutes > 0) {
    parts.push(`${remainingMinutes} min${remainingMinutes !== 1 ? 's' : ''}`);
  }
  if (parts.length === 0) {
    parts.push(`${seconds} seconds`);
  }

  return parts.join(' ');
}

export function formatTimeLeft(minutes: number, subject?: string): string {
  const formattedTime = formatDuration(minutes);
  if (subject) {
    return `${formattedTime} of ${subject} left`;
  }
  return `${formattedTime} of free time left`;
}