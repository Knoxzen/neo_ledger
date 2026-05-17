'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TrendingUp, 
  Activity, 
  ShieldCheck, 
  ChevronRight, 
  ArrowUpRight,
  Maximize2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAppStore } from '@/store/useAppStore';
import { formatCurrency } from '@/lib/currencyUtils';

// --- Types ---
interface CategoryData {
  name: string;
  value: number;
  color: string;
  history: number[];
}

const CATEGORIES: CategoryData[] = [
  { name: 'FASHION', value: 12500, color: '#FF00FF', history: [2000, 4500, 4500, 8000, 8000, 12500] },
  { name: 'TECH', value: 8900, color: '#00FFFF', history: [3000, 3000, 5600, 5600, 8900, 8900] },
  { name: 'ENTERTAINMENT', value: 6200, color: '#7000FF', history: [1000, 2500, 3800, 3800, 5000, 6200] },
  { name: 'FOOD', value: 4800, color: '#BBFF00', history: [800, 1500, 2200, 3100, 4000, 4800] },
  { name: 'TRANSIT', value: 3100, color: '#FFFFFF', history: [500, 1100, 1100, 2200, 2800, 3100] },
];

// --- Sub-components ---

function RibbonCard({ label, value, icon: Icon }: { label: string; value: string; icon: any }) {
  return (
    <div className="flex-1 border-2 border-white bg-[#121212] p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] font-bold tracking-widest text-white/60">{label}</span>
        <Icon className="size-4 text-[#BBFF00]" />
      </div>
      <div className="text-2xl font-black font-mono tracking-tighter text-white">{value}</div>
    </div>
  );
}

function SteppedLineChart({ data, color }: { data: number[], color: string }) {
  const width = 600;
  const height = 200;
  const max = Math.max(...data, 1);
  const padding = 20;
  
  const points = useMemo(() => {
    const stepX = (width - padding * 2) / (data.length - 1);
    const innerH = height - padding * 2;
    
    return data.map((val, i) => ({
      x: padding + i * stepX,
      y: height - padding - (val / max) * innerH
    }));
  }, [data, max]);

  // Generate stepped path
  const pathData = useMemo(() => {
    if (points.length === 0) return '';
    let d = `M ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
      // Move horizontally to the next X, then vertically to the next Y
      d += ` H ${points[i].x} V ${points[i].y}`;
    }
    return d;
  }, [points]);

  return (
    <div className="relative h-full w-full bg-[#050505] p-2 overflow-hidden">
      <div className="scanline-overlay absolute inset-0 pointer-events-none opacity-20" />
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full">
        {/* Grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map(p => (
          <line 
            key={p}
            x1={padding} y1={padding + p * (height - padding * 2)} 
            x2={width - padding} y2={padding + p * (height - padding * 2)}
            stroke="white" strokeOpacity="0.05" strokeWidth="1"
          />
        ))}
        
        {/* The Stepped Line */}
        <motion.path
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          d={pathData}
          fill="none"
          stroke={color}
          strokeWidth="3"
          style={{ filter: `drop-shadow(0 0 8px ${color})` }}
        />
        
        {/* Points */}
        {points.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r="4" fill={color} />
        ))}
      </svg>
    </div>
  );
}

function SegmentedProgress({ value, max, color }: { value: number; max: number; color: string }) {
  const segments = 12;
  const activeCount = Math.ceil((value / max) * segments);
  
  return (
    <div className="flex gap-1 h-3 w-full">
      {Array.from({ length: segments }).map((_, i) => (
        <div 
          key={i}
          className="flex-1 border border-white/20"
          style={{ 
            backgroundColor: i < activeCount ? color : 'transparent',
            boxShadow: i < activeCount ? `0 0 5px ${color}` : 'none'
          }}
        />
      ))}
    </div>
  );
}

function VelocityGauge({ value }: { value: number }) {
  // Simple vertical gauge
  const height = 160;
  const fillHeight = (value / 100) * height;
  const color = value > 70 ? '#FF00FF' : value > 40 ? '#FFA500' : '#BBFF00';

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative w-12 border-2 border-white bg-[#121212] overflow-hidden" style={{ height }}>
        <motion.div 
          initial={{ height: 0 }}
          animate={{ height: fillHeight }}
          className="absolute bottom-0 left-0 w-full"
          style={{ backgroundColor: color, boxShadow: `0 0 15px ${color}` }}
        />
        <div className="absolute inset-0 scanline-overlay opacity-30 pointer-events-none" />
      </div>
      <div className="text-[10px] font-bold tracking-[0.2em] text-white/70 uppercase">Burn_Rate</div>
      <div className="font-mono font-black text-xl" style={{ color }}>{value}%</div>
    </div>
  );
}

export function Analytics() {
  const { baseCurrency } = useAppStore();
  const [selectedCategory, setSelectedCategory] = useState<CategoryData | null>(null);
  const [timeRange, setTimeRange] = useState('1M');
  const [isGlitching, setIsGlitching] = useState(false);
  const [comparisonMode, setComparisonMode] = useState(false);

  const activeHistory = useMemo(() => {
    return selectedCategory ? selectedCategory.history : [4200, 8600, 12100, 16900, 19600, 24400];
  }, [selectedCategory]);

  const toggleComparison = () => {
    setIsGlitching(true);
    setTimeout(() => {
      setComparisonMode(!comparisonMode);
      setIsGlitching(false);
    }, 200);
  };

  return (
    <div className="flex flex-col gap-6 p-6 min-h-full">
      {/* Top Ribbon */}
      <div className="flex flex-wrap gap-4">
        <RibbonCard label="MONTHLY PEAK" value={formatCurrency(42900, baseCurrency)} icon={ArrowUpRight} />
        <RibbonCard label="NET VELOCITY" value={formatCurrency(1430, baseCurrency)} icon={Activity} />
        <RibbonCard label="SAVINGS EFFICIENCY" value="64%" icon={ShieldCheck} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Primary Analytics Canvas */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-[12px] font-bold tracking-widest border-l-4 border-[#BBFF00] pl-2">
              ANALYTICS // {selectedCategory ? selectedCategory.name : 'ALL_STREAMS'}
            </h2>
            
            <div className="flex items-center gap-4">
              {/* Time Range Selector */}
              <div className="flex border-2 border-white overflow-hidden">
                {['1D', '1W', '1M', '1Y'].map(range => (
                  <button
                    key={range}
                    onClick={() => setTimeRange(range)}
                    className={cn(
                      "px-3 py-1 text-[10px] font-bold tracking-widest transition-colors",
                      timeRange === range ? "bg-[#BBFF00] text-black" : "text-white/60 hover:bg-white/5"
                    )}
                  >
                    {range}
                  </button>
                ))}
              </div>
              <button 
                onClick={toggleComparison}
                className="text-[10px] font-bold tracking-widest border-2 border-[#FF00FF] px-3 py-1 hover:bg-[#FF00FF]/10 text-[#FF00FF]"
              >
                TOGGLE_COMPARISON
              </button>
            </div>
          </div>

          <div className={cn(
            "relative aspect-video border-2 border-white bg-[#050505] p-4 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]",
            isGlitching && "animate-neo-glitch"
          )}>
             <SteppedLineChart 
                data={comparisonMode ? activeHistory.map(v => v * 0.8) : activeHistory} 
                color={selectedCategory ? selectedCategory.color : '#BBFF00'} 
             />
             <div className="absolute top-4 right-4 text-[10px] font-mono text-white/40">
                DATA_STREAM_v0.4
             </div>
          </div>

          {/* Category Treemap */}
          <div className="grid grid-cols-6 gap-2 h-40">
            {CATEGORIES.map((cat, i) => (
              <button
                key={cat.name}
                onClick={() => setSelectedCategory(selectedCategory?.name === cat.name ? null : cat)}
                className={cn(
                  "relative border-2 transition-all p-3 text-left overflow-hidden",
                  selectedCategory?.name === cat.name ? "border-white" : "border-white/20 hover:border-white/60",
                  i === 0 ? "col-span-3" : i === 1 ? "col-span-2" : "col-span-1"
                )}
                style={{ backgroundColor: selectedCategory?.name === cat.name ? cat.color + '22' : 'transparent' }}
              >
                <div className="text-[10px] font-black tracking-tighter" style={{ color: cat.color }}>{cat.name}</div>
                <div className="mt-1 font-mono font-black text-sm">{formatCurrency(cat.value, baseCurrency)}</div>
                {selectedCategory?.name === cat.name && (
                   <div className="absolute bottom-0 left-0 h-1 w-full" style={{ backgroundColor: cat.color }} />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Right Sidebar Stats */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          {/* Category Breakdown */}
          <div className="border-2 border-white bg-[#121212] p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
             <h3 className="text-[10px] font-bold tracking-widest mb-6 flex items-center gap-2">
                <Maximize2 className="size-3" />
                DISTRIBUTION // CATEGORIES
             </h3>
             <div className="flex flex-col gap-5">
                {CATEGORIES.map(cat => (
                  <div key={cat.name} className="flex flex-col gap-2">
                    <div className="flex justify-between text-[10px] font-bold tracking-widest">
                      <span>{cat.name}</span>
                      <span className="font-mono">{formatCurrency(cat.value, baseCurrency)}</span>
                    </div>
                    <SegmentedProgress value={cat.value} max={15000} color={cat.color} />
                  </div>
                ))}
             </div>
          </div>

          {/* Burn Rate Gauge */}
          <div className="flex-1 border-2 border-white bg-[#121212] p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center">
             <VelocityGauge value={84} />
          </div>
        </div>
      </div>
    </div>
  );
}
