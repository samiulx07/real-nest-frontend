"use client";

import React from "react";
import { HiOutlineDocumentText, HiOutlineCheckBadge } from "react-icons/hi2";

export const BillingMainView = () => {
  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
        <div className="flex items-center gap-2 text-[#FF4C00] text-xs font-bold mb-1">
          <HiOutlineDocumentText className="w-4 h-4" />
          <span>Financial Records</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-black text-[#00062A] tracking-tight">
          Billing & Invoices
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          View your payment schedules, installment invoices, and booking receipts.
        </p>
      </div>

      <div className="bg-white p-8 rounded-2xl border border-slate-200/80 shadow-sm text-center space-y-3">
        <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
          <HiOutlineCheckBadge className="w-7 h-7" />
        </div>
        <h3 className="text-sm font-bold text-[#00062A]">No Pending Invoices</h3>
        <p className="text-xs text-slate-400">
          All your property booking invoices and installments are fully up to date.
        </p>
      </div>
    </div>
  );
};

export default BillingMainView;
