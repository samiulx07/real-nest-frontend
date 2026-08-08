"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRootContext } from "@/contexts/RootContext";
import instance from "@/services/baseServices";
import Swal from "sweetalert2";
import {
  HiOutlineBuildingOffice2,
  HiOutlineHome,
  HiOutlineTicket,
  HiOutlineClock,
  HiOutlinePlus,
  HiOutlineCheck,
  HiOutlineXMark,
  HiOutlineArrowTopRightOnSquare,
  HiOutlineSquares2X2,
  HiOutlineCreditCard,
  HiOutlineSparkles,
  HiOutlineArrowRight,
  HiOutlineMagnifyingGlass,
} from "react-icons/hi2";

export const DashboardMainView = () => {
  const { user } = useRootContext();
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  const isAdmin = user?.role === "SUPER_ADMIN" || user?.role === "ADMIN" || user?.role === "STAFF";

  const fetchSummary = async () => {
    try {
      setLoading(true);
      const res = await instance.get("/analytics/summary");
      if (res.data?.success) {
        setSummary(res.data.data);
      }
    } catch (err: any) {
      if (err?.response?.status !== 401) {
        console.error("Failed to fetch dashboard summary:", err);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchSummary();
    }
  }, [user]);

  const handleApprove = async (paymentId: string) => {
    const confirm = await Swal.fire({
      title: "Approve Payment?",
      text: "This will mark the payment as validated and set the flat status to BOOKED.",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#10B981",
      cancelButtonColor: "#64748B",
      confirmButtonText: "Yes, Approve",
    });

    if (confirm.isConfirmed) {
      try {
        setProcessingId(paymentId);
        const res = await instance.patch(`/payments/${paymentId}/approve`);
        if (res.data?.success) {
          Swal.fire("Approved!", "Payment has been approved successfully.", "success");
          fetchSummary();
        }
      } catch (err: any) {
        Swal.fire("Error", err.response?.data?.message || "Failed to approve payment", "error");
      } finally {
        setProcessingId(null);
      }
    }
  };

  const handleReject = async (paymentId: string) => {
    const confirm = await Swal.fire({
      title: "Reject Payment?",
      text: "This will reject the payment and set the flat back to AVAILABLE.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#EF4444",
      cancelButtonColor: "#64748B",
      confirmButtonText: "Yes, Reject",
    });

    if (confirm.isConfirmed) {
      try {
        setProcessingId(paymentId);
        const res = await instance.patch(`/payments/${paymentId}/reject`);
        if (res.data?.success) {
          Swal.fire("Rejected", "Payment has been rejected.", "info");
          fetchSummary();
        }
      } catch (err: any) {
        Swal.fire("Error", err.response?.data?.message || "Failed to reject payment", "error");
      } finally {
        setProcessingId(null);
      }
    }
  };

  // ─── 1. CUSTOMER / NORMAL USER DASHBOARD ─────────────────────────
  if (!isAdmin) {
    return (
      <div className="space-y-6 pb-12">
        {/* Customer Header Banner */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-[#FF4C00] text-xs font-black uppercase tracking-wider mb-1">
              <HiOutlineSparkles className="w-4 h-4" />
              <span>Customer Portal</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-[#00062A] tracking-tight">
              Welcome, {user?.fullName || "Valued Customer"}! 👋
            </h2>
            <p className="text-xs text-slate-500 font-medium mt-1">
              Manage your flat reservations, payment receipts, and property inquiries.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <Link
              href="/flats"
              className="inline-flex items-center gap-1.5 bg-[#FF4C00] hover:bg-[#e04300] text-white px-4 py-2 rounded-xl text-xs font-bold transition-colors shadow-xs"
            >
              <HiOutlineMagnifyingGlass className="w-4 h-4" />
              <span>Browse Available Flats</span>
            </Link>
            <Link
              href="/dashboard/my-bookings"
              className="inline-flex items-center gap-1.5 bg-[#00062A] hover:bg-[#00041f] text-white px-4 py-2 rounded-xl text-xs font-bold transition-colors shadow-xs"
            >
              <span>My Bookings</span>
            </Link>
          </div>
        </div>

        {/* Customer Top 4 Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* My Bookings */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">My Reservations</span>
              <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <HiOutlineTicket className="w-5 h-5" />
              </div>
            </div>
            <div className="text-2xl font-black text-[#00062A]">
              {loading ? "..." : summary?.myBookingsCount || 0}
            </div>
            <p className="text-[11px] text-slate-400 font-medium">Flat units reserved or booked</p>
          </div>

          {/* Paid Amount */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">Validated Payments</span>
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <HiOutlineCreditCard className="w-5 h-5" />
              </div>
            </div>
            <div className="text-2xl font-black text-[#00062A]">
              ৳{loading ? "..." : (summary?.totalPaidAmount || 0).toLocaleString()}
            </div>
            <p className="text-[11px] text-slate-400 font-medium">Verified deposit payments</p>
          </div>

          {/* Pending Approval */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">Pending Review</span>
              <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <HiOutlineClock className="w-5 h-5" />
              </div>
            </div>
            <div className="text-2xl font-black text-[#00062A]">
              {loading ? "..." : summary?.pendingPaymentsCount || 0}
            </div>
            <p className="text-[11px] text-slate-400 font-medium">Payment slips awaiting admin verification</p>
          </div>

          {/* Account Status */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">Account Role</span>
              <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                <HiOutlineHome className="w-5 h-5" />
              </div>
            </div>
            <div className="text-lg font-black text-[#00062A] uppercase">
              {user?.role || "CUSTOMER"}
            </div>
            <p className="text-[11px] text-emerald-600 font-bold">Verified Real Nest Customer</p>
          </div>
        </div>

        {/* Customer Recent Bookings Table */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="p-4 bg-slate-50/70 border-b border-slate-200/80 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <HiOutlineTicket className="w-4 h-4 text-[#FF4C00]" />
              <h3 className="text-sm font-black text-[#00062A]">My Recent Flat Reservations</h3>
            </div>
            <Link
              href="/dashboard/my-bookings"
              className="text-xs font-bold text-[#FF4C00] hover:underline flex items-center gap-1"
            >
              <span>View All Bookings</span>
              <HiOutlineArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="p-4 overflow-x-auto">
            {loading ? (
              <div className="py-8 text-center text-xs text-slate-400 font-bold">
                Loading your booking history...
              </div>
            ) : !summary?.myRecentBookings?.length ? (
              <div className="py-12 text-center space-y-3">
                <HiOutlineHome className="w-10 h-10 text-slate-300 mx-auto" />
                <h4 className="text-sm font-bold text-[#00062A]">No Flat Bookings Yet</h4>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Explore our luxury flat collection and reserve your dream home today.
                </p>
                <Link
                  href="/flats"
                  className="inline-flex items-center gap-1.5 bg-[#FF4C00] text-white text-xs font-bold px-4 py-2 rounded-xl"
                >
                  Browse Flat Directory
                </Link>
              </div>
            ) : (
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 font-extrabold uppercase tracking-wider text-[10px]">
                    <th className="pb-2.5">Booking #</th>
                    <th className="pb-2.5">Flat & Building</th>
                    <th className="pb-2.5">Agreed Amount</th>
                    <th className="pb-2.5">Payment Method</th>
                    <th className="pb-2.5 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                  {summary.myRecentBookings.map((b: any) => (
                    <tr key={b.id} className="hover:bg-slate-50/50">
                      <td className="py-3 pr-2 font-mono font-black text-[#00062A]">
                        {b.bookingNumber}
                      </td>
                      <td className="py-3 px-1">
                        <div className="font-bold text-[#00062A]">{b.flat?.title || "Flat Unit"}</div>
                        <div className="text-[10px] text-slate-400">{b.flat?.property?.title || "Real Nest Property"}</div>
                      </td>
                      <td className="py-3 px-1 font-black text-[#00062A]">
                        ৳{b.bookingAmount?.toLocaleString()}
                      </td>
                      <td className="py-3 px-1">
                        <span className="inline-block px-2 py-0.5 rounded-md bg-slate-100 text-[10px] font-bold uppercase">
                          {b.payments?.[0]?.paymentMethod || "SSLCOMMERZ"}
                        </span>
                      </td>
                      <td className="py-3 pl-2 text-right">
                        <span
                          className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                            b.status === "CONFIRMED"
                              ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                              : b.status === "PENDING"
                              ? "bg-amber-100 text-amber-800 border border-amber-200"
                              : "bg-rose-100 text-rose-800 border border-rose-200"
                          }`}
                        >
                          {b.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ─── 2. ADMIN DASHBOARD OVERVIEW ─────────────────────────────────
  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[#FF4C00] text-xs font-black uppercase tracking-wider mb-1">
            <HiOutlineSquares2X2 className="w-4 h-4" />
            <span>Admin Overview</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-[#00062A] tracking-tight">
            Welcome back, {user?.fullName || "Admin"}! 👋
          </h2>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Here is a high-level summary of your property portfolio and payment approvals queue.
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            href="/dashboard/properties/create"
            className="inline-flex items-center gap-1.5 bg-[#FF4C00] hover:bg-[#e04300] text-white px-3.5 py-2 rounded-xl text-xs font-bold transition-colors shadow-xs"
          >
            <HiOutlinePlus className="w-4 h-4 stroke-[2.5]" />
            <span>Add Property</span>
          </Link>
          <Link
            href="/dashboard/flats/create"
            className="inline-flex items-center gap-1.5 bg-[#00062A] hover:bg-[#00041f] text-white px-3.5 py-2 rounded-xl text-xs font-bold transition-colors shadow-xs"
          >
            <HiOutlinePlus className="w-4 h-4 stroke-[2.5]" />
            <span>Add Flat</span>
          </Link>
          <Link
            href="/dashboard/bookings"
            className="inline-flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 px-3.5 py-2 rounded-xl text-xs font-bold transition-colors"
          >
            <span>Bookings</span>
          </Link>
        </div>
      </div>

      {/* Top 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Stat 1: Total Properties */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">Properties</span>
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <HiOutlineBuildingOffice2 className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-[#00062A]">
            {loading ? "..." : summary?.totalProperties || 0}
          </div>
          <p className="text-[11px] text-slate-400 font-medium">Registered building developments</p>
        </div>

        {/* Stat 2: Total Flats */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">Total Flats</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <HiOutlineHome className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-[#00062A]">
            {loading ? "..." : summary?.totalFlats || 0}
          </div>
          <p className="text-[11px] text-slate-400 font-medium">Available & booked flat units</p>
        </div>

        {/* Stat 3: Total Bookings */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">Total Bookings</span>
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <HiOutlineTicket className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-[#00062A]">
            {loading ? "..." : summary?.totalBookings || 0}
          </div>
          <p className="text-[11px] text-slate-400 font-medium">Customer booking submissions</p>
        </div>

        {/* Stat 4: Pending Approvals */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">Pending Approvals</span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <HiOutlineClock className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-black text-[#00062A]">
              {loading ? "..." : summary?.pendingPaymentsCount || 0}
            </span>
            {(summary?.pendingPaymentsCount || 0) > 0 && (
              <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 animate-pulse">
                Action Required
              </span>
            )}
          </div>
          <p className="text-[11px] text-slate-400 font-medium">Manual payment verifications</p>
        </div>
      </div>

      {/* Main Table: Recent Flat Inventory Overview */}
      <div className="grid grid-cols-1 gap-6">
        {/* Recent Flat Inventory Status */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden flex flex-col">
          <div className="p-4 bg-slate-50/70 border-b border-slate-200/80 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <HiOutlineHome className="w-4 h-4 text-emerald-500" />
              <h3 className="text-sm font-black text-[#00062A]">Recent Flat Inventory</h3>
            </div>
            <Link
              href="/dashboard/flats"
              className="text-xs font-bold text-[#FF4C00] hover:underline"
            >
              View All
            </Link>
          </div>

          <div className="p-4 flex-1 overflow-x-auto">
            {loading ? (
              <div className="py-8 text-center text-xs text-slate-400 font-bold">
                Loading flat inventory...
              </div>
            ) : !summary?.recentFlats?.length ? (
              <div className="py-8 text-center text-xs text-slate-400 font-medium">
                No flat units registered yet.
              </div>
            ) : (
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 font-extrabold uppercase tracking-wider text-[10px]">
                    <th className="pb-2.5">Flat Title</th>
                    <th className="pb-2.5">Property</th>
                    <th className="pb-2.5">Price</th>
                    <th className="pb-2.5 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                  {summary.recentFlats.map((flat: any) => (
                    <tr key={flat.id} className="hover:bg-slate-50/50">
                      <td className="py-3 pr-2">
                        <div className="font-bold text-[#00062A]">{flat.title}</div>
                        <div className="text-[10px] text-slate-400">Unit: {flat.flatNumber}</div>
                      </td>
                      <td className="py-3 px-1 text-slate-600">
                        {flat.property?.title || "N/A"}
                      </td>
                      <td className="py-3 px-1 font-black text-[#00062A]">
                        ৳{flat.price?.toLocaleString()}
                      </td>
                      <td className="py-3 pl-2 text-right">
                        <span
                          className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                            flat.status === "AVAILABLE"
                              ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                              : flat.status === "BOOKED"
                              ? "bg-amber-100 text-amber-800 border border-amber-200"
                              : flat.status === "SOLD"
                              ? "bg-rose-100 text-rose-800 border border-rose-200"
                              : "bg-slate-100 text-slate-700"
                          }`}
                        >
                          {flat.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardMainView;
