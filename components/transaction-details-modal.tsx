import React from 'react';
import { Button } from '@/components/ui/button';
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
  transaction: Transaction | null;
  isOpen: boolean;
  onClose: () => void;
  baseCurrency: string;
}

export function TransactionDetailsModal({ transaction, isOpen, onClose, baseCurrency }: Props) {
  if (!isOpen || !transaction) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg border-2 border-white bg-[#050505] p-6 shadow-[8px_8px_0px_0px_rgba(255,255,255,1)] relative">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-white/50 hover:text-white font-bold text-[10px] tracking-widest"
        >
          [ CLOSE ]
        </button>
        
        <h2 className="text-xl font-black text-[#BBFF00] tracking-tighter mb-6 uppercase border-b-2 border-white/10 pb-4">
          TRANSACTION // DETAILS
        </h2>
        
        <div className="space-y-4 font-mono text-sm">
          <div className="flex justify-between items-center border-b border-white/10 pb-2">
            <span className="text-white/50 uppercase tracking-widest text-[10px]">MERCHANT</span>
            <span className="font-bold uppercase text-white truncate max-w-[200px] text-right">{transaction.merchant}</span>
          </div>
          <div className="flex justify-between items-center border-b border-white/10 pb-2">
            <span className="text-white/50 uppercase tracking-widest text-[10px]">AMOUNT</span>
            <span className="font-black text-[#BBFF00]">
              {formatCurrency(transaction.amount, baseCurrency)}
            </span>
          </div>
          <div className="flex justify-between items-center border-b border-white/10 pb-2">
            <span className="text-white/50 uppercase tracking-widest text-[10px]">DATE / TIME</span>
            <span className="text-white">{new Date(transaction.timestamp).toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center border-b border-white/10 pb-2">
            <span className="text-white/50 uppercase tracking-widest text-[10px]">CATEGORY</span>
            <span className="bg-[#BBFF00] text-black px-2 font-bold text-[10px] uppercase">
              {transaction.class}
            </span>
          </div>
          <div className="flex justify-between items-center border-b border-white/10 pb-2">
            <span className="text-white/50 uppercase tracking-widest text-[10px]">STATUS</span>
            <span className="text-white uppercase">{transaction.status}</span>
          </div>
          <div className="flex justify-between items-center border-b border-white/10 pb-2">
            <span className="text-white/50 uppercase tracking-widest text-[10px]">TX_ID</span>
            <span className="text-white/70 text-xs truncate max-w-[200px] text-right">{transaction.id}</span>
          </div>
          {transaction.meta?.raw_input && (
            <div className="flex flex-col gap-2 pt-2 border-t-2 border-[#BBFF00]/30 mt-4">
              <span className="text-[#BBFF00] uppercase tracking-widest text-[10px] font-bold">RAW_INPUT</span>
              <p className="bg-[#121212] p-3 text-white/80 border border-white/10 text-xs italic">
                "{transaction.meta.raw_input}"
              </p>
            </div>
          )}
        </div>
        
        <Button
          onClick={onClose}
          className="w-full mt-8 rounded-none border-2 border-white bg-white text-black hover:bg-[#BBFF00] hover:border-[#BBFF00] transition-colors text-[10px] font-black tracking-widest uppercase py-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px]"
        >
          ACKNOWLEDGE
        </Button>
      </div>
    </div>
  );
}
