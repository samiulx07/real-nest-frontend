"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import {
  HiOutlineXMark,
  HiOutlineBuildingOffice2,
  HiOutlineBanknotes,
  HiOutlineCreditCard,
  HiOutlineShieldCheck,
  HiOutlineCheckCircle,
  HiOutlinePhoto,
  HiOutlinePhone,
  HiOutlineEnvelope,
  HiOutlineUser,
} from "react-icons/hi2";
import { useRootContext } from "@/contexts/RootContext";
import instance from "@/services/baseServices";
import MediaPickerModal from "@/components/mediaPickerModal/MediaPickerModal";

interface BookingModalProps {
  flat: any;
  isOpen: boolean;
  onClose: () => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  flat,
  isOpen,
  onClose,
}) => {
  const { user } = useRootContext();

  const [paymentMethod, setPaymentMethod] = useState<"SSLCOMMERZ" | "BANK_TRANSFER" | "BKASH" | "NAGAD">("BANK_TRANSFER");
  const [customerName, setCustomerName] = useState(user?.fullName || "");
  const [customerEmail, setCustomerEmail] = useState(user?.email || "");
  const [customerPhone, setCustomerPhone] = useState(user?.phone || "");
  const [bookingAmount, setBookingAmount] = useState<number>(flat?.price ? Math.round(flat.price * 0.1) : 100000); // 10% default downpayment
  const [senderAccount, setSenderAccount] = useState("");
  const [bankTranId, setBankTranId] = useState("");
  const [receiptUrl, setReceiptUrl] = useState("");
  const [notes, setNotes] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [mediaPickerOpen, setMediaPickerOpen] = useState(false);

  if (!isOpen || !flat) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast.error("Please log in to submit a flat booking request");
      return;
    }

    if (!customerName || !customerEmail || !customerPhone) {
      toast.error("Please fill in all required contact information");
      return;
    }

    if (bookingAmount <= 0) {
      toast.error("Please specify a valid booking downpayment amount");
      return;
    }

    if (paymentMethod !== "SSLCOMMERZ" && !bankTranId) {
      toast.error("Please provide the Transaction ID or Bank Ref Number");
      return;
    }

    try {
      setSubmitting(true);

      const payload = {
        flatId: flat.id,
        customerName,
        customerEmail,
        customerPhone,
        bookingAmount: Number(bookingAmount),
        notes,
        paymentMethod,
        senderAccount: senderAccount || undefined,
        bankTranId: bankTranId || undefined,
        receiptUrl: receiptUrl || undefined,
      };

      const res = await instance.post("/bookings", payload);

      if (res.data?.success) {
        const data = res.data.data;

        if (paymentMethod === "SSLCOMMERZ" && data?.gatewayUrl) {
          toast.info("Redirecting to SSLCommerz Sandbox payment portal...");
          window.location.href = data.gatewayUrl;
          return;
        }

        onClose();
        Swal.fire({
          icon: "success",
          title: "Reservation Submitted!",
          html: `
            <div class="text-left text-sm space-y-2">
              <p>Booking Number: <strong class="text-[#FF4C00]">${data.booking?.bookingNumber || "BK-CONFIRMED"}</strong></p>
              <p>Unit: <strong>${flat.title || "Flat " + flat.flatNumber}</strong></p>
              <p class="text-xs text-gray-500 mt-2">Your payment submission is pending admin verification. You will be notified once verified.</p>
            </div>
          `,
          confirmButtonColor: "#00062A",
          confirmButtonText: "Go to My Bookings",
        }).then(() => {
          window.location.href = "/dashboard/my-bookings";
        });
      }
    } catch (err: any) {
      console.error("Booking error:", err);
      toast.error(err.response?.data?.message || "Failed to submit booking request");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
        <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden border border-slate-100 my-8 text-left">
          {/* Header */}
          <div className="bg-[#00062A] text-white p-6 relative">
            <button
              onClick={onClose}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition cursor-pointer border-none"
            >
              <HiOutlineXMark className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2.5 text-[#FF4C00] text-xs font-black uppercase tracking-wider mb-1">
              <HiOutlineBuildingOffice2 className="w-4 h-4" />
              <span>{flat.property?.title || "Property Building"}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Reserve {flat.title || `Flat ${flat.flatNumber}`}
            </h2>
            <p className="text-xs text-slate-300 mt-1">
              Complete your reservation details and payment submission below.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
            {/* Step 1: Payment Method Choice */}
            <div className="space-y-3">
              <label className="text-xs font-black text-[#00062A] uppercase tracking-wider block">
                1. Select Payment Method
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* SSLCommerz Option */}
                <div
                  onClick={() => setPaymentMethod("SSLCOMMERZ")}
                  className={`p-4 rounded-2xl border-2 transition cursor-pointer flex flex-col justify-between gap-3 ${
                    paymentMethod === "SSLCOMMERZ"
                      ? "border-[#FF4C00] bg-[#FF4C00]/5"
                      : "border-slate-200 hover:border-slate-300 bg-white"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <HiOutlineCreditCard className="w-6 h-6 text-[#FF4C00]" />
                      <span className="text-xs font-black text-[#00062A]">Online SSLCommerz</span>
                    </div>
                    {paymentMethod === "SSLCOMMERZ" && (
                      <HiOutlineCheckCircle className="w-5 h-5 text-[#FF4C00]" />
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 leading-snug">
                    Pay instantly via bKash, Nagad, Visa, Mastercard, or Internet Banking (Sandbox).
                  </p>
                </div>

                {/* Bank Transfer Option */}
                <div
                  onClick={() => setPaymentMethod("BANK_TRANSFER")}
                  className={`p-4 rounded-2xl border-2 transition cursor-pointer flex flex-col justify-between gap-3 ${
                    paymentMethod === "BANK_TRANSFER"
                      ? "border-[#00062A] bg-[#00062A]/5"
                      : "border-slate-200 hover:border-slate-300 bg-white"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <HiOutlineBanknotes className="w-6 h-6 text-[#00062A]" />
                      <span className="text-xs font-black text-[#00062A]">Bank / Mobile Deposit</span>
                    </div>
                    {paymentMethod === "BANK_TRANSFER" && (
                      <HiOutlineCheckCircle className="w-5 h-5 text-[#00062A]" />
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 leading-snug">
                    Transfer money directly to our Bank account or bKash / Nagad merchant number.
                  </p>
                </div>
              </div>
            </div>

            {/* Bank Details Panel (Shown when Bank Transfer selected) */}
            {paymentMethod === "BANK_TRANSFER" && (
              <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 space-y-3">
                <div className="flex items-center gap-2 text-xs font-black text-[#00062A]">
                  <HiOutlineShieldCheck className="w-4 h-4 text-[#FF4C00]" />
                  <span>RealNest Official Payment Details</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="bg-white p-3 rounded-xl border border-slate-200/60">
                    <span className="text-[10px] font-bold text-slate-400 block uppercase">Bank Account</span>
                    <strong className="text-[#00062A]">Dutch-Bangla Bank PLC</strong>
                    <p className="text-slate-600 font-semibold mt-0.5">Acc: 110-120-456789</p>
                    <p className="text-[10px] text-slate-400">RealNest Properties Ltd. | Gulshan Br.</p>
                  </div>

                  <div className="bg-white p-3 rounded-xl border border-slate-200/60">
                    <span className="text-[10px] font-bold text-slate-400 block uppercase">Mobile Banking (Merchant)</span>
                    <strong className="text-pink-600">bKash / Nagad Merchant</strong>
                    <p className="text-slate-800 font-extrabold mt-0.5">01700-000000</p>
                    <p className="text-[10px] text-slate-400">Use "Payment" or "Send Money" option</p>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Contact Information */}
            <div className="space-y-3">
              <label className="text-xs font-black text-[#00062A] uppercase tracking-wider block">
                2. Applicant Information
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-600 mb-1 block">Full Name *</label>
                  <div className="relative">
                    <HiOutlineUser className="absolute left-3 top-3 text-slate-400 text-sm" />
                    <input
                      type="text"
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-[#00062A]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-600 mb-1 block">Email Address *</label>
                  <div className="relative">
                    <HiOutlineEnvelope className="absolute left-3 top-3 text-slate-400 text-sm" />
                    <input
                      type="email"
                      required
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-[#00062A]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-600 mb-1 block">Phone Number *</label>
                  <div className="relative">
                    <HiOutlinePhone className="absolute left-3 top-3 text-slate-400 text-sm" />
                    <input
                      type="text"
                      required
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-[#00062A]"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Step 3: Payment Breakdown & Transaction Fields */}
            <div className="space-y-3">
              <label className="text-xs font-black text-[#00062A] uppercase tracking-wider block">
                3. Payment Details
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-600 mb-1 block">Downpayment Amount (৳) *</label>
                  <input
                    type="number"
                    required
                    min={1000}
                    value={bookingAmount}
                    onChange={(e) => setBookingAmount(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 font-bold text-[#FF4C00] focus:outline-none focus:border-[#FF4C00]"
                  />
                  <span className="text-[10px] text-slate-400 mt-0.5 block">
                    Total Flat Price: ৳ {flat.price ? Number(flat.price).toLocaleString() : "0"}
                  </span>
                </div>

                {paymentMethod !== "SSLCOMMERZ" && (
                  <div>
                    <label className="text-[11px] font-bold text-slate-600 mb-1 block">Transaction ID / Bank Ref No *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. TRX987654321 or Bank Slip #"
                      value={bankTranId}
                      onChange={(e) => setBankTranId(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-[#00062A]"
                    />
                  </div>
                )}
              </div>

              {paymentMethod !== "SSLCOMMERZ" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="text-[11px] font-bold text-slate-600 mb-1 block">Sender Account Name / Mobile No</label>
                    <input
                      type="text"
                      placeholder="e.g. 017XXXXXXXX or Account Name"
                      value={senderAccount}
                      onChange={(e) => setSenderAccount(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-[#00062A]"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-600 mb-1 block">Deposit Slip / Screenshot (Optional)</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Image URL or pick image"
                        value={receiptUrl}
                        onChange={(e) => setReceiptUrl(e.target.value)}
                        className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => setMediaPickerOpen(true)}
                        className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1 shrink-0 border-none cursor-pointer"
                      >
                        <HiOutlinePhoto className="w-4 h-4" />
                        <span>Pick</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <div>
                <label className="text-[11px] font-bold text-slate-600 mb-1 block">Notes / Special Preferences</label>
                <textarea
                  rows={2}
                  placeholder="Add any additional comments or preferred handover schedule..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-50 transition cursor-pointer bg-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-2.5 rounded-xl bg-[#00062A] hover:bg-[#FF4C00] text-white font-extrabold text-xs shadow-md transition cursor-pointer border-none disabled:opacity-50"
              >
                {submitting
                  ? "Processing Reservation..."
                  : paymentMethod === "SSLCOMMERZ"
                  ? "Proceed to SSLCommerz Checkout"
                  : "Submit Reservation Request"}
              </button>
            </div>
          </form>
        </div>
      </div>

      <MediaPickerModal
        isOpen={mediaPickerOpen}
        onClose={() => setMediaPickerOpen(false)}
        onSelect={(urls: string[]) => {
          if (urls && urls[0]) {
            setReceiptUrl(urls[0]);
          }
          setMediaPickerOpen(false);
        }}
      />
    </>
  );
};

export default BookingModal;
