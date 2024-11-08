// CountdownTimer.tsx (Client Component)
"use client";

import { Clock } from "lucide-react";
import { useState, useEffect } from "react";

const TimeUnit = ({ value, label }: { value: number; label: string }) => (
  <div className="flex flex-col items-center mx-2">
    <div className="bg-white text-black w-12 h-12 rounded-lg flex items-center justify-center font-bold text-xl">
      {value.toString().padStart(2, "0")}
    </div>
    <span className="text-xs mt-1 text-gray-200">{label}</span>
  </div>
);

export function CountdownTimer({ endDate }: { endDate: string }) {
  const [timeLeft, setTimeLeft] = useState({
    days: 1,
    hours: 2,
    minutes: 23,
    seconds: 1,
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const endTime = new Date(endDate).getTime();
      const now = new Date().getTime();
      const difference = endTime - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      }
    };

    const timer = setInterval(calculateTimeLeft, 1000);
    calculateTimeLeft();

    return () => clearInterval(timer);
  }, [endDate]);

  return (
    <div className="bg-black/30 p-6 rounded-xl backdrop-blur-sm">
      <div className="flex flex-col items-center">
        <div className="flex items-center mb-4">
          <Clock className="w-5 h-5 text-red-300 mr-2" />
          <span className="text-gray-200 font-medium">Offer Ends In:</span>
        </div>
        <div className="flex space-x-2">
          <TimeUnit value={timeLeft.days} label="DAYS" />
          <TimeUnit value={timeLeft.hours} label="HOURS" />
          <TimeUnit value={timeLeft.minutes} label="MINS" />
          <TimeUnit value={timeLeft.seconds} label="SECS" />
        </div>
      </div>
    </div>
  );
}
