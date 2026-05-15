'use client';

import { useMemo, useState } from 'react';
import { LayoutGroup, motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';
import {
  Brain,
  CalendarDays,
  ChartNoAxesCombined,
  Flame,
  Gauge,
  Radar,
  X,
} from 'lucide-react';

import { cn } from '@/lib/utils';

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
      return Radar;
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
      <rect x="0" y="0" width={width} height={height} fill="#050505" />
      {/* grid */}
      {Array.from({ length: 5 }).map((_, idx) => {
        const y = padding + (idx * (height - padding * 2)) / 4;
        return (
          <line
            key={idx}
            x1={padding}
            x2={width - padding}
            y1={y}
            y2={y}
            stroke="rgba(255,255,255,0.10)"
            strokeWidth="2"
          />
        );
      })}
      <path d={area} fill={accent} opacity="0.12" />
      <path d={d} fill="none" stroke={accent} strokeWidth="6" />
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
      <rect x="0" y="0" width={width} height={height} fill="#050505" />
      <line
        x1={padding}
        x2={width - padding}
        y1={height - padding}
        y2={height - padding}
        stroke="rgba(255,255,255,0.35)"
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
            fill={accent}
          />
        );
      })}
    </svg>
  );
}

function DonutChart({
  segments,
  accent,
}: {
  segments: { label: string; value: number; color: string }[];
  accent: string;
}) {
  const width = 640;
  const height = 240;
  const cx = 160;
  const cy = 120;
  const rOuter = 86;
  const rInner = 46;
  const total = segments.reduce((sum, s) => sum + s.value, 0) || 1;
  let start = -Math.PI / 2;

  function arcPath(startAngle: number, endAngle: number) {
    const large = endAngle - startAngle > Math.PI ? 1 : 0;
    const x1 = cx + rOuter * Math.cos(startAngle);
    const y1 = cy + rOuter * Math.sin(startAngle);
    const x2 = cx + rOuter * Math.cos(endAngle);
    const y2 = cy + rOuter * Math.sin(endAngle);

    const x3 = cx + rInner * Math.cos(endAngle);
    const y3 = cy + rInner * Math.sin(endAngle);
    const x4 = cx + rInner * Math.cos(startAngle);
    const y4 = cy + rInner * Math.sin(startAngle);

    return [
      `M ${x1} ${y1}`,
      `A ${rOuter} ${rOuter} 0 ${large} 1 ${x2} ${y2}`,
      `L ${x3} ${y3}`,
      `A ${rInner} ${rInner} 0 ${large} 0 ${x4} ${y4}`,
      'Z',
    ].join(' ');
  }

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="h-full w-full">
      <rect x="0" y="0" width={width} height={height} fill="#050505" />
      {segments.map((s) => {
        const angle = (s.value / total) * Math.PI * 2;
        const end = start + angle;
        const path = arcPath(start, end);
        start = end;
        return <path key={s.label} d={path} fill={s.color} />;
      })}
      <circle cx={cx} cy={cy} r={rInner - 10} fill="#050505" />
      <text
        x={cx}
        y={cy - 6}
        textAnchor="middle"
        fill={accent}
        fontSize="18"
        fontWeight="800"
      >
        TOP
      </text>
      <text
        x={cx}
        y={cy + 18}
        textAnchor="middle"
        fill="white"
        fontSize="22"
        fontWeight="900"
      >
        FLEX
      </text>

      {/* legend */}
      <g transform="translate(300, 44)">
        {segments.slice(0, 4).map((s, i) => (
          <g key={s.label} transform={`translate(0, ${i * 38})`}>
            <rect x="0" y="0" width="22" height="22" fill={s.color} />
            <text
              x="34"
              y="17"
              fill="white"
              fontSize="14"
              fontWeight="700"
            >
              {s.label}
            </text>
          </g>
        ))}
      </g>
    </svg>
  );
}

function GaugeChart({ percent, accent }: { percent: number; accent: string }) {
  const width = 640;
  const height = 240;
  const cx = 200;
  const cy = 190;
  const r = 130;
  const p = Math.min(100, Math.max(0, percent));
  const start = Math.PI;
  const end = Math.PI + (p / 100) * Math.PI;
  const x1 = cx + r * Math.cos(start);
  const y1 = cy + r * Math.sin(start);
  const x2 = cx + r * Math.cos(end);
  const y2 = cy + r * Math.sin(end);
  const large = end - start > Math.PI ? 1 : 0;

  const arc = `M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2}`;
  const base = `M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="h-full w-full">
      <rect x="0" y="0" width={width} height={height} fill="#050505" />
      <path d={base} stroke="rgba(255,255,255,0.18)" strokeWidth="16" fill="none" />
      <path d={arc} stroke={accent} strokeWidth="16" fill="none" />
      <text x={cx} y={120} textAnchor="middle" fill="white" fontSize="52" fontWeight="900">
        {p.toFixed(0)}%
      </text>
      <text x={cx} y={150} textAnchor="middle" fill="rgba(255,255,255,0.65)" fontSize="14" fontWeight="700">
        BUDGET UTILIZATION
      </text>
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
      <rect x="0" y="0" width={width} height={height} fill="#050505" />
      <path d={d} fill="none" stroke={accent} strokeWidth="6" />
      {points.map((p, idx) => (
        <circle key={idx} cx={p.x} cy={p.y} r="4" fill={accent} />
      ))}
      <text x={padding} y={32} fill="white" fontSize="16" fontWeight="800">
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
      <rect x="0" y="0" width={width} height={height} fill="#050505" />
      <path d={area} fill={accent} opacity="0.16" />
      <path d={d} fill="none" stroke={accent} strokeWidth="6" />
      <line
        x1={padding}
        x2={width - padding}
        y1={height - padding}
        y2={height - padding}
        stroke="rgba(255,255,255,0.25)"
        strokeWidth="3"
      />
    </svg>
  );
}

function Visualization({ box }: { box: DashboardBox }) {
  // mock data for now — later we’ll bind to real API data.
  if (box.id === 1) {
    return (
      <LineChart
        accent={box.accent}
        values={[800, 2200, 4100, 7600, 9800, 13100, 16200, 20150, 24800, 30100, 35600, 42900]}
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
  if (box.id === 3) {
    return (
      <DonutChart
        accent={box.accent}
        segments={[
          { label: 'DINING', value: 32, color: '#FF00FF' },
          { label: 'FOOD', value: 24, color: '#BBFF00' },
          { label: 'TRANSIT', value: 18, color: '#00FFFF' },
          { label: 'UTIL', value: 12, color: '#FFFFFF' },
          { label: 'OTHER', value: 14, color: '#7000FF' },
        ]}
      />
    );
  }
  if (box.id === 4) {
    return <GaugeChart accent={box.accent} percent={84} />;
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

function DetailedAnalysis({ box }: { box: DashboardBox }) {
  const Icon = box.icon;

  return (
    <div className="relative h-full overflow-hidden">
      <div
        className="pointer-events-none absolute inset-x-0 -top-10 h-20"
        style={{
          background: `linear-gradient(90deg, transparent, ${box.accent}, transparent)`,
          animation: 'neo-accent-pulse 1.25s ease-in-out infinite',
        }}
      />

      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-start sm:gap-6">
        <div className="min-w-0">
          <div className="text-[clamp(10px,2.8vw,12px)] font-bold tracking-widest text-white/70">
            {box.name} // DETAIL
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
        <div className="border-2 border-white bg-[#121212] p-[clamp(1rem,3vw,1.5rem)] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] lg:col-span-7">
          <div className="text-[clamp(10px,2.8vw,12px)] font-bold tracking-widest text-white/60">
            VISUALIZATION
          </div>
          <div className="mt-4 min-h-[clamp(10rem,35vw,16.25rem)] border-2 border-white bg-[#050505] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <Visualization box={box} />
          </div>
        </div>

        <div className="border-2 border-white bg-[#121212] p-[clamp(1rem,3vw,1.5rem)] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] lg:col-span-5">
          <div className="text-[clamp(10px,2.8vw,12px)] font-bold tracking-widest text-white/60">
            RECENT SIGNALS
          </div>
          <div className="mt-4 space-y-3 text-[clamp(11px,2.8vw,12px)] text-white/70">
            <div className="border-2 border-white/30 p-3">
              - spike detected near “FOOD”
            </div>
            <div className="border-2 border-white/30 p-3">
              - vendor concentration trending up
            </div>
            <div className="border-2 border-white/30 p-3">
              - variance increased week-over-week
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import { useTerminalData } from '../hooks/useTerminalData';

export function DashboardWidgets() {
  const [activeBox, setActiveBox] = useState<DashboardBoxId | null>(null);
  const { data, isLoading } = useTerminalData();

  const boxes = useMemo<DashboardBox[]>(
    () => [
      {
        id: 1,
        name: 'TOTAL BURN',
        value: isLoading ? '...' : `$${(data?.manifest?.total_burn || 0).toLocaleString()}`,
        description: 'Global spending from Drive ledger.',
        accent: '#BBFF00',
        icon: getBoxIcon(1),
      },
      {
        id: 2,
        name: 'DAILY AVG',
        value: isLoading ? '...' : `$${(data?.manifest?.burn_rate || 0).toLocaleString(undefined, { maximumFractionDigits: 0 })}/DAY`,
        description: 'Average daily burn rate (Drive sync).',
        accent: '#FFFFFF',
        icon: getBoxIcon(2),
      },
      {
        id: 3,
        name: 'TOP FLEX',
        value: isLoading ? '...' : (data?.history?.[0]?.merchant || 'PENDING'),
        description: 'Last identified merchant grid.',
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
    [data, isLoading]
  );

  const active = activeBox ? boxes.find((b) => b.id === activeBox) ?? null : null;

  return (
    <LayoutGroup>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1, ease: 'easeOut' }}
        className="w-full"
      >
        <div className={cn(activeBox ? 'flex flex-wrap items-center gap-2 sm:gap-3' : '')}>
          <div
            className={cn(
              activeBox
                ? 'flex min-w-0 flex-1 gap-2 overflow-x-auto pb-2 [-ms-overflow-style:none] scrollbar-none sm:gap-3 [&::-webkit-scrollbar]:hidden'
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
                    'rounded-none border-4 border-white bg-[#121212]',
                    'shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-colors',
                    'focus-visible:outline-none focus-visible:ring-0',
                    isActive ? 'border-[#BBFF00]' : 'hover:border-white/70',
                    isRibbon
                      ? 'size-[clamp(3.25rem,10vw,4rem)] p-0'
                      : 'min-h-[clamp(10rem,28vw,11.25rem)] p-[clamp(1rem,3vw,1.5rem)]'
                  )}
                  style={{
                    boxShadow: isActive
                      ? `4px 4px 0px 0px ${box.accent}`
                      : '4px 4px 0px 0px rgba(0,0,0,1)',
                  }}
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
                'shrink-0',
                'size-[clamp(3.25rem,10vw,4rem)] rounded-none border-4 border-white bg-[#121212]',
                'shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]',
                'hover:border-[#FF00FF] transition-colors',
                'active:translate-x-[2px] active:translate-y-[2px] active:shadow-none'
              )}
              aria-label="Close focus view"
            >
              <X className="mx-auto size-[clamp(1.25rem,4vw,1.75rem)] text-white" />
            </button>
          ) : null}
        </div>

        {active ? (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              type: 'spring',
              stiffness: 400,
              damping: 30,
              opacity: { duration: 0.4 },
            }}
            className={cn(
              'mt-4 min-h-[min(85vh,35rem)] w-full sm:mt-6',
              'rounded-none border-4 border-white bg-[#050505] p-[clamp(1rem,4vw,2.5rem)]',
              'shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]',
              'lg:min-h-[560px]'
            )}
          >
            <DetailedAnalysis box={active} />
          </motion.div>
        ) : null}
      </motion.div>
    </LayoutGroup>
  );
}

