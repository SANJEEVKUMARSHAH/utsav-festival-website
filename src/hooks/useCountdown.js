import { useEffect, useState } from "react";
export function useCountdown(targetDate) {
  const getRemaining = () => {
    const diff = Math.max(0, new Date(`${targetDate}T00:00:00+05:45`).getTime() - Date.now());
    return {
      total: diff,
      days: Math.floor(diff / 86400000),
      hours: Math.floor(diff % 86400000 / 3600000),
      minutes: Math.floor(diff % 3600000 / 60000),
      seconds: Math.floor(diff % 60000 / 1000)
    };
  };
  const [remaining, setRemaining] = useState(getRemaining);
  useEffect(() => {
    const id = setInterval(() => setRemaining(getRemaining()), 1000);
    return () => clearInterval(id);
  }, [targetDate]);
  return remaining;
}
