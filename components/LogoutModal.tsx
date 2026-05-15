'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { LogOut, Trash2, ShieldAlert, Lock, ArrowRight } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { db } from '@/services/db.service';

interface LogoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LogoutModal({ isOpen, onClose }: LogoutModalProps) {
  const { logout } = useAuth();

  const handleSecureLogout = () => {
    logout();
    onClose();
  };

  const handleWipeAndTerminate = async () => {
    // 1. Wipe Local Database
    try {
      await db.delete();
      // 2. Clear tokens and redirect
      logout();
      onClose();
    } catch (error) {
      console.error('FAILED_TO_PURGE_LOCAL_DATA', error);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/90 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ 
              scale: 1, 
              opacity: 1, 
              y: 0,
              transition: {
                type: "spring",
                stiffness: 400,
                damping: 30
              }
            }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-3xl border-4 border-white bg-[#050505] p-6 shadow-[8px_8px_0px_0px_rgba(255,255,255,0.1)] overflow-hidden"
          >
            {/* Grid Overlay */}
            <div className="pointer-events-none absolute inset-0 opacity-[0.03]" 
                 style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '20px 20px' }} />

            {/* Header */}
            <div className="relative z-10 flex items-center justify-between border-b-2 border-white/20 pb-4">
              <h2 className="text-2xl font-black tracking-tighter sm:text-3xl uppercase font-mono">
                TERMINAL_EXIT_PROTOCOL
              </h2>
              <div className="bg-[#BBFF00] px-3 py-1 text-[10px] font-bold tracking-widest text-black">
                ACTIVE_SESSION
              </div>
            </div>

            {/* Status Section */}
            <div className="relative z-10 mt-6 flex items-start gap-3">
              <Lock className="mt-0.5 size-5 text-[#BBFF00] shrink-0" />
              <div className="space-y-1">
                <p className="text-[12px] font-bold tracking-widest text-[#BBFF00] uppercase font-mono">
                  LOGOUT_SEQUENCE_INITIATED. STATUS: ALL_DATA_ENCRYPTED_AES256.
                </p>
                <p className="text-[10px] font-bold tracking-widest text-white/40 uppercase font-mono">
                  AWAITING_USER_CONFIRMATION...
                </p>
              </div>
            </div>

            {/* Data Safety Manifest Box */}
            <div className="relative z-10 mt-8 border-2 border-white bg-[#121212] p-5 shadow-[4px_4px_0px_0px_rgba(255,255,255,0.05)]">
              <div className="flex items-center gap-2 mb-3">
                <ShieldAlert className="size-4 text-white/60" />
                <span className="text-[10px] font-bold tracking-widest text-white/70 uppercase font-mono">
                  DATA_SAFETY_MANIFEST
                </span>
              </div>
              <p className="text-[11px] leading-relaxed font-bold tracking-widest text-white/60 uppercase font-mono">
                YOUR SYSTEM ARCHITECTURE REMAINS UNCOMPROMISED. ALL LOCAL LEDGER BALANCES AND 
                TRANSACTION HASHES HAVE BEEN ENCRYPTED AND STORED WITHIN THE LOCAL COLD-STORAGE 
                BUFFER. SESSION TOKENS WILL BE INVALIDATED IMMEDIATELY UPON EXIT. NO DATA PERSISTS 
                IN UNENCRYPTED RAM.
              </p>
            </div>

            {/* Choice Blocks */}
            <div className="relative z-10 mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {/* Secure Logout Block */}
              <button
                onClick={handleSecureLogout}
                className="group relative flex flex-col items-start border-4 border-white bg-[#BBFF00] p-5 text-black transition-all hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[8px_8px_0px_0px_rgba(255,255,255,0.1)] active:translate-x-0 active:translate-y-0 active:shadow-none"
              >
                <div className="absolute right-4 top-4 text-[10px] font-black tracking-widest opacity-40">
                  RECOMMENDED
                </div>
                <LogOut className="mb-4 size-8" />
                <h3 className="text-xl font-black tracking-tight uppercase font-mono">SECURE_LOGOUT</h3>
                <p className="mt-2 text-left text-[10px] font-bold leading-tight tracking-widest opacity-70 uppercase font-mono">
                  STANDARD EXIT. PRESERVE ENCRYPTED LOCAL MANIFEST FOR NEXT SYSTEM REBOOT.
                </p>
                <div className="mt-6 flex items-center gap-2 text-[11px] font-black tracking-widest uppercase font-mono">
                  EXECUTE_EXIT <ArrowRight className="size-4" />
                </div>
              </button>

              {/* Wipe & Terminate Block */}
              <button
                onClick={handleWipeAndTerminate}
                className="group relative flex flex-col items-start border-4 border-white bg-[#FF00FF] p-5 text-black transition-all hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[8px_8px_0px_0px_rgba(255,255,255,0.1)] active:translate-x-0 active:translate-y-0 active:shadow-none"
              >
                <div className="absolute right-4 top-4 text-[10px] font-black tracking-widest opacity-40">
                  CRITICAL_WARNING
                </div>
                <Trash2 className="mb-4 size-8" />
                <h3 className="text-xl font-black tracking-tight uppercase font-mono">WIPE_AND_TERMINATE</h3>
                <p className="mt-2 text-left text-[10px] font-bold leading-tight tracking-widest opacity-70 uppercase font-mono">
                  SCRUB_LOCAL_MANIFEST. PURGE_USER_DATA. SYSTEM RESET TO FACTORY STATE.
                </p>
                <div className="mt-6 flex items-center gap-2 text-[11px] font-black tracking-widest uppercase font-mono">
                  PURGE_SYSTEM <ShieldAlert className="size-4" />
                </div>
              </button>
            </div>

            {/* Footer Footer Status */}
            <div className="relative z-10 mt-8 flex items-center justify-between border-t border-white/10 pt-4 text-[9px] font-bold tracking-widest text-white/30 uppercase font-mono">
              <div className="flex gap-4">
                <span className="flex items-center gap-1.5">
                  <div className="size-1.5 bg-[#BBFF00]" /> ENCRYPTION_ACTIVE
                </span>
                <span className="flex items-center gap-1.5">
                  <div className="size-1.5 bg-[#FF00FF]" /> CONNECTION_SECURE
                </span>
              </div>
              <div className="flex gap-4">
                <span>SYSTEM_HOME</span>
                <span>HELP_DOCS</span>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
