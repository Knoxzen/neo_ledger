'use client';

import React, { useState } from 'react';
import { cn } from '@/lib/utils';

interface SensitivitySliderProps {
  label: string;
  initialValue: number;
  description: string;
}

export function SensitivitySlider({ label, initialValue, description }: SensitivitySliderProps) {
  const [value, setValue] = useState(initialValue);

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <label className="text-[10px] font-bold tracking-[0.2em] text-white/60 uppercase">
          {label}
        </label>
        <span className="font-mono text-sm font-black text-[#BBFF00]">
          {value.toFixed(2)}
        </span>
      </div>
      
      <div className="relative h-1 w-full bg-white/20">
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={value}
          onChange={(e) => setValue(parseFloat(e.target.value))}
          className="absolute inset-0 z-10 w-full cursor-pointer appearance-none bg-transparent [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:bg-[#BBFF00] [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-black"
        />
        <div 
          className="absolute inset-0 bg-[#BBFF00]" 
          style={{ width: `${value * 100}%` }}
        />
      </div>
      
      <p className="mt-4 text-[10px] font-bold leading-relaxed tracking-wide text-white/40 uppercase">
        {description}
      </p>
    </div>
  );
}
