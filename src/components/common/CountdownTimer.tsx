"use client";

import React from "react";
import Countdown, { zeroPad } from "react-countdown";

interface CountdownTimerProps {
  endDate: Date;
}

const Box: React.FC<{ label: string; value: number }> = ({ label, value }) => (
  <div className="flex items-center">
    <div className="border-b-2 border-red-500 px-1 py-1 sm:py-2">
      <span className="text-sm sm:text-base md:text-lg font-semibold text-gray-800 bg-gray-100 px-2 sm:px-3 py-1 sm:py-2 rounded-lg">
        {zeroPad(value, 2)}
      </span>
    </div>
    <span className="text-xs md:text-sm font-medium text-gray-600 ml-1 sm:ml-2">
      {label}
    </span>
  </div>
);

export const CountdownTimer: React.FC<CountdownTimerProps> = ({ endDate }) => {
  return (
    <Countdown
      date={endDate}
      // Do not re-render the whole app; only this subtree updates
      intervalDelay={1000}
      precision={0}
      renderer={({ days, hours, minutes, seconds }) => (
        <div className="flex flex-wrap gap-2 sm:gap-3">
          <Box label="Giorni" value={days} />
          <Box label="Ore" value={hours} />
          <Box label="Minuti" value={minutes} />
          <Box label="Secondi" value={seconds} />
        </div>
      )}
    />
  );
};

export default CountdownTimer;


