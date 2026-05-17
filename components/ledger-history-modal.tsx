import React, { useState, useMemo } from 'react';
import { formatCurrency } from '@/lib/currencyUtils';

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
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

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
      if (startDate) {
        // Normalize the start date to 00:00:00 local time
        const start = new Date(startDate);
        start.setHours(0, 0, 0, 0);
        if (new Date(t.timestamp) < start) return false;
      }
      if (endDate) {
        // Normalize the end date to 23:59:59 local time
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        if (new Date(t.timestamp) > end) return false;
      }

      return true;
    });
  }, [transactions, tagFilter, minAmount, maxAmount, startDate, endDate]);

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
          <div className="flex gap-2">
            <input 
              type="date" 
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="bg-black border border-white/20 text-white p-2 text-xs w-full focus:border-[#BBFF00] outline-none" 
            />
            <span className="text-white/50 self-center">-</span>
            <input 
              type="date" 
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="bg-black border border-white/20 text-white p-2 text-xs w-full focus:border-[#BBFF00] outline-none" 
            />
          </div>
        </div>

        {/* Amount Range */}
        <div className="flex flex-col gap-2">
          <label className="text-[10px] font-bold text-[#BBFF00] tracking-widest uppercase">AMOUNT_RANGE</label>
          <div className="flex gap-2">
            <input 
              type="number" 
              placeholder="MIN"
              value={minAmount}
              onChange={(e) => setMinAmount(e.target.value)}
              className="bg-black border border-white/20 text-white p-2 text-xs w-full focus:border-[#BBFF00] outline-none" 
            />
            <span className="text-white/50 self-center">-</span>
            <input 
              type="number" 
              placeholder="MAX"
              value={maxAmount}
              onChange={(e) => setMaxAmount(e.target.value)}
              className="bg-black border border-white/20 text-white p-2 text-xs w-full focus:border-[#BBFF00] outline-none" 
            />
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
