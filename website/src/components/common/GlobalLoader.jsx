"use client";

import React, { useEffect, useState } from 'react';

export const GlobalLoader = () => {
  const [activeRequests, setActiveRequests] = useState(0);
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleStart = () => {
      setActiveRequests(prev => prev + 1);
    };

    const handleEnd = () => {
      setActiveRequests(prev => Math.max(0, prev - 1));
    };

    window.addEventListener('axios-request-start', handleStart);
    window.addEventListener('axios-request-end', handleEnd);

    return () => {
      window.removeEventListener('axios-request-start', handleStart);
      window.removeEventListener('axios-request-end', handleEnd);
    };
  }, []);

  const isLoading = activeRequests > 0;

  useEffect(() => {
    let interval;
    if (isLoading) {
      setVisible(true);
      setProgress(10);
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) return 90;
          return prev + Math.floor(Math.random() * 10) + 2;
        });
      }, 200);
    } else {
      setProgress(100);
      const timeout = setTimeout(() => {
        setVisible(false);
        setProgress(0);
      }, 500);
      return () => clearTimeout(timeout);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isLoading]);

  if (!visible) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[9999] pointer-events-none">
      {/* Sleek, glowing gradient progress bar */}
      <div 
        className="h-[3px] bg-gradient-to-r from-primary-500 via-secondary-500 to-pink-500 transition-all duration-300 ease-out shadow-[0_1px_10px_rgba(239,68,68,0.5)]"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
};

export default GlobalLoader;
