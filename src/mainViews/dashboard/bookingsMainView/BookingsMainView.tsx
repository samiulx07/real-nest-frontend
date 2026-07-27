"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import {
  HiOutlineBookmark,
  HiOutlineCheckCircle,
  HiOutlineXCircle,
  HiOutlineBuildingOffice2,
  HiOutlineClock,
  HiOutlinePhoto,
  HiOutlineBanknotes,
  HiOutlineCreditCard,
  HiOutlineUser,
} from "react-icons/hi2";
import instance from "@/services/baseServices";
import PropertyCardSkeleton from "@/components/skeletons/PropertyCardSkeleton";

export const BookingsMainView = () => {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("ALL");

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await instance.get("/bookings");
      if (res.data?.success && Array.isArray(res.data?.data)) {
        setBookings(res.data.data);
      }
    } catch (err) {
      console.error("Failed to fetch admin bookings:", err);
      toast.error("Failed to load customer flat bookings");
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (bookingId: string, action: "APPROVE" | "REJECT") => {
    const actionLabel = action === "APPROVE" ? "Approve" : "Reject";
    const actionColor = action === "APPROVE" ? "#166534" : "#dc2626";

    const { value: adminNotes } = await Swal.fire({
      title: `${actionLabel} Flat Reservation?`,
      text: `Are you sure you want to ${actionLabel.toLowerCase()} this customer reservation and deposit?`,
      input: "text",
      inputPlaceholder: "Optional staff verification notes...",
      showCancelButton: true,
      confirmButtonColor: actionColor,
      confirmButtonText: `Yes, ${actionLabel}`,
    });

    if (adminNotes !== undefined) {
      try {
        const res = await instance.patch(`/bookings/${bookingId}/verify-payment`, {
          action,
          adminNotes,
        });

        if (res.data?.success) {
          toast.success(`Booking payment ${actionLabel.toLowerCase()}d successfully`);
          fetchBookings();
        }
      } catch (err: any) {
        console.error("Verification error:", err);
        toast.error(err.response?.data?.message || `Failed to ${actionLabel.toLowerCase()} booking`);
      }
    }
  };

  const filteredBookings = bookings.filter((b) => {
    if (statusFilter === "ALL") return true;
    return b.status === statusFilter;
  });

  return (
    <div className="space-y-6 text-left">
      {/* Banner */}
      <div className="bg-[#00062A] text-white p-6 sm:p-8 rounded-3xl border border-white/10 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[#FF4C00] text-xs font-black uppercase tracking-wider mb-1">
            <HiOutlineBookmark className="w-4 h-4" />
            <span>Staff & Admin Directory</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Flat Reservations & Verification Portal
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            Review customer bank deposit slips, verify SSLCommerz payments, and confirm flat bookings.
          </p>
        </div>

        {/* Status Filters */}
        <div className="flex items-center gap-1.5 bg-white/10 p-1.5 rounded-2xl shrink-0">
          {["ALL", "PENDING", "CONFIRMED", "CANCELLED"].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer border-none ${
                statusFilter === st
                  ? "bg-[#FF4C00] text-white shadow-md"
                  : "text-slate-300 hover:text-white hover:bg-white/10"
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Directory Table */}
      {loading ? (
        <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center text-xs font-bold text-slate-400">
          Loading booking reservation requests...
        </div>
      ) : filteredBookings.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-slate-200/80 shadow-sm text-center space-y-3">
          <HiOutlineClock className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-[#00062A]">No Bookings Found</h3>
          <p className="text-xs text-slate-400">No flat reservations match the selected filter.</p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-extrabold uppercase tracking-wider border-b border-slate-100">
                <tr>
                  <th className="p-4">Booking Ref</th>
                  <th className="p-4">Customer Details</th>
                  <th className="p-4">Target Unit</th>
                  <th className="p-4">Amount & Method</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Verification Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredBookings.map((booking) => {
                  const flat = booking.flat || {};
                  const property = flat.property || {};
                  const payment = Array.isArray(booking.payments) && booking.payments[0] ? booking.payments[0] : {};

                  return (
                    <tr key={booking.id} className="hover:bg-slate-50/80 transition">
                      <td className="p-4 font-mono font-bold text-[#00062A]">
                        {booking.bookingNumber}
                        <span className="block text-[10px] text-slate-400 font-sans font-normal mt-0.5">
                          {new Date(booking.createdAt).toLocaleDateString()}
                        </span>
                      </td>

                      <td className="p-4">
                        <strong className="text-[#00062A] block">{booking.customerName}</strong>
                        <span className="text-slate-500 block text-[11px]">{booking.customerEmail}</span>
                        <span className="text-[#FF4C00] font-bold text-[11px]">{booking.customerPhone}</span>
                      </td>

                      <td className="p-4">
                        <strong className="text-[#00062A] block">{property.title || "Building Project"}</strong>
                        <span className="text-slate-600 font-bold">
                          Flat {flat.flatNumber} (G+{flat.floorNumber || 1}) — {flat.size || 0} sqft
                        </span>
                      </td>

                      <td className="p-4">
                        <strong className="text-[#FF4C00] text-sm block">
                          ৳ {Number(booking.bookingAmount).toLocaleString()}
                        </strong>
                        <span className="text-slate-500 font-semibold flex items-center gap-1 mt-0.5">
                          {payment.paymentMethod === "SSLCOMMERZ" ? (
                            <HiOutlineCreditCard className="text-[#FF4C00]" />
                          ) : (
                            <HiOutlineBanknotes className="text-emerald-600" />
                          )}
                          <span>{payment.paymentMethod || "Bank Transfer"}</span>
                        </span>
                        {payment.bankTranId && (
                          <span className="font-mono text-[10px] text-slate-600 block mt-0.5">
                            Ref: {payment.bankTranId}
                          </span>
                        )}
                        {payment.receiptUrl && (
                          <a
                            href={payment.receiptUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[10px] font-bold text-primary hover:underline mt-1"
                          >
                            <HiOutlinePhoto /> View Slip
                          </a>
                        )}
                      </td>

                      <td className="p-4">
                        <span
                          className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase ${
                            booking.status === "CONFIRMED"
                              ? "bg-emerald-100 text-emerald-800"
                              : booking.status === "CANCELLED"
                              ? "bg-rose-100 text-rose-800"
                              : "bg-amber-100 text-amber-800"
                          }`}
                        >
                          {booking.status}
                        </span>
                      </td>

                      <td className="p-4 text-right">
                        {booking.status === "PENDING" ? (
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleVerify(booking.id, "APPROVE")}
                              className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs flex items-center gap-1 shadow-sm transition cursor-pointer border-none"
                            >
                              <HiOutlineCheckCircle className="text-sm" />
                              <span>Approve</span>
                            </button>

                            <button
                              onClick={() => handleVerify(booking.id, "REJECT")}
                              className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs flex items-center gap-1 shadow-sm transition cursor-pointer border-none"
                            >
                              <HiOutlineXCircle className="text-sm" />
                              <span>Reject</span>
                            </button>
                          </div>
                        ) : (
                          <span className="text-slate-400 font-bold text-xs">
                            {booking.status === "CONFIRMED" ? "✓ Verified" : "✕ Rejected"}
                          </span>
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

export default BookingsMainView;
