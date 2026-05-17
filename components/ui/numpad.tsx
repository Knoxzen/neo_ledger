import * as React from "react"
import { Button } from "./button"
import { Delete } from "lucide-react"

interface NumpadProps {
  value: string;
  onChange: (value: string) => void;
}

export function Numpad({ value, onChange }: NumpadProps) {
  const handlePress = (key: string) => {
    if (key === 'backspace') {
      onChange(value.slice(0, -1));
    } else if (key === '.') {
      if (!value.includes('.')) {
        onChange(value + '.');
      }
    } else {
      // Prevent leading zeros if the value is just '0'
      if (value === '0' && key !== '.') {
        onChange(key);
      } else {
        onChange(value + key);
      }
    }
  };

  const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0'];

  return (
    <div className="grid grid-cols-3 gap-2 p-3 bg-[#050505] border-2 border-white/20 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)] w-64">
      {/* Display header inside the numpad so user sees what they type */}
      <div className="col-span-3 bg-[#121212] border border-white/10 p-3 text-right text-xl font-black text-white h-12 flex items-center justify-end overflow-hidden">
        {value || "0"}
      </div>
      
      {keys.map((key) => (
        <Button
          key={key}
          variant="outline"
          className="text-white border-white/20 bg-[#121212] hover:bg-[#BBFF00] hover:text-black hover:border-[#BBFF00] text-xl font-black rounded-none h-14 transition-colors"
          onClick={() => handlePress(key)}
        >
          {key}
        </Button>
      ))}
      <Button
        variant="outline"
        className="text-white border-white/20 bg-[#121212] hover:bg-red-500 hover:text-white hover:border-red-500 rounded-none h-14 transition-colors"
        onClick={() => handlePress('backspace')}
      >
        <Delete className="w-6 h-6" />
      </Button>
      <Button
        variant="outline"
        className="col-span-3 text-white border-white/20 bg-[#121212] hover:bg-white/20 hover:text-white rounded-none h-10 mt-1 uppercase tracking-widest text-xs font-bold"
        onClick={() => onChange('')}
      >
        Clear
      </Button>
    </div>
  )
}
