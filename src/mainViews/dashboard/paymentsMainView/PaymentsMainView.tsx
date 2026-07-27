"use client";

import React, { useEffect, useState } from "react";
import {
  HiOutlineCreditCard,
  HiOutlineShieldCheck,
  HiOutlineBanknotes,
  HiOutlineCheckBadge,
  HiOutlineClock,
  HiOutlinePhoto,
} from "react-icons/hi2";
import instance from "@/services/baseServices";

export const PaymentsMainView = () => {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPaymentsData();
  }, []);

  const fetchPaymentsData = async () => {
    try {
      setLoading(true);
      const res = await instance.get("/bookings/my-bookings");
      if (res.data?.success && Array.isArray(res.data?.data)) {
        setBookings(res.data.data);
      }
    } catch (err) {
      console.error("Failed to fetch transaction records:", err);
    } finally {
      setLoading(false);
    }
  };

  // Flatten payments array
  const allPayments = bookings.flatMap((b) =>
    (Array.isArray(b.payments) ? b.payments : []).map((p: any) => ({
      ...p,
      booking: b,
    }))
  );

  return (
    <div className="space-y-6 text-left">
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[#FF4C00] text-xs font-black uppercase tracking-wider mb-1">
            <HiOutlineCreditCard className="w-4 h-4" />
            <span>Payment Gateway & Ledger</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-[#00062A] tracking-tight">
            Payment Transactions & Receipts
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            SSLCommerz online gateway logs, bank transfers, and verification status.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center text-xs font-bold text-slate-400">
          Loading transaction logs...
        </div>
      ) : allPayments.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-slate-200/80 shadow-sm text-center space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-[#00062A]/10 text-[#00062A] flex items-center justify-center mx-auto">
            <HiOutlineShieldCheck className="w-7 h-7" />
          </div>
          <h3 className="text-sm font-bold text-[#00062A]">No Transactions Logged Yet</h3>
          <p className="text-xs text-slate-400">
            SSLCommerz online payments and manual bank deposits will appear here.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-base font-black text-[#00062A]">Transaction History</h3>
            <span className="text-xs font-bold text-slate-400">{allPayments.length} Payments</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-extrabold uppercase tracking-wider border-b border-slate-100">
                <tr>
                  <th className="p-4">Transaction Ref</th>
                  <th className="p-4">Channel / Method</th>
                  <th className="p-4">Unit / Booking</th>
                  <th className="p-4">Amount</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Deposit Slip</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {allPayments.map((payment) => {
                  const booking = payment.booking || {};
                  const flat = booking.flat || {};
                  const property = flat.property || {};

                  return (
                    <tr key={payment.id} className="hover:bg-slate-50/80 transition">
                      <td className="p-4 font-mono font-bold text-[#00062A]">
                        {payment.bankTranId || payment.tranId}
                        <span className="block text-[10px] text-slate-400 font-sans font-normal mt-0.5">
                          {new Date(payment.createdAt).toLocaleDateString()}
                        </span>
                      </td>

                      <td className="p-4 font-bold text-slate-700">
                        <span className="flex items-center gap-1.5">
                          {payment.paymentMethod === "SSLCOMMERZ" ? (
                            <HiOutlineCreditCard className="text-[#FF4C00] text-sm" />
                          ) : (
                            <HiOutlineBanknotes className="text-emerald-600 text-sm" />
                          )}
                          <span>
                            {payment.cardType || payment.paymentMethod || "Bank Transfer"}
                          </span>
                        </span>
                      </td>

                      <td className="p-4">
                        <strong className="text-[#00062A] block">{property.title || "Building Project"}</strong>
                        <span className="text-slate-500 font-semibold">Flat {flat.flatNumber} ({booking.bookingNumber})</span>
                      </td>

                      <td className="p-4 font-black text-[#FF4C00] text-sm">
                        ৳ {Number(payment.amount).toLocaleString()}
                      </td>

                      <td className="p-4">
                        <span
                          className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase ${
                            payment.status === "VALIDATED"
                              ? "bg-emerald-100 text-emerald-800"
                              : payment.status === "REJECTED" || payment.status === "FAILED"
                              ? "bg-rose-100 text-rose-800"
                              : "bg-amber-100 text-amber-800"
                          }`}
                        >
                          {payment.status === "VALIDATED" ? (
                            <HiOutlineCheckBadge />
                          ) : (
                            <HiOutlineClock />
                          )}
                          <span>{payment.status}</span>
                        </span>
                      </td>

                      <td className="p-4 text-right">
                        {payment.receiptUrl ? (
                          <a
                            href={payment.receiptUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[11px] no-underline"
                          >
                            <HiOutlinePhoto />
                            <span>View Slip</span>
                          </a>
                        ) : (
                          <span className="text-slate-400 font-semibold text-[11px]">N/A</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentsMainView;
