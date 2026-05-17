import React, { useState, useMemo } from 'react';
import { formatCurrency } from '@/lib/currencyUtils';
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Numpad } from "@/components/ui/numpad";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface Transaction {
  id: string;
  timestamp: string;
  merchant: string;
  amount: number;
  currency: string;
  class: string;
  status: string;
  meta?: {
    raw_input?: string;
  };
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  transactions: Transaction[];
  baseCurrency: string;
  onTransactionClick: (t: Transaction) => void;
}

export function LedgerHistoryModal({ isOpen, onClose, transactions, baseCurrency, onTransactionClick }: Props) {
  const [tagFilter, setTagFilter] = useState('');
  const [minAmount, setMinAmount] = useState('');
  const [maxAmount, setMaxAmount] = useState('');
  const [date, setDate] = useState<DateRange | undefined>();

  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => {
      // Tags filter (searching in merchant, class, and raw_input)
      if (tagFilter) {
        const query = tagFilter.toLowerCase();
        const inMerchant = t.merchant.toLowerCase().includes(query);
        const inClass = t.class.toLowerCase().includes(query);
        const inRaw = t.meta?.raw_input?.toLowerCase().includes(query);
        if (!inMerchant && !inClass && !inRaw) return false;
      }
      
      // Amount filter
      if (minAmount && t.amount < Number(minAmount)) return false;
      if (maxAmount && t.amount > Number(maxAmount)) return false;
      
      // Date filter
      if (date?.from) {
        // Normalize the start date to 00:00:00 local time
        const start = new Date(date.from);
        start.setHours(0, 0, 0, 0);
        if (new Date(t.timestamp) < start) return false;
      }
      if (date?.to) {
        // Normalize the end date to 23:59:59 local time
        const end = new Date(date.to);
        end.setHours(23, 59, 59, 999);
        if (new Date(t.timestamp) > end) return false;
      }

      return true;
    });
  }, [transactions, tagFilter, minAmount, maxAmount, date]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[50] flex flex-col bg-[#050505] p-[clamp(1rem,4vw,3rem)]">
      {/* Header */}
      <div className="flex justify-between items-center mb-6 shrink-0">
        <h2 className="text-[clamp(1.5rem,5vw,2.5rem)] font-black text-white tracking-tighter uppercase border-l-8 border-[#BBFF00] pl-4">
          LEDGER // FULL_HISTORY
        </h2>
        <button 
          onClick={onClose}
          className="text-white/50 hover:text-white font-bold text-[12px] tracking-widest border-2 border-white/20 p-2 hover:border-white transition-colors"
        >
          [ ABORT ]
        </button>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 border-y-2 border-white/20 py-4 shrink-0">
        {/* Date Range */}
        <div className="flex flex-col gap-2">
          <label className="text-[10px] font-bold text-[#BBFF00] tracking-widest uppercase">DATE_RANGE</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="date"
                variant={"outline"}
                className={cn(
                  "bg-black border border-white/20 text-white p-2 text-xs w-full focus:border-[#BBFF00] outline-none justify-start text-left font-normal h-auto hover:bg-white/5 hover:text-white rounded-none",
                  !date && "text-white/50"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date?.from ? (
                  date.to ? (
                    <>
                      {format(date.from, "LLL dd, y")} -{" "}
                      {format(date.to, "LLL dd, y")}
                    </>
                  ) : (
                    format(date.from, "LLL dd, y")
                  )
                ) : (
                  <span>Pick a date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="range"
                defaultMonth={date?.from}
                selected={date}
                onSelect={setDate}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Amount Range */}
        <div className="flex flex-col gap-2">
          <label className="text-[10px] font-bold text-[#BBFF00] tracking-widest uppercase">AMOUNT_RANGE</label>
          <div className="flex gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "bg-black border border-white/20 text-white p-2 text-xs flex-1 shrink min-w-0 focus:border-[#BBFF00] outline-none justify-start text-left font-normal h-auto hover:bg-white/5 hover:text-white rounded-none",
                    !minAmount && "text-white/50"
                  )}
                >
                  {minAmount ? formatCurrency(Number(minAmount), baseCurrency) : "MIN"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 border-none bg-transparent shadow-none" align="start">
                <Numpad value={minAmount} onChange={setMinAmount} />
              </PopoverContent>
            </Popover>
            <span className="text-white/50 self-center">-</span>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "bg-black border border-white/20 text-white p-2 text-xs flex-1 shrink min-w-0 focus:border-[#BBFF00] outline-none justify-start text-left font-normal h-auto hover:bg-white/5 hover:text-white rounded-none",
                    !maxAmount && "text-white/50"
                  )}
                >
                  {maxAmount ? formatCurrency(Number(maxAmount), baseCurrency) : "MAX"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 border-none bg-transparent shadow-none" align="start">
                <Numpad value={maxAmount} onChange={setMaxAmount} />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {/* Tags Search */}
        <div className="flex flex-col gap-2">
          <label className="text-[10px] font-bold text-[#BBFF00] tracking-widest uppercase">TAGS_SEARCH</label>
          <input 
            type="text" 
            placeholder="SEARCH BY MERCHANT, TAG, INPUT..."
            value={tagFilter}
            onChange={(e) => setTagFilter(e.target.value)}
            className="bg-black border border-white/20 text-white p-2 text-xs w-full focus:border-[#BBFF00] outline-none uppercase" 
          />
        </div>
      </div>

      {/* Results */}
      <div className="flex-1 overflow-y-auto pr-2 flex flex-col gap-2 no-scrollbar">
        {filteredTransactions.length === 0 ? (
          <div className="border-2 border-white border-dashed bg-[#121212] p-8 text-center text-[10px] font-bold tracking-widest text-white/20 uppercase mt-8">
            NO_MATCHING_RECORDS
          </div>
        ) : (
          filteredTransactions.map((item) => (
            <div
              key={item.id}
              onClick={() => onTransactionClick(item)}
              className="border-2 border-white/20 bg-[#121212] p-[clamp(0.75rem,3vw,1rem)] shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)] transition-colors hover:border-[#BBFF00] cursor-pointer"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="text-[clamp(1rem,4vw,1.125rem)] font-black tracking-tight uppercase text-white">
                    {item.merchant}
                  </div>
                  <div className="text-[clamp(9px,2.5vw,10px)] font-bold tracking-widest text-white/60">
                    {new Date(item.timestamp).toLocaleString()}
                  </div>
                </div>
                <div className="shrink-0 text-[clamp(1rem,4vw,1.125rem)] font-black text-white">
                  -{formatCurrency(item.amount, baseCurrency)}
                </div>
              </div>
              <div
                className="mt-3 inline-block border border-white/20 px-3 py-1 text-[clamp(9px,2.5vw,10px)] font-bold tracking-widest text-white bg-white/5 uppercase"
              >
                {item.class}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
