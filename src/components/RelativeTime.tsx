import { useEffect, useState } from "react";

type RelativeTimeProps = {
  date: Date;
  updateInterval?: number;
};

const DAYS_PER_YEAR = 365.25;
const DAYS_PER_MONTH = DAYS_PER_YEAR / 12;

export function RelativeTime({
  date,
  updateInterval = 1000
}: RelativeTimeProps) {
  const [currentDate, setCurrentDate] = useState<Date>(() => new Date());

  useEffect(() => {
    if (0 < updateInterval && updateInterval < Infinity) {
      const intervalId = window.setInterval(() => {
        setCurrentDate(new Date());
      }, updateInterval);

      return () => {
        if (intervalId) {
          window.clearInterval(intervalId);
        }
      };
    }
  }, [updateInterval]);

  const millis = currentDate.getTime() - date.getTime()
  const seconds = Math.floor(millis / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / DAYS_PER_MONTH);
  const years = Math.floor(days / DAYS_PER_YEAR);

  if (seconds < 10) {
    return <span>just now</span>;
  }
  if (minutes < 1) {
    return <span>{`${seconds} seconds ago`}</span>;
  }
  if (hours < 1) {
    return <span>{`${minutes} minutes ago`}</span>;
  }
  if (days < 1) {
    return <span>{`${hours} hours ago`}</span>;
  }
  if (months < 1) {
    return <span>{`${days} days ago`}</span>;
  }
  if (years < 1) {
    return <span>{`${months} months ago`}</span>;
  }
  return <span>{`${years} years ago`}</span>;
}
