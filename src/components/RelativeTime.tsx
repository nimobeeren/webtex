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
  const [seconds, setSeconds] = useState<number>();

  useEffect(() => {
    console.log(date);
    setSeconds(new Date().getUTCSeconds() - date.getUTCSeconds());

    if (0 < updateInterval && updateInterval < Infinity) {
      const intervalId = window.setInterval(() => {
        setSeconds(new Date().getUTCSeconds() - date.getUTCSeconds());
      }, updateInterval);

      return () => {
        if (intervalId) {
          window.clearInterval(intervalId);
        }
      };
    }
  }, [date, updateInterval]);

  if (seconds === undefined) {
    return null;
  }
  if (seconds < 10) {
    return <span>Just now</span>;
  }
  if (seconds < 60) {
    return <span>{`${seconds} seconds ago`}</span>;
  }
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) {
    return <span>{`${minutes} minutes ago`}</span>;
  }
  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return <span>{`${hours} hours ago`}</span>;
  }
  const days = Math.floor(hours / 24);
  if (days < DAYS_PER_MONTH) {
    return <span>{`${days} days ago`}</span>;
  }
  const months = Math.floor(days / DAYS_PER_MONTH);
  if (months < 12) {
    return <span>{`${months} months ago`}</span>;
  }
  const years = Math.floor(days / DAYS_PER_YEAR);
  return <span>{`${years} years ago`}</span>;
}
