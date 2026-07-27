"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import Swal from "sweetalert2";
import {
  HiOutlineBookmark,
  HiOutlineBuildingOffice2,
  HiOutlineClock,
  HiOutlineCheckCircle,
  HiOutlineXCircle,
  HiOutlineBanknotes,
  HiOutlineCreditCard,
  HiOutlineTag,
} from "react-icons/hi2";
import instance from "@/services/baseServices";
import PropertyCardSkeleton from "@/components/skeletons/PropertyCardSkeleton";

export const MyBookingsMainView = () => {
  const searchParams = useSearchParams();
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const paymentStatus = searchParams.get("payment");
    const tranId = searchParams.get("tran_id");

    if (paymentStatus === "success") {
      Swal.fire({
        icon: "success",
        title: "Payment Successful!",
        text: `Your SSLCommerz online transaction (${tranId || ""}) was verified. Your flat booking is now confirmed!`,
        confirmButtonColor: "#00062A",
      });
    } else if (paymentStatus === "failed") {
      Swal.fire({
        icon: "error",
        title: "Payment Failed",
        text: "The SSLCommerz transaction could not be completed. Please try again or choose Bank Transfer.",
        confirmButtonColor: "#FF4C00",
      });
    }
  }, [searchParams]);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await instance.get("/bookings/my-bookings");
      if (res.data?.success && Array.isArray(res.data?.data)) {
        setBookings(res.data.data);
      }
    } catch (err) {
      console.error("Failed to fetch customer bookings:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 text-left">
      {/* Header Banner */}
      <div className="bg-[#00062A] text-white p-6 sm:p-8 rounded-3xl border border-white/10 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[#FF4C00] text-xs font-black uppercase tracking-wider mb-1">
            <HiOutlineBookmark className="w-4 h-4" />
            <span>Customer Portal</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            My Flat Bookings & Reservations
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            Track your property unit reservations, payment verification, and handover status.
          </p>
        </div>

        <Link
          href="/flats"
          className="px-5 py-3 rounded-2xl bg-[#FF4C00] hover:bg-[#e04300] text-white text-xs font-black flex items-center justify-center gap-2 shadow-lg shadow-[#FF4C00]/20 transition shrink-0 no-underline"
        >
          <HiOutlineBuildingOffice2 className="w-4 h-4" />
          <span>Browse Available Flats</span>
        </Link>
      </div>

      {/* Bookings List */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Array.from({ length: 4 }).map((_, idx) => (
            <PropertyCardSkeleton key={idx} />
          ))}
        </div>
      ) : bookings.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-slate-200/80 shadow-sm text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-[#FF4C00]/10 text-[#FF4C00] flex items-center justify-center mx-auto">
            <HiOutlineClock className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-[#00062A]">No Active Reservations</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
            You haven't submitted any flat booking requests yet. Browse our project listings to reserve your dream home.
          </p>
          <div className="pt-2">
            <Link
              href="/flats"
              className="inline-flex px-6 py-3 rounded-xl bg-[#00062A] text-white text-xs font-bold hover:bg-[#00062A]/90 transition no-underline"
            >
              Explore Property Directory
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {bookings.map((booking) => {
            const flat = booking.flat || {};
            const property = flat.property || {};
            const payment = Array.isArray(booking.payments) && booking.payments[0] ? booking.payments[0] : {};

            const imageUrl =
              (Array.isArray(flat.imageUrls) && flat.imageUrls[0]) ||
              (Array.isArray(property.imageUrls) && property.imageUrls[0]) ||
              "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80";

            return (
              <div
                key={booking.id}
                className="bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-md transition flex flex-col justify-between"
              >
                <div>
                  {/* Top Image & Badges */}
                  <div className="relative h-48 w-full bg-slate-100">
                    <Image
                      src={imageUrl}
                      alt={flat.title || "Flat Unit"}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute top-3 left-3 flex flex-wrap gap-2">
                      <span className="bg-[#00062A]/90 backdrop-blur-md text-white text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
                        {booking.bookingNumber}
                      </span>
                      <span
                        className={`text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider ${
                          booking.status === "CONFIRMED"
                            ? "bg-emerald-500 text-white"
                            : booking.status === "CANCELLED"
                            ? "bg-rose-500 text-white"
                            : "bg-amber-500 text-white"
                        }`}
                      >
                        {booking.status}
                      </span>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-5 space-y-3">
                    <div>
                      <span className="text-[10px] font-extrabold text-[#FF4C00] uppercase tracking-wider block">
                        {property.title || "Building Project"}
                      </span>
                      <h3 className="text-base font-black text-[#00062A] tracking-tight">
                        {flat.title || `Flat ${flat.flatNumber}`}
                      </h3>
                      <p className="text-xs text-slate-500 font-medium mt-0.5">
                        {property.address}, {property.area}, {property.city}
                      </p>
                    </div>

                    <div className="grid grid-cols-3 gap-2 bg-slate-50 p-3 rounded-2xl border border-slate-100 text-center text-xs">
                      <div>
                        <span className="text-[9px] font-bold text-slate-400 uppercase block">Unit</span>
                        <strong className="text-[#00062A]">{flat.flatNumber || "N/A"}</strong>
                      </div>
                      <div>
                        <span className="text-[9px] font-bold text-slate-400 uppercase block">Floor</span>
                        <strong className="text-[#00062A]">G+{flat.floorNumber || 1}</strong>
                      </div>
                      <div>
                        <span className="text-[9px] font-bold text-slate-400 uppercase block">Size</span>
                        <strong className="text-[#FF4C00]">{flat.size || 0} sqft</strong>
                      </div>
                    </div>

                    {/* Payment Info */}
                    <div className="border-t border-slate-100 pt-3 space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500 font-medium">Downpayment:</span>
                        <strong className="text-[#FF4C00] font-black">
                          ৳ {Number(booking.bookingAmount).toLocaleString()}
                        </strong>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-slate-500 font-medium">Payment Method:</span>
                        <span className="font-bold text-[#00062A] flex items-center gap-1">
                          {payment.paymentMethod === "SSLCOMMERZ" ? (
                            <HiOutlineCreditCard className="text-[#FF4C00]" />
                          ) : (
                            <HiOutlineBanknotes className="text-emerald-600" />
                          )}
                          <span>{payment.paymentMethod || "Bank Transfer"}</span>
                        </span>
                      </div>

                      {payment.bankTranId && (
                        <div className="flex items-center justify-between">
                          <span className="text-slate-500 font-medium">Transaction ID:</span>
                          <span className="font-mono text-slate-700 font-bold">{payment.bankTranId}</span>
                        </div>
                      )}

                      <div className="flex items-center justify-between pt-1">
                        <span className="text-slate-500 font-medium">Verification Status:</span>
                        <span
                          className={`font-bold flex items-center gap-1 text-[11px] ${
                            booking.paymentStatus === "VALIDATED"
                              ? "text-emerald-600"
                              : booking.paymentStatus === "REJECTED"
                              ? "text-rose-600"
                              : "text-amber-600"
                          }`}
                        >
                          {booking.paymentStatus === "VALIDATED" ? (
                            <HiOutlineCheckCircle />
                          ) : booking.paymentStatus === "REJECTED" ? (
                            <HiOutlineXCircle />
                          ) : (
                            <HiOutlineClock />
                          )}
                          <span>{booking.paymentStatus}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer Action */}
                <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-3">
                  <span className="text-[10px] font-semibold text-slate-400">
                    Booked on {new Date(booking.createdAt).toLocaleDateString()}
                  </span>
                  <Link
                    href="/dashboard/billing"
                    className="px-4 py-2 rounded-xl bg-[#00062A] text-white text-xs font-bold hover:bg-[#FF4C00] transition no-underline"
                  >
                    View Invoice & PDF
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyBookingsMainView;
