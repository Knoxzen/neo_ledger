'use client';

import { useMemo, useState, useEffect } from 'react';
import { AnimatePresence, LayoutGroup, motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';
import {
  Brain,
  CalendarDays,
  ChartNoAxesCombined,
  Flame,
  Gauge,
  Radar,
  X,
  Target,
  Crosshair,
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

import { cn } from '@/lib/utils';
import { useTerminalData } from '../hooks/useTerminalData';
import { useAppStore } from '@/store/useAppStore';
import { getCurrencySymbol, formatCurrency } from '@/lib/currencyUtils';
import { computeDailySpendForMonth, getFallbackSignals, UnifiedSignalsMap } from '@/lib/signalsAnalysis';

type DashboardBoxId = 1 | 2 | 3 | 4 | 5 | 6;

interface DashboardBox {
  id: DashboardBoxId;
  name: string;
  value: string;
  description: string;
  accent: string;
  icon: LucideIcon;
}



function getBoxIcon(id: DashboardBoxId) {
  switch (id) {
    case 1:
      return Flame;
    case 2:
      return CalendarDays;
    case 3:
      return Crosshair;
    case 4:
      return Gauge;
    case 5:
      return Brain;
    case 6:
      return ChartNoAxesCombined;
  }
}

function MiniIcon({ id, accent }: { id: DashboardBoxId; accent: string }) {
  const Icon = getBoxIcon(id);
  return (
    <Icon className="size-[clamp(1.125rem,3.5vw,1.5rem)]" style={{ color: accent }} />
  );
}

function FullWidget({ box }: { box: DashboardBox }) {
  const Icon = box.icon;
  return (
    <div className="flex h-full flex-col justify-between">
      <div className="flex items-start justify-between gap-4">
        <div className="text-[12px] font-bold tracking-widest text-white/70">
          {box.name}
        </div>
        <Icon
          className="size-[clamp(1.125rem,3.5vw,1.5rem)] shrink-0"
          style={{ color: box.accent }}
        />
      </div>
      <div className="mt-3 break-all text-[clamp(1.5rem,8vw,3rem)] font-black leading-none tracking-tight sm:mt-4 md:text-5xl">
        {box.value}
      </div>
      <div className="mt-3 text-[12px] font-medium text-white/60">
        {box.description}
      </div>
    </div>
  );
}

function getMinMax(values: number[]) {
  if (values.length === 0) return { min: 0, max: 0 };
  let min = values[0] ?? 0;
  let max = values[0] ?? 0;
  for (const v of values) {
    if (v < min) min = v;
    if (v > max) max = v;
  }
  return { min, max };
}

function toPoints({
  values,
  width,
  height,
  padding,
}: {
  values: number[];
  width: number;
  height: number;
  padding: number;
}) {
  const { min, max } = getMinMax(values);
  const range = max - min || 1;
  const innerW = width - padding * 2;
  const innerH = height - padding * 2;
  const stepX = values.length > 1 ? innerW / (values.length - 1) : 0;

  return values.map((v, i) => {
    const x = padding + i * stepX;
    const y = padding + (1 - (v - min) / range) * innerH;
    return { x, y, v };
  });
}

function LineChart({
  values,
  accent,
}: {
  values: number[];
  accent: string;
}) {
  const width = 640;
  const height = 240;
  const padding = 18;
  const points = toPoints({ values, width, height, padding });
  const d = points
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(2)} ${p.y.toFixed(2)}`)
    .join(' ');

  const area = `${d} L ${width - padding} ${height - padding} L ${padding} ${height - padding} Z`;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="h-full w-full">
      <defs>
        <filter id={`glow-${accent.replace('#', '')}`} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="6" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <linearGradient id={`grad-${accent.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={accent} stopOpacity={0.25} />
          <stop offset="100%" stopColor={accent} stopOpacity={0} />
        </linearGradient>
      </defs>
      <rect x="0" y="0" width={width} height={height} fill="#020202" />
      {Array.from({ length: 5 }).map((_, idx) => {
        const y = padding + (idx * (height - padding * 2)) / 4;
        return (
          <line
            key={idx}
            x1={padding}
            x2={width - padding}
            y1={y}
            y2={y}
            stroke="rgba(255,255,255,0.06)"
            strokeWidth="2"
          />
        );
      })}
      <path d={area} fill={`url(#grad-${accent.replace('#', '')})`} />
      <path d={d} fill="none" stroke={accent} strokeWidth="5" filter={`url(#glow-${accent.replace('#', '')})`} />
      {points.map((p, idx) => (
        <circle key={idx} cx={p.x} cy={p.y} r="5" fill={accent} />
      ))}
    </svg>
  );
}

function BarChart({
  values,
  accent,
}: {
  values: number[];
  accent: string;
}) {
  const width = 640;
  const height = 240;
  const padding = 18;
  const innerW = width - padding * 2;
  const innerH = height - padding * 2;
  const { max } = getMinMax(values);
  const barGap = 10;
  const barW = (innerW - barGap * (values.length - 1)) / values.length;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="h-full w-full">
      <defs>
        <linearGradient id={`bar-grad-${accent.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={accent} stopOpacity={1} />
          <stop offset="100%" stopColor={accent} stopOpacity={0.4} />
        </linearGradient>
      </defs>
      <rect x="0" y="0" width={width} height={height} fill="#020202" />
      <line
        x1={padding}
        x2={width - padding}
        y1={height - padding}
        y2={height - padding}
        stroke="rgba(255,255,255,0.2)"
        strokeWidth="3"
      />
      {values.map((v, i) => {
        const h = (v / (max || 1)) * innerH;
        const x = padding + i * (barW + barGap);
        const y = padding + (innerH - h);
        return (
          <rect
            key={i}
            x={x}
            y={y}
            width={barW}
            height={h}
            fill={`url(#bar-grad-${accent.replace('#', '')})`}
            rx="3"
          />
        );
      })}
    </svg>
  );
}

function Sparkline({ values, accent }: { values: number[]; accent: string }) {
  const width = 640;
  const height = 240;
  const padding = 18;
  const points = toPoints({ values, width, height, padding });
  const d = points
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(2)} ${p.y.toFixed(2)}`)
    .join(' ');
  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="h-full w-full">
      <defs>
        <filter id={`glow-${accent.replace('#', '')}`} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <rect x="0" y="0" width={width} height={height} fill="#020202" />
      <path d={d} fill="none" stroke={accent} strokeWidth="5" filter={`url(#glow-${accent.replace('#', '')})`} />
      {points.map((p, idx) => (
        <circle key={idx} cx={p.x} cy={p.y} r="4" fill={accent} />
      ))}
      <text x={padding} y={32} fill="white" fontSize="16" fontWeight="800" letterSpacing="0.05em">
        SIGNAL STRENGTH
      </text>
    </svg>
  );
}

function AreaChart({ values, accent }: { values: number[]; accent: string }) {
  const width = 640;
  const height = 240;
  const padding = 18;
  const points = toPoints({ values, width, height, padding });
  const d = points
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(2)} ${p.y.toFixed(2)}`)
    .join(' ');
  const area = `${d} L ${width - padding} ${height - padding} L ${padding} ${height - padding} Z`;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="h-full w-full">
      <defs>
        <filter id={`glow-${accent.replace('#', '')}`} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <linearGradient id={`grad-${accent.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={accent} stopOpacity={0.25} />
          <stop offset="100%" stopColor={accent} stopOpacity={0} />
        </linearGradient>
      </defs>
      <rect x="0" y="0" width={width} height={height} fill="#020202" />
      <path d={area} fill={`url(#grad-${accent.replace('#', '')})`} />
      <path d={d} fill="none" stroke={accent} strokeWidth="5" filter={`url(#glow-${accent.replace('#', '')})`} />
      <line
        x1={padding}
        x2={width - padding}
        y1={height - padding}
        y2={height - padding}
        stroke="rgba(255,255,255,0.15)"
        strokeWidth="3"
      />
    </svg>
  );
}

function Visualization({ box, dailySpend }: { box: DashboardBox; dailySpend?: number[] }) {
  if (box.id === 1) {
    const values = dailySpend && dailySpend.length > 0 ? dailySpend : [100, 300, 200, 400, 800, 1200, 900, 1500, 2000, 1800, 2400, 3100];
    return (
      <LineChart
        accent={box.accent}
        values={values}
      />
    );
  }
  if (box.id === 2) {
    return (
      <BarChart
        accent={box.accent}
        values={[980, 1450, 1210, 1690, 1510, 1320, 1430]}
      />
    );
  }
  if (box.id === 4) {
    const percent = 84;
    return (
      <div className="flex h-full items-center justify-center text-4xl font-black text-white">
        {percent}%
      </div>
    );
  }
  if (box.id === 5) {
    return (
      <Sparkline
        accent={box.accent}
        values={[12, 16, 14, 22, 28, 26, 31, 40, 38, 44, 52, 49]}
      />
    );
  }
  return (
    <AreaChart
      accent={box.accent}
      values={[4200, 8600, 12100, 16900, 19600, 24400, 27800, 31500, 36400, 41200, 46800, 51200]}
    />
  );
}

function AllocationChart({ totals, categoryColors }: { totals: Record<string, number>, categoryColors: Record<string, string> }) {
  const chartData = Object.entries(totals)
    .filter(([_, value]) => value > 0)
    .map(([name, value]) => ({
      name,
      value,
      color: categoryColors[name] || '#888888'
    }));

  if (chartData.length === 0) {
    return (
      <div className="flex h-full items-center justify-center text-[10px] font-bold tracking-widest text-white/20">
        NO_ALLOCATION_DATA
      </div>
    );
  }

  return (
    <div className="h-[200px] w-full sm:h-[260px]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={90}
            paddingAngle={0}
            dataKey="value"
            stroke="#ffffff"
            strokeWidth={2}
            animationBegin={0}
            animationDuration={1500}
            animationEasing="ease-out"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <text
            x="50%"
            y="50%"
            textAnchor="middle"
            dominantBaseline="middle"
            className="fill-white font-mono text-[9px] font-bold tracking-[0.2em]"
          >
            SYSTEM_ALLOCATION
          </text>
        </PieChart>
</ResponsiveContainer>
    </div>
  );
}

function getSignalTag(widgetId: number, idx: number): string {
  const tags: Record<number, string[]> = {
    1: ["SPIKE", "FORECAST", "ACTION"],
    2: ["BURN", "LEAK", "LIMIT"],
    3: ["POWER", "ACCEL", "ACTION"],
    4: ["SYNC", "INTEGRITY", "BACKUP"],
    5: ["RADIUS", "VECTOR", "CONTAIN"],
    6: ["OUTLOOK", "OVERFLOW", "PREVENT"]
  };
  return tags[widgetId]?.[idx] || "SIGNAL";
}

function DetailedAnalysis({ box, totals, baseCurrency, categoryColors, history, onClose }: { box: DashboardBox; totals: Record<string, number>; baseCurrency: string; categoryColors: Record<string, string>; history: any[]; onClose: () => void }) {
  const Icon = box.icon;
  const { signals: cachedSignalsMap } = useTerminalData();

  const { dailySpend, monthName } = useMemo(() => {
    return computeDailySpendForMonth((history || []) as any[]);
  }, [history]);

  const activeSignals = useMemo(() => {
    const key = `widget_${box.id}` as keyof UnifiedSignalsMap;
    if (cachedSignalsMap && cachedSignalsMap[key]) {
      return cachedSignalsMap[key];
    }
    return getFallbackSignals()[key];
  }, [cachedSignalsMap, box.id]);

  return (
    <div className="relative h-full overflow-hidden">
      <button
        onClick={onClose}
        className="absolute right-0 top-0 z-10 text-[10px] font-bold tracking-widest text-white/40 hover:text-[#FF00FF] transition-colors"
      >
        [ X_CLOSE_PROTOCOL ]
      </button>

      <div
        className="pointer-events-none absolute inset-x-0 -top-10 h-20"
        style={{
          background: `linear-gradient(90deg, transparent, ${box.accent}, transparent)`,
          animation: 'neo-accent-pulse 1.25s ease-in-out infinite',
        }}
      />

      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-start sm:gap-6">
        <div className="min-w-0">
          <div className="text-[clamp(10px,2.8vw,12px)] font-bold tracking-widest text-white/70 uppercase">
            {box.name} {box.id === 1 ? `// ${monthName}` : '// DETAIL'}
          </div>
          <div className="mt-2 break-all text-[clamp(2rem,10vw,3.75rem)] font-black tracking-tight">
            {box.value}
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <Icon
            className="size-[clamp(1.5rem,5vw,2rem)]"
            style={{ color: box.accent }}
          />
          <div
            className="border-2 border-white px-2 py-1.5 text-[clamp(9px,2.5vw,10px)] font-bold tracking-widest text-black sm:px-3 sm:py-2"
            style={{ backgroundColor: box.accent }}
          >
            ACTIVE
          </div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:mt-8 sm:gap-6 lg:grid-cols-12">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-[#121212] p-[clamp(1.25rem,4vw,1.75rem)] shadow-[0_4px_24px_rgba(0,0,0,0.4)] lg:col-span-7"
        >
          <div className="text-[clamp(10px,2.8vw,12px)] font-bold tracking-widest text-white/60">
            VISUALIZATION
          </div>
          <div className="mt-4 bg-[#020202] rounded-lg overflow-hidden p-1 shadow-inner">
            {box.id === 3 ? <AllocationChart totals={totals} categoryColors={categoryColors} /> : <Visualization box={box} dailySpend={dailySpend} />}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.25 }}
          className="bg-[#121212] p-[clamp(1.25rem,4vw,1.75rem)] shadow-[0_4px_24px_rgba(0,0,0,0.4)] lg:col-span-5"
        >
          <div className="text-[clamp(10px,2.8vw,12px)] font-bold tracking-widest text-white/60">
            {box.id === 3 ? 'SYSTEM_LEGEND' : 'AI DIAGNOSTIC SIGNALS'}
          </div>
          <div className="mt-4 space-y-1 text-[clamp(11px,2.8vw,12px)] text-white/70">
            {box.id === 3 ? (
              <div className="space-y-4">
                <div className="space-y-1">
                  {Object.entries(totals)
                    .filter(([_, v]) => v > 0)
                    .map(([name, value], idx) => (
                      <motion.div
                        key={name}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 + idx * 0.05 }}
                        className="flex items-center justify-between border-b border-white/10 py-3 px-1"
                      >
                        <div className="flex items-center gap-3">
                          <div className="size-3 rounded-full" style={{ backgroundColor: categoryColors[name] || '#888888' }} />
                          <span className="font-bold tracking-widest">{name}</span>
                        </div>
                        <span className="font-mono text-[#BBFF00]">{formatCurrency(value, baseCurrency)}</span>
                      </motion.div>
                    ))}
                </div>
                <div className="pt-4 border-t border-white/10">
                  <div className="text-[clamp(10px,2.8vw,12px)] font-bold tracking-widest text-white/50 mb-2 uppercase">
                    AI FLEX DIAGNOSTIC
                  </div>
                  {activeSignals.map((sig, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 + idx * 0.1 }}
                      className="border-b border-white/10 py-3 px-1 flex items-start gap-2.5 text-[clamp(10px,2.8vw,11px)]"
                    >
                      <span className="text-[#BBFF00] font-bold font-mono">[{getSignalTag(3, idx)}]</span>
                      <span>{sig}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            ) : (
              activeSignals.map((sig, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + idx * 0.1 }}
                  className="border-b border-white/10 py-3 px-1 flex items-start gap-2.5"
                >
                  <span className="text-[#BBFF00] font-bold font-mono">[{getSignalTag(box.id, idx)}]</span>
                  <span>{sig}</span>
                </motion.div>
              ))
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export function DashboardWidgets() {
  const [activeBox, setActiveBox] = useState<DashboardBoxId | null>(null);
  const { data, isLoading } = useTerminalData();
  const { baseCurrency, categoryColors } = useAppStore();
  const currencySymbol = getCurrencySymbol(baseCurrency || 'INR');

  const { topCategory, topCategoryTotal, topCategoryPercent, categoryTotals } = useMemo(() => {
    const history = data?.history || [];
    const totals = history.reduce((acc, tx) => {
      const cat = tx.class || 'MISC';
      acc[cat] = (acc[cat] || 0) + tx.amount;
      return acc;
    }, {} as Record<string, number>);

    const top = Object.keys(totals).reduce((a, b) => 
      totals[a] > totals[b] ? a : b, 'NONE'
    );

    const totalBurn = data?.manifest?.total_burn || 1;
    const percent = Math.round((totals[top] / totalBurn) * 100);

    return { 
      topCategory: top, 
      topCategoryTotal: totals[top] || 0,
      topCategoryPercent: percent || 0,
      categoryTotals: totals 
    };
  }, [data]);

  const boxes = useMemo<DashboardBox[]>(
    () => [
      {
        id: 1,
        name: 'TOTAL BURN',
        value: isLoading ? '...' : formatCurrency(data?.manifest?.total_burn || 0, baseCurrency),
        description: 'Global spending from Drive ledger.',
        accent: '#BBFF00',
        icon: getBoxIcon(1),
      },
      {
        id: 2,
        name: 'DAILY AVG',
        value: isLoading ? '...' : `${formatCurrency(data?.manifest?.burn_rate || 0, baseCurrency, { maximumFractionDigits: 0 })}/DAY`,
        description: 'Average daily burn rate (Drive sync).',
        accent: '#FFFFFF',
        icon: getBoxIcon(2),
      },
      {
        id: 3,
        name: 'TOP_FLEX_PROTOCOL',
        value: isLoading ? '...' : topCategory,
        description: isLoading ? 'Computing...' : `${formatCurrency(topCategoryTotal, baseCurrency)} // ${topCategoryPercent}% OF TOTAL BURN`,
        accent: '#FF00FF',
        icon: getBoxIcon(3),
      },
      {
        id: 4,
        name: 'SYNC_STATUS',
        value: isLoading ? 'SYNCING' : 'OPTIMAL',
        description: 'Google Drive cloud link health.',
        accent: '#00FFFF',
        icon: getBoxIcon(4),
      },
      {
        id: 5,
        name: 'THREAT_LEVEL',
        value: isLoading ? '...' : (data?.manifest?.threat_level || 'STABLE'),
        description: `AI determined risk factor.`,
        accent: '#FFA500',
        icon: getBoxIcon(5),
      },
      {
        id: 6,
        name: 'FORECAST',
        value: 'ACTIVE',
        description: 'Cloud-based predictive standby.',
        accent: '#7000FF',
        icon: getBoxIcon(6),
      },
    ],
    [data, isLoading, topCategory, topCategoryTotal, topCategoryPercent]
  );

  const active = activeBox ? boxes.find((b) => b.id === activeBox) ?? null : null;  return (
    <LayoutGroup>
      <motion.div
        className="w-full"
      >
        <div className={cn(activeBox ? 'flex items-stretch gap-2 sm:gap-3 bg-[#121212] p-2 border-2 border-white/20 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]' : '')}>
          <div
            className={cn(
              activeBox
                ? 'flex min-w-0 flex-1 gap-2 overflow-x-auto [-ms-overflow-style:none] scrollbar-none sm:gap-3 [&::-webkit-scrollbar]:hidden'
                : 'grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3'
            )}
          >
            {boxes.map((box) => {
              const isActive = activeBox === box.id;
              const isRibbon = activeBox !== null;

              return (
                <motion.button
                  layout
                  key={box.id}
                  type="button"
                  onClick={() => setActiveBox(box.id)}
                  transition={{
                    layout: { type: 'spring', stiffness: 350, damping: 35 },
                  }}
                  className={cn(
                    'relative shrink-0 cursor-pointer select-none text-left',
                    'rounded-none bg-[#121212]',
                    'transition-all duration-300',
                    'focus-visible:outline-none focus-visible:ring-0',
                    'hover:shadow-[0_0_20px_var(--neon)] hover:border-white',
                    isActive ? 'border-[#BBFF00]' : 'border-white/40',
                    isRibbon
                      ? 'size-[clamp(3.25rem,10vw,4rem)] p-0 border-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                      : 'min-h-[clamp(10rem,28vw,11.25rem)] p-[clamp(1rem,3vw,1.5rem)] border-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'
                  )}
                  style={{
                    '--neon': `${box.accent}44`,
                    boxShadow: isActive
                      ? isRibbon 
                        ? `2px 2px 0px 0px ${box.accent}`
                        : `4px 4px 0px 0px ${box.accent}`
                      : undefined,
                  } as any}
                  aria-pressed={isActive}
                >
                  {isActive ? (
                    <>
                      <div
                        className="pointer-events-none absolute inset-x-0 -top-2 h-1"
                        style={{ backgroundColor: box.accent }}
                      />
                      <div className="pointer-events-none absolute inset-0 overflow-hidden">
                        <div
                          className="absolute inset-x-0 top-0 h-12 opacity-40"
                          style={{
                            background: `linear-gradient(180deg, transparent, ${box.accent}, transparent)`,
                            animation: 'neo-scanline 1.35s linear infinite',
                          }}
                        />
                      </div>
                    </>
                  ) : null}

                  {isRibbon ? (
                    <div className="flex size-full items-center justify-center">
                      <MiniIcon id={box.id} accent={box.accent} />
                    </div>
                  ) : (
                    <FullWidget box={box} />
                  )}
                </motion.button>
              );
            })}
          </div>

          {activeBox ? (
            <button
              type="button"
              onClick={() => setActiveBox(null)}
              className={cn(
                'shrink-0 flex items-center justify-center',
                'size-[clamp(3.25rem,10vw,4rem)] rounded-none border-2 border-white/40 bg-[#121212]',
                'shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]',
                'hover:border-[#FF00FF] hover:text-[#FF00FF] transition-colors',
                'active:translate-x-[1px] active:translate-y-[1px] active:shadow-none text-white'
              )}
              aria-label="Close focus view"
            >
              <X className="size-[clamp(1.25rem,4vw,1.75rem)]" />
            </button>
          ) : null}
        </div>

        <AnimatePresence mode="wait">
          {active ? (
            <motion.div
              key="detailed-view"
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{
                type: 'spring',
                stiffness: 450,
                damping: 25,
              }}
              className={cn(
                'mt-4 min-h-[min(85vh,35rem)] w-full sm:mt-6',
                'rounded-none border-4 border-white bg-[#050505] p-[clamp(1rem,4vw,2.5rem)]',
                'shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]',
                'lg:min-h-[560px]'
              )}
            >
              <DetailedAnalysis box={active} totals={categoryTotals} baseCurrency={baseCurrency} categoryColors={categoryColors} history={data?.history || []} onClose={() => setActiveBox(null)} />
            </motion.div>
          ) : null}
        </AnimatePresence>
      </motion.div>
    </LayoutGroup>
  );
}
