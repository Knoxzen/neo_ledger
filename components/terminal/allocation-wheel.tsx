'use client';

import React from 'react';

export function AllocationWheel() {
  // Simple donut chart using SVG
  const size = 160;
  const strokeWidth = 12;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  
  // Example values: 75% spent (magenta), 25% remaining (green)
  const spentPercent = 75;
  const offset = circumference - (spentPercent / 100) * circumference;

  return (
    <div className="border-2 border-white bg-black p-6 flex flex-col items-center">
      <h3 className="text-[10px] font-bold tracking-[0.2em] text-white/40 uppercase mb-8 self-start">
        ALLOC // LIQUIDITY
      </h3>
      
      <div className="relative flex items-center justify-center">
        <svg width={size} height={size} className="transform -rotate-90">
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#222"
            strokeWidth={strokeWidth}
            fill="none"
          />
          {/* Spent segment */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#FF00FF"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="square"
            fill="none"
          />
          {/* Remaining segment (simplified) */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#BBFF00"
            strokeWidth={strokeWidth}
            strokeDasharray={`${circumference * 0.25} ${circumference}`}
            strokeDashoffset={0}
            strokeLinecap="square"
            fill="none"
            className="opacity-50"
          />
        </svg>
        
        <div className="absolute flex flex-col items-center">
          <div className="text-[10px] font-black tracking-widest text-[#BBFF00]">ALLOC</div>
          <div className="h-0.5 w-8 bg-white/20 mt-1" />
        </div>
      </div>
      
      <div className="mt-8 w-full flex justify-between border-t border-white/10 pt-4">
        <div className="flex flex-col">
          <span className="text-[8px] font-bold text-white/40 uppercase">REMAINING_LIQUIDITY</span>
          <span className="text-[10px] font-black text-[#BBFF00]">$2,132.44</span>
        </div>
      </div>
    </div>
  );
}
