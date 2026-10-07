export function formatEta(seconds: number): { text: string; isArriving: boolean; rawMinutes: number } {
  if (seconds <= 45) {
    return { text: 'Arr', isArriving: true, rawMinutes: 0 };
  }
  const minutes = Math.ceil(seconds / 60);
  return {
    text: `${minutes}m`,
    isArriving: false,
    rawMinutes: minutes,
  };
}

export function formatTimeAgo(timestampStr: string): string {
  return timestampStr;
}
