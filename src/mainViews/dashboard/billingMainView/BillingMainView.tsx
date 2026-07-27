"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  HiOutlineDocumentText,
  HiOutlineCheckBadge,
  HiOutlineArrowDownTray,
  HiOutlineBuildingOffice2,
  HiOutlineCreditCard,
  HiOutlineBanknotes,
  HiOutlineClock,
  HiOutlineSparkles,
} from "react-icons/hi2";
import instance from "@/services/baseServices";
import { generateReceiptPDF } from "@/utils/generateReceiptPDF";

export const BillingMainView = () => {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBillingData();
  }, []);

  const fetchBillingData = async () => {
    try {
      setLoading(true);
      const res = await instance.get("/bookings/my-bookings");
      if (res.data?.success && Array.isArray(res.data?.data)) {
        setBookings(res.data.data);
      }
    } catch (err) {
      console.error("Failed to fetch billing records:", err);
    } finally {
      setLoading(false);
    }
  };

  // Calculate overall totals
  const totalAgreedPrice = bookings.reduce((acc, b) => acc + Number(b.flat?.price || 0), 0);
  const totalPaidAmount = bookings.reduce(
    (acc, b) => (b.paymentStatus === "VALIDATED" ? acc + Number(b.paidAmount || b.bookingAmount || 0) : acc),
    0
  );
  const progressPercent = totalAgreedPrice > 0 ? Math.min(100, Math.round((totalPaidAmount / totalAgreedPrice) * 100)) : 0;

  const handleDownloadPDF = (booking: any) => {
    const flat = booking.flat || {};
    const property = flat.property || {};
    const payment = Array.isArray(booking.payments) && booking.payments[0] ? booking.payments[0] : {};

    generateReceiptPDF({
      invoiceNumber: `INV-${new Date(booking.createdAt).toISOString().slice(0, 10).replace(/-/g, "")}-${booking.id.slice(0, 4).toUpperCase()}`,
      date: new Date(booking.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }),
      bookingNumber: booking.bookingNumber,
      customerName: booking.customerName,
      customerEmail: booking.customerEmail,
      customerPhone: booking.customerPhone,
      propertyTitle: property.title || "Building Project",
      flatNumber: flat.flatNumber || "N/A",
      floorNumber: flat.floorNumber || 1,
      flatSize: flat.size || 0,
      totalFlatPrice: flat.price || booking.bookingAmount || 0,
      paidAmount: booking.paidAmount || booking.bookingAmount || 0,
      paymentMethod: payment.paymentMethod || "Bank Transfer",
      transactionId: payment.bankTranId || payment.tranId || "TXN-VERIFIED",
      paymentStatus: booking.paymentStatus,
    });
  };

  return (
    <div className="space-y-6 text-left">
      {/* Header Banner */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[#FF4C00] text-xs font-black uppercase tracking-wider mb-1">
            <HiOutlineDocumentText className="w-4 h-4" />
            <span>Financial & Invoices Portal</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-[#00062A] tracking-tight">
            Billing & Payment Receipts
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            View your installment progress, billing history, and download official PDF receipts.
          </p>
        </div>
      </div>

      {/* Installment Progress Tracker Card */}
      {bookings.length > 0 && (
        <div className="bg-[#00062A] text-white p-6 sm:p-8 rounded-3xl shadow-lg space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <HiOutlineSparkles className="w-5 h-5 text-[#FF4C00]" />
              <h3 className="text-base font-extrabold text-white">Overall Installment Progress</h3>
            </div>
            <span className="bg-[#FF4C00] text-white text-xs font-black px-3.5 py-1 rounded-full">
              {progressPercent}% Paid
            </span>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-white/10 h-3.5 rounded-full overflow-hidden p-0.5">
            <div
              className="bg-[#FF4C00] h-full rounded-full transition-all duration-1000 shadow-md shadow-[#FF4C00]/40"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 text-xs">
            <div className="bg-white/5 p-3.5 rounded-2xl border border-white/10">
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Total Agreed Price</span>
              <strong className="text-lg font-black text-white">৳ {totalAgreedPrice.toLocaleString()}</strong>
            </div>

            <div className="bg-white/5 p-3.5 rounded-2xl border border-white/10">
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Total Verified Paid</span>
              <strong className="text-lg font-black text-emerald-400">৳ {totalPaidAmount.toLocaleString()}</strong>
            </div>

            <div className="bg-white/5 p-3.5 rounded-2xl border border-white/10">
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Remaining Balance Due</span>
              <strong className="text-lg font-black text-[#FF4C00]">
                ৳ {Math.max(0, totalAgreedPrice - totalPaidAmount).toLocaleString()}
              </strong>
            </div>
          </div>
        </div>
      )}

      {/* Invoices List */}
      {loading ? (
        <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center text-xs font-bold text-slate-400">
          Loading billing records...
        </div>
      ) : bookings.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-slate-200/80 shadow-sm text-center space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
            <HiOutlineCheckBadge className="w-7 h-7" />
          </div>
          <h3 className="text-sm font-bold text-[#00062A]">No Billing Invoices Yet</h3>
          <p className="text-xs text-slate-400">
            Submit a flat reservation to generate your billing invoices and downloadable receipts.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-base font-black text-[#00062A]">Invoices & PDF Receipts</h3>
            <span className="text-xs font-bold text-slate-400">{bookings.length} Records</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-extrabold uppercase tracking-wider border-b border-slate-100">
                <tr>
                  <th className="p-4">Invoice #</th>
                  <th className="p-4">Property & Flat</th>
                  <th className="p-4">Method</th>
                  <th className="p-4">Amount Paid</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {bookings.map((booking) => {
                  const flat = booking.flat || {};
                  const property = flat.property || {};
                  const payment = Array.isArray(booking.payments) && booking.payments[0] ? booking.payments[0] : {};
                  const invNo = `INV-${new Date(booking.createdAt).toISOString().slice(0, 10).replace(/-/g, "")}-${booking.id.slice(0, 4).toUpperCase()}`;

                  return (
                    <tr key={booking.id} className="hover:bg-slate-50/80 transition">
                      <td className="p-4 font-mono font-bold text-[#00062A]">
                        {invNo}
                        <span className="block text-[10px] text-slate-400 font-sans font-normal mt-0.5">
                          {new Date(booking.createdAt).toLocaleDateString()}
                        </span>
                      </td>

                      <td className="p-4">
                        <strong className="text-[#00062A] block">{property.title || "Building Project"}</strong>
                        <span className="text-slate-500 font-semibold">Flat {flat.flatNumber}</span>
                      </td>

                      <td className="p-4 font-bold text-slate-700">
                        <span className="flex items-center gap-1.5">
                          {payment.paymentMethod === "SSLCOMMERZ" ? (
                            <HiOutlineCreditCard className="text-[#FF4C00] text-sm" />
                          ) : (
                            <HiOutlineBanknotes className="text-emerald-600 text-sm" />
                          )}
                          <span>{payment.paymentMethod || "Bank Transfer"}</span>
                        </span>
                      </td>

                      <td className="p-4 font-black text-[#FF4C00] text-sm">
                        ৳ {Number(booking.paidAmount || booking.bookingAmount).toLocaleString()}
                      </td>

                      <td className="p-4">
                        <span
                          className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase ${
                            booking.paymentStatus === "VALIDATED"
                              ? "bg-emerald-100 text-emerald-800"
                              : booking.paymentStatus === "REJECTED"
                              ? "bg-rose-100 text-rose-800"
                              : "bg-amber-100 text-amber-800"
                          }`}
                        >
                          {booking.paymentStatus === "VALIDATED" ? (
                            <HiOutlineCheckBadge />
                          ) : (
                            <HiOutlineClock />
                          )}
                          <span>{booking.paymentStatus}</span>
                        </span>
                      </td>

                      <td className="p-4 text-right">
                        <button
                          onClick={() => handleDownloadPDF(booking)}
                          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#00062A] hover:bg-[#FF4C00] text-white font-bold text-xs shadow-sm transition cursor-pointer border-none"
                        >
                          <HiOutlineArrowDownTray className="text-sm" />
                          <span>PDF Receipt</span>
                        </button>
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

export default BillingMainView;
