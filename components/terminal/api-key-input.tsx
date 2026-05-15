'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff } from 'lucide-react';

interface ApiKeyInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function ApiKeyInput({ label, value, onChange, placeholder }: ApiKeyInputProps) {
  const [show, setShow] = useState(false);

  return (
    <div className="mb-6">
      <label className="mb-2 block text-[10px] font-bold tracking-[0.2em] text-white/60 uppercase">
        {label}
      </label>
      <div className="flex gap-2">
        <div className="relative flex flex-1 items-center border-2 border-white/20 bg-black px-4 py-3">
          <input
            type={show ? 'text' : 'password'}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder || '[ TOKEN_PENDING... ]'}
            className="w-full bg-transparent text-xs font-bold tracking-widest text-white outline-none placeholder:text-white/20"
          />
          <button
            type="button"
            onClick={() => setShow(!show)}
            className="ml-2 text-white/40 hover:text-white"
          >
            {show ? <EyeOff size={14} /> : <Eye size={14} />}
          </button>
          <div className="ml-4 flex items-center">
            <div className={`h-1.5 w-1.5 rounded-full ${value ? 'bg-[#BBFF00]' : 'bg-red-500'} animate-pulse`} />
          </div>
        </div>
      </div>
    </div>
  );
}
