export function formatmessageTime(date) {
  if (!date) return ''; // handle missing or null dates
  const d = new Date(date);
  if (isNaN(d.getTime())) return ''; // handle invalid date formats
  return d.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
}
