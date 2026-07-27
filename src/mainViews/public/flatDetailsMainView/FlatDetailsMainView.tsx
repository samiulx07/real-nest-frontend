"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "react-toastify";
import ImageGallery from "@/components/imageGallery/ImageGallery";
import { HiOutlineLocationMarker as LocationIcon } from "react-icons/hi";
import {
  HiOutlineArrowLeft,
  HiOutlineHome,
  HiOutlineBuildingOffice2,
  HiOutlineTag,
  HiOutlineBanknotes,
  HiOutlineCheckBadge,
  HiOutlineSparkles,
  HiOutlinePhone,
  HiOutlineEnvelope,
  HiOutlineCalendar,
  HiXMark,
} from "react-icons/hi2";
import { BiBed, BiBath, BiArea } from "react-icons/bi";
import instance from "@/services/baseServices";
import { useRootContext } from "@/contexts/RootContext";

interface FlatDetailsMainViewProps {
  flatId: string;
}

export const FlatDetailsMainView: React.FC<FlatDetailsMainViewProps> = ({
  flatId,
}) => {
  const { user } = useRootContext();
  const [flat, setFlat] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState<string>("");

  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [bookingSubmitting, setBookingSubmitting] = useState(false);
  const [bookingForm, setBookingForm] = useState({
    fullName: user?.fullName || "",
    contactNo: (user as any)?.contactNo || "",
    note: "",
  });

  useEffect(() => {
    const fetchFlatDetails = async () => {
      try {
        setLoading(true);
        const res = await instance.get(`/flats/${flatId}`);
        if (res.data?.success && res.data?.data) {
          const data = res.data.data;
          setFlat(data);
          const firstImg =
            (Array.isArray(data.imageUrls) && data.imageUrls[0]) ||
            "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80";
          setActiveImage(firstImg);
        }
      } catch (err) {
        console.error("Failed to fetch flat details:", err);
      } finally {
        setLoading(false);
      }
    };

    if (flatId) {
      fetchFlatDetails();
    }
  }, [flatId]);

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingForm.fullName || !bookingForm.contactNo) {
      toast.warning("Please provide your name and contact number.");
      return;
    }

    try {
      setBookingSubmitting(true);
      // Simulate booking request submission
      await new Promise((resolve) => setTimeout(resolve, 800));
      toast.success(`Booking request for Flat ${flat.flatNumber} submitted! Our sales agent will contact you.`);
      setBookingModalOpen(false);
    } catch (err) {
      toast.error("Failed to submit booking request.");
    } finally {
      setBookingSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-sm font-bold text-slate-400">
        Loading flat details...
      </div>
    );
  }

  if (!flat) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4 text-center">
        <h2 className="text-xl font-bold text-[#00062A]">Flat Unit Not Found</h2>
        <Link
          href="/flats"
          className="px-6 py-2.5 rounded-xl bg-[#00062A] text-white text-xs font-bold no-underline"
        >
          Back to Flats Directory
        </Link>
      </div>
    );
  }

  const imagesList =
    Array.isArray(flat.imageUrls) && flat.imageUrls.length > 0
      ? flat.imageUrls
      : ["https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80"];

  const property = flat.property || {};

  return (
    <div className="min-h-screen bg-[#fafbfc] pb-16">
      {/* Header Banner */}
      <div className="bg-[#00062A] text-white pt-28 pb-16 md:pt-32 md:pb-20 px-4">

        <div className="container mx-auto max-w-6xl space-y-3">
          <Link
            href="/flats"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-300 hover:text-[#FF4C00] transition no-underline"
          >
            <HiOutlineArrowLeft className="w-4 h-4" />
            <span>Back to All Flats</span>
          </Link>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-2">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-[#FF4C00] text-white text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
                  Flat {flat.flatNumber}
                </span>
                <span
                  className={`text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider ${
                    flat.status === "AVAILABLE"
                      ? "bg-emerald-500 text-white"
                      : flat.status === "BOOKED"
                      ? "bg-amber-500 text-white"
                      : "bg-rose-500 text-white"
                  }`}
                >
                  {flat.status}
                </span>
              </div>
              <h1 className="text-2xl md:text-4xl font-black text-white tracking-tight">
                {flat.title}
              </h1>
              <div className="flex items-center gap-1.5 text-xs text-slate-300 mt-2 font-medium">
                <HiOutlineBuildingOffice2 className="text-[#FF4C00] text-base shrink-0" />
                <Link href={`/projects/${property.id}`} className="text-white hover:underline">
                  {property.title || "Building Project"}
                </Link>
                <span>• {property.area}, {property.city}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <div className="bg-white/5 p-4 rounded-2xl border border-white/10 shrink-0">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                  Total Flat Price
                </span>
                <span className="text-2xl font-black text-[#FF4C00]">
                  ৳ {Number(flat.price).toLocaleString()}
                </span>
              </div>

              {flat.status === "AVAILABLE" && (
                <button
                  onClick={() => setBookingModalOpen(true)}
                  className="px-6 py-4 rounded-2xl bg-[#FF4C00] hover:bg-[#e04300] text-white text-xs font-black shadow-lg shadow-[#FF4C00]/20 transition cursor-pointer border-none uppercase tracking-wider"
                >
                  Book This Flat
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="container mx-auto max-w-6xl px-4 -mt-8 relative z-10 space-y-8">
        {/* Gallery & Quick Specs Card */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Gallery Block — with Lightbox */}
          <div className="lg:col-span-2 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
            <ImageGallery images={imagesList} previewCount={5} />
          </div>

          {/* Quick Info & Sales Box */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
              <h3 className="text-sm font-black text-[#00062A] uppercase tracking-wider pb-2 border-b border-slate-100 flex items-center gap-2">
                <BiBed className="w-5 h-5 text-[#FF4C00]" />
                <span>Flat Specifications</span>
              </h3>

              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between py-1.5 border-b border-slate-50">
                  <span className="text-slate-500 font-bold">Flat Code / Number</span>
                  <span className="font-extrabold text-[#00062A]">{flat.flatNumber}</span>
                </div>
                <div className="flex items-center justify-between py-1.5 border-b border-slate-50">
                  <span className="text-slate-500 font-bold">Floor Level</span>
                  <span className="font-extrabold text-[#00062A]">Floor {flat.floorNumber}</span>
                </div>
                <div className="flex items-center justify-between py-1.5 border-b border-slate-50">
                  <span className="text-slate-500 font-bold">Bedrooms</span>
                  <span className="font-extrabold text-[#00062A]">{flat.beds} Beds</span>
                </div>
                <div className="flex items-center justify-between py-1.5 border-b border-slate-50">
                  <span className="text-slate-500 font-bold">Bathrooms</span>
                  <span className="font-extrabold text-[#00062A]">{flat.baths} Baths</span>
                </div>
                <div className="flex items-center justify-between py-1.5 border-b border-slate-50">
                  <span className="text-slate-500 font-bold">Kitchens</span>
                  <span className="font-extrabold text-[#00062A]">{flat.kitchens || 1}</span>
                </div>
                <div className="flex items-center justify-between py-1.5 border-b border-slate-50">
                  <span className="text-slate-500 font-bold">Balconies</span>
                  <span className="font-extrabold text-[#00062A]">{flat.balconies || 0}</span>
                </div>
                <div className="flex items-center justify-between py-1.5">
                  <span className="text-slate-500 font-bold">Total Size</span>
                  <span className="font-black text-[#FF4C00]">{flat.size} sqft</span>
                </div>
              </div>
            </div>

            {/* Sales Contact Box */}
            <div className="bg-[#00062A] text-white p-6 rounded-2xl space-y-4">
              <h4 className="text-base font-extrabold text-white">Book or Schedule a Visit</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Contact our customer support team to schedule a physical unit walkthrough or request installment schedules.
              </p>
              <div className="space-y-2 pt-1 text-xs">
                <a
                  href="tel:+8801700000000"
                  className="flex items-center gap-2.5 p-3 rounded-xl bg-white/10 hover:bg-[#FF4C00] text-white font-bold transition no-underline"
                >
                  <HiOutlinePhone className="w-4 h-4 text-[#FF4C00] group-hover:text-white" />
                  <span>Call Hotline: +880 1700-000000</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Description & Features */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-3">
              <h3 className="text-sm font-black text-[#00062A] uppercase tracking-wider pb-2 border-b border-slate-100">
                Flat Description & Layout
              </h3>
              <p className="text-xs md:text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                {flat.description || "No specific description provided for this flat unit."}
              </p>
            </div>

            {/* Flat Specific Features */}
            {Array.isArray(flat.amenities) && flat.amenities.length > 0 && (
              <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
                <h3 className="text-sm font-black text-[#00062A] uppercase tracking-wider pb-2 border-b border-slate-100 flex items-center gap-2">
                  <HiOutlineSparkles className="w-5 h-5 text-[#FF4C00]" />
                  <span>Flat Specific Features & Amenities</span>
                </h3>
                <div className="flex flex-wrap gap-2.5">
                  {flat.amenities.map((item: string, idx: number) => (
                    <span
                      key={idx}
                      className="px-4 py-2 rounded-xl bg-[#00062A]/5 text-[#00062A] border border-[#00062A]/10 text-xs font-bold flex items-center gap-2"
                    >
                      <HiOutlineCheckBadge className="w-4 h-4 text-[#FF4C00]" />
                      <span>{item}</span>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Assigned Building Card */}
          {property.id && (
            <div className="space-y-4">
              <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-3">
                <span className="text-[10px] font-extrabold text-[#FF4C00] uppercase tracking-wider block">
                  Parent Building Project
                </span>
                <h3 className="text-lg font-black text-[#00062A]">{property.title}</h3>
                <p className="text-xs text-slate-500 line-clamp-2">
                  {property.address}, {property.area}, {property.city}
                </p>
                <div className="pt-2">
                  <Link
                    href={`/projects/${property.id}`}
                    className="inline-flex px-4 py-2.5 rounded-xl bg-[#00062A] text-white text-xs font-bold no-underline hover:bg-[#00062A]/90 transition"
                  >
                    View Project Details
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Booking Modal */}
      {bookingModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#00062A]/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-2xl border border-slate-200 shadow-2xl p-6 space-y-4 relative animate-in fade-in zoom-in duration-200">
            <button
              onClick={() => setBookingModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-[#00062A] cursor-pointer border-none bg-transparent"
            >
              <HiXMark className="w-6 h-6" />
            </button>

            <div className="border-b border-slate-100 pb-3">
              <span className="text-[10px] font-extrabold text-[#FF4C00] uppercase tracking-wider">
                Booking Request
              </span>
              <h3 className="text-xl font-black text-[#00062A] mt-0.5">
                Reserve Flat {flat.flatNumber}
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                {property.title} ({property.area}, {property.city}) — ৳ {Number(flat.price).toLocaleString()}
              </p>
            </div>

            <form onSubmit={handleBookingSubmit} className="space-y-4">
              <div>
                <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block mb-1">
                  Your Full Name *
                </label>
                <input
                  type="text"
                  value={bookingForm.fullName}
                  onChange={(e) => setBookingForm((prev) => ({ ...prev, fullName: e.target.value }))}
                  required
                  placeholder="e.g. Samiul Hasan"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold focus:outline-none focus:border-[#FF4C00]"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block mb-1">
                  Contact Phone Number *
                </label>
                <input
                  type="text"
                  value={bookingForm.contactNo}
                  onChange={(e) => setBookingForm((prev) => ({ ...prev, contactNo: e.target.value }))}
                  required
                  placeholder="+880 1700-000000"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold focus:outline-none focus:border-[#FF4C00]"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block mb-1">
                  Booking Note / Inquiries
                </label>
                <textarea
                  rows={3}
                  value={bookingForm.note}
                  onChange={(e) => setBookingForm((prev) => ({ ...prev, note: e.target.value }))}
                  placeholder="Optional message regarding payment plan or site visit..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:border-[#FF4C00]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setBookingModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-100 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={bookingSubmitting}
                  className="px-6 py-2.5 rounded-xl bg-[#FF4C00] hover:bg-[#e04300] text-white text-xs font-extrabold shadow-md shadow-[#FF4C00]/20 transition disabled:opacity-50 cursor-pointer border-none"
                >
                  {bookingSubmitting ? "Submitting..." : "Confirm Booking Request"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FlatDetailsMainView;
