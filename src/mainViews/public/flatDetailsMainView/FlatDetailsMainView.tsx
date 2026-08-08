"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "react-toastify";
import dynamic from "next/dynamic";
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
  HiOutlineGlobeAlt,
  HiOutlinePhone,
  HiOutlineEnvelope,
  HiOutlineCalendar,
  HiXMark,
} from "react-icons/hi2";
import { BiBed, BiBath, BiArea } from "react-icons/bi";
import instance from "@/services/baseServices";
import { useRootContext } from "@/contexts/RootContext";
import FlatDetailsSkeleton from "@/components/skeletons/FlatDetailsSkeleton";
import BookingModal from "@/components/bookingModal/BookingModal";

const MapPicker = dynamic(() => import("@/components/mapPicker/MapPicker"), { ssr: false });

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
    return <FlatDetailsSkeleton />;
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
                  className="px-6 py-4 rounded-2xl bg-[#FF4C00] hover:bg-[#e04300] text-white text-xs font-black shadow-lg shadow-[#FF4C00]/20 transition cursor-pointer border-none uppercase tracking-wider flex items-center gap-1.5"
                >
                  <HiOutlineHome className="w-4 h-4" />
                  <span>Book Now</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="container mx-auto max-w-6xl px-4 -mt-8 relative z-10 space-y-8">
        {/* Main Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Left Column (2 Cols): Gallery + Description + Specs + Features + Location Map */}
          <div className="lg:col-span-2 space-y-6">
            {/* Gallery Block — with Lightbox */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
              <ImageGallery images={imagesList} previewCount={5} />
            </div>

            {/* Description */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-3">
              <h3 className="text-sm font-black text-[#00062A] uppercase tracking-wider pb-2 border-b border-slate-100">
                Flat Description & Layout
              </h3>
              <p className="text-xs md:text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                {flat.description || "No specific description provided for this flat unit."}
              </p>
            </div>

            {/* Flat Specifications Card — Placed after Description & Layout */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
              <h3 className="text-sm font-black text-[#00062A] uppercase tracking-wider pb-2 border-b border-slate-100 flex items-center gap-2">
                <BiBed className="w-5 h-5 text-[#FF4C00]" />
                <span>Flat Specifications</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 text-xs sm:text-sm">
                <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-slate-500 font-bold flex items-center gap-2">
                    <HiOutlineTag className="w-4 h-4 text-[#FF4C00]" />
                    Flat Code
                  </span>
                  <span className="font-extrabold text-[#00062A]">{flat.flatNumber}</span>
                </div>

                <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-slate-500 font-bold flex items-center gap-2">
                    <HiOutlineBuildingOffice2 className="w-4 h-4 text-[#FF4C00]" />
                    Floor Level
                  </span>
                  <span className="font-extrabold text-[#00062A]">Floor {flat.floorNumber}</span>
                </div>

                <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-slate-500 font-bold flex items-center gap-2">
                    <BiBed className="w-4 h-4 text-[#FF4C00]" />
                    Bedrooms
                  </span>
                  <span className="font-extrabold text-[#00062A]">{flat.beds} Beds</span>
                </div>

                <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-slate-500 font-bold flex items-center gap-2">
                    <BiBath className="w-4 h-4 text-[#FF4C00]" />
                    Bathrooms
                  </span>
                  <span className="font-extrabold text-[#00062A]">{flat.baths} Baths</span>
                </div>

                <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-slate-500 font-bold flex items-center gap-2">
                    <HiOutlineHome className="w-4 h-4 text-[#FF4C00]" />
                    Kitchen Facility
                  </span>
                  <span className="font-extrabold text-[#00062A]">
                    {flat.kitchens ? "Available" : "No Kitchen (Commercial)"}
                  </span>
                </div>

                <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-slate-500 font-bold flex items-center gap-2">
                    <HiOutlineSparkles className="w-4 h-4 text-[#FF4C00]" />
                    Balconies
                  </span>
                  <span className="font-extrabold text-[#00062A]">{flat.balconies || 0}</span>
                </div>

                <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-slate-500 font-bold flex items-center gap-2">
                    <BiArea className="w-4 h-4 text-[#FF4C00]" />
                    Total Size
                  </span>
                  <span className="font-black text-[#FF4C00]">{flat.size} sqft</span>
                </div>

                {flat.furnishing && (
                  <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-slate-500 font-bold flex items-center gap-2">
                      <HiOutlineSparkles className="w-4 h-4 text-[#FF4C00]" />
                      Furnishing
                    </span>
                    <span className="font-extrabold text-[#00062A]">{flat.furnishing}</span>
                  </div>
                )}

                {flat.facing && (
                  <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-slate-500 font-bold flex items-center gap-2">
                      <HiOutlineGlobeAlt className="w-4 h-4 text-[#FF4C00]" />
                      Facing
                    </span>
                    <span className="font-extrabold text-[#00062A]">{flat.facing}</span>
                  </div>
                )}

                {flat.floorType && (
                  <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-slate-500 font-bold flex items-center gap-2">
                      <HiOutlineTag className="w-4 h-4 text-[#FF4C00]" />
                      Floor Type
                    </span>
                    <span className="font-extrabold text-[#00062A]">{flat.floorType}</span>
                  </div>
                )}

                {flat.completionDate && (
                  <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-slate-500 font-bold flex items-center gap-2">
                      <HiOutlineCalendar className="w-4 h-4 text-[#FF4C00]" />
                      Handover Date
                    </span>
                    <span className="font-extrabold text-[#FF4C00]">
                      {new Date(flat.completionDate).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
                    </span>
                  </div>
                )}

                <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-slate-500 font-bold flex items-center gap-2">
                    <HiOutlineCheckBadge className="w-4 h-4 text-[#FF4C00]" />
                    Gas Line
                  </span>
                  <span className={`font-extrabold ${flat.hasGasLine ? "text-emerald-600" : "text-slate-400"}`}>
                    {flat.hasGasLine ? "✓ Connected" : "N/A"}
                  </span>
                </div>

                <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-slate-500 font-bold flex items-center gap-2">
                    <HiOutlineCheckBadge className="w-4 h-4 text-[#FF4C00]" />
                    Water Supply
                  </span>
                  <span className={`font-extrabold ${flat.hasWaterSupply !== false ? "text-emerald-600" : "text-slate-400"}`}>
                    {flat.hasWaterSupply !== false ? "✓ 24/7 Available" : "N/A"}
                  </span>
                </div>
              </div>
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

            {/* Location & Map Section */}
            {property.id && (
              <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
                <h3 className="text-sm font-black text-[#00062A] uppercase tracking-wider pb-2 border-b border-slate-100 flex items-center gap-2">
                  <LocationIcon className="w-5 h-5 text-[#FF4C00]" />
                  <span>Property Location & Map</span>
                </h3>

                <div className="text-xs text-slate-600 space-y-1 mb-3">
                  <p className="font-bold text-[#00062A]">{property.address}</p>
                  <p>{Array.from(new Set([property.area, property.upazila, property.district, property.division, property.city].filter(Boolean))).join(", ")}</p>
                </div>

                <div className="rounded-xl overflow-hidden border border-slate-200">
                  <MapPicker
                    latitude={property.latitude ? Number(property.latitude) : 23.7925}
                    longitude={property.longitude ? Number(property.longitude) : 90.4078}
                    readOnly={true}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Right Column (1 Col): Parent Building Card & Booking Contact Box */}
          <div className="space-y-6 lg:sticky lg:top-24">
            {property.id && (
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
                    View Building Project Details
                  </Link>
                </div>
              </div>
            )}

            {/* Sales Contact & Reservation Box */}
            <div className="bg-[#00062A] text-white p-6 rounded-2xl space-y-4">
              <h4 className="text-base font-extrabold text-white">Book or Reserve Unit</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Reserve this flat unit now with instant SSLCommerz online payment or bank transfer.
              </p>
              <div className="space-y-2 pt-1 text-xs">
                <button
                  onClick={() => setBookingModalOpen(true)}
                  className="w-full py-3 rounded-xl bg-[#FF4C00] hover:bg-[#e04300] text-white font-extrabold flex items-center justify-center gap-2 shadow-lg shadow-[#FF4C00]/20 transition cursor-pointer border-none uppercase tracking-wider"
                >
                  <HiOutlineHome className="w-5 h-5" />
                  <span>Book Now</span>
                </button>
                <a
                  href="tel:+8801700000000"
                  className="flex items-center justify-center gap-2.5 p-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold transition no-underline"
                >
                  <HiOutlinePhone className="w-4 h-4 text-slate-300" />
                  <span>Hotline: +880 1700-000000</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      <BookingModal
        flat={{ ...flat, property }}
        isOpen={bookingModalOpen}
        onClose={() => setBookingModalOpen(false)}
      />
    </div>
  );
};

export default FlatDetailsMainView;
