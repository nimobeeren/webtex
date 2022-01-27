import { useEffect, useState } from "react";

const DAYS_PER_YEAR = 365.25;
const DAYS_PER_MONTH = DAYS_PER_YEAR / 12;

const rtf = new Intl.RelativeTimeFormat("en", {
  numeric: "auto" // use "yesterday" instead of "1 day ago"
});

type TimeAgoProps = {
  date: Date;
  updateInterval?: number;
};

export function TimeAgo({ date, updateInterval = 10000 }: TimeAgoProps) {
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

  const millis = currentDate.getTime() - date.getTime();
  const seconds = Math.floor(millis / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / DAYS_PER_MONTH);
  const years = Math.floor(days / DAYS_PER_YEAR);

  let formatted: string;
  if (seconds < 10) {
    formatted = "just now";
  } else if (minutes < 1) {
    formatted = rtf.format(-seconds, "seconds");
  } else if (hours < 1) {
    formatted = rtf.format(-minutes, "minutes");
  } else if (days < 1) {
    formatted = rtf.format(-hours, "hours");
  } else if (months < 1) {
    formatted = rtf.format(-days, "days");
  } else if (years < 1) {
    formatted = rtf.format(-months, "months");
  } else {
    formatted = rtf.format(-years, "years");
  }

  return <span>{formatted}</span>;
}
