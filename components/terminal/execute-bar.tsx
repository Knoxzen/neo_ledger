'use client';

import React, { useState } from 'react';
import { Terminal } from 'lucide-react';
import { cn } from '@/lib/utils';

export function ExecuteBar() {
  const [command, setCommand] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Executing command:', command);
    setCommand('');
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={cn(
        'relative flex items-center border-2 border-white bg-black/50 px-3 py-1.5 transition-all w-full max-w-[300px]',
        isFocused ? 'border-[#BBFF00] shadow-[0_0_15px_rgba(187,255,0,0.2)]' : 'border-white/20'
      )}
    >
      <Terminal className={cn(
        'mr-2 size-4 transition-colors',
        isFocused ? 'text-[#BBFF00]' : 'text-white/40'
      )} />
      <input
        type="text"
        value={command}
        onChange={(e) => setCommand(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder="EXECUTE COMMAND..."
        className="flex-1 bg-transparent text-[10px] font-bold tracking-widest text-white outline-none placeholder:text-white/20"
      />
      <div className="ml-2 flex h-4 w-4 items-center justify-center border border-white/20 text-[8px] font-bold text-white/40">
        ↵
      </div>
    </form>
  );
}
