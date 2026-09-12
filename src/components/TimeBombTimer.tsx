"use client";
import React, { useState, useEffect } from 'react';

export function TimeBombTimer({ timestamp }: { timestamp: number }) {
  const [timeLeft, setTimeLeft] = useState<string>("");
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    const updateTimer = () => {
      const now = Date.now();
      const expiresAt = timestamp + (24 * 60 * 60 * 1000); // 24 hours
      const diff = expiresAt - now;

      if (diff <= 0) {
        setIsExpired(true);
        setTimeLeft("00:00:00");
        return;
      }

      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft(
        `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
      );
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [timestamp]);

  if (isExpired) {
    return <span className="text-zinc-600 font-mono font-bold tracking-widest uppercase text-[10px]">💥 Shattered</span>;
  }

  return (
    <div className="flex items-center gap-1.5 bg-red-500/10 px-2 py-1 rounded-md border border-red-500/20">
      <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
      <span className="text-red-400 font-mono font-bold tracking-widest text-[10px]">
        {timeLeft}
      </span>
    </div>
  );
}
