"use client";

import React from "react";
import { HiOutlineCreditCard, HiOutlineShieldCheck } from "react-icons/hi2";

export const PaymentsMainView = () => {
  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
        <div className="flex items-center gap-2 text-[#FF4C00] text-xs font-bold mb-1">
          <HiOutlineCreditCard className="w-4 h-4" />
          <span>Payment Gateway</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-black text-[#00062A] tracking-tight">
          Payment Methods & Transactions
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Manage payment cards, bank transfers, and transaction history.
        </p>
      </div>

      <div className="bg-white p-8 rounded-2xl border border-slate-200/80 shadow-sm text-center space-y-3">
        <div className="w-14 h-14 rounded-2xl bg-[#00062A]/10 text-[#00062A] flex items-center justify-center mx-auto">
          <HiOutlineShieldCheck className="w-7 h-7" />
        </div>
        <h3 className="text-sm font-bold text-[#00062A]">Secure Payment Channels Active</h3>
        <p className="text-xs text-slate-400">
          Bkash, Nagad, Visa, Mastercard, and Bank Wire Transfers supported.
        </p>
      </div>
    </div>
  );
};

export default PaymentsMainView;
