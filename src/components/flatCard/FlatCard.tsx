import React from "react";
import Image from "next/image";
import Link from "next/link";
import { HiOutlineLocationMarker as LocationIcon } from "react-icons/hi";
import { IoChevronForward } from "react-icons/io5";
import { BiBed, BiBath, BiArea } from "react-icons/bi";

interface FlatCardProps {
  flat: any;
}

export const FlatCard: React.FC<FlatCardProps> = ({ flat }) => {
  const imageUrl =
    (Array.isArray(flat.imageUrls) && flat.imageUrls[0]) ||
    flat.image ||
    "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80";

  const title = flat.title || `Flat ${flat.flatNumber || ""}`;
  const buildingTitle = flat.property?.title || "Assigned Building";
  const location = flat.property
    ? `${flat.property.area || ""}, ${flat.property.city || ""}`
    : "Dhaka, Bangladesh";

  const formattedPrice = flat.price
    ? `৳ ${Number(flat.price).toLocaleString()}`
    : "Contact for Price";

  return (
    <div className="flex flex-col sm:flex-row bg-white rounded-[20px] overflow-hidden border border-gray-100 shadow-[0_8px_30px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.06)] transition-all duration-300 group h-full">
      {/* Image Block */}
      <div className="relative w-full sm:w-[45%] h-[220px] sm:h-auto min-h-[220px] bg-slate-100 shrink-0">
        <Image
          src={imageUrl}
          alt={title}
          fill
          sizes="(max-width: 640px) 100vw, 30vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {flat.status && (
          <span
            className={`absolute top-3 left-3 text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider ${
              flat.status === "AVAILABLE"
                ? "bg-emerald-500 text-white"
                : flat.status === "BOOKED"
                ? "bg-amber-500 text-white"
                : "bg-rose-500 text-white"
            }`}
          >
            {flat.status}
          </span>
        )}
      </div>

      {/* Details Block */}
      <div className="w-full sm:w-[55%] p-5 flex flex-col justify-between gap-3 text-left">
        {/* Tag, Title & Location */}
        <div>
          <span className="inline-block bg-[#00062A]/5 text-[#00062A] text-[10px] font-extrabold px-2.5 py-0.5 rounded-md mb-1.5 tracking-wide uppercase">
            {buildingTitle}
          </span>
          <h3 className="text-base font-bold text-secondary tracking-tight line-clamp-1">
            {title}
          </h3>
          <div className="flex items-center gap-1 text-xs text-gray-500 font-medium mt-1">
            <LocationIcon className="text-gray-400 text-sm shrink-0" />
            <span className="truncate">{location}</span>
          </div>
        </div>

        {/* Specs Grid */}
        <div className="grid grid-cols-3 gap-1 border-y border-gray-100 py-2 text-center">
          <div className="flex flex-col items-center justify-center gap-0.5 border-r border-gray-100 pr-1">
            <BiBed className="text-gray-400 text-base" />
            <span className="text-xs font-bold text-secondary">{flat.beds} Beds</span>
          </div>
          <div className="flex flex-col items-center justify-center gap-0.5 border-r border-gray-100 px-1">
            <BiBath className="text-gray-400 text-base" />
            <span className="text-xs font-bold text-secondary">{flat.baths} Baths</span>
          </div>
          <div className="flex flex-col items-center justify-center gap-0.5 pl-1">
            <BiArea className="text-gray-400 text-base" />
            <span className="text-xs font-bold text-secondary">{flat.size} sqft</span>
          </div>
        </div>

        {/* Pricing and Action Buttons */}
        <div className="flex flex-col gap-2.5">
          <div>
            <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider block">
              Total Price
            </span>
            <span className="text-base font-extrabold text-[#FF4C00]">
              {formattedPrice}
            </span>
          </div>

          <div className="flex items-center gap-2 w-full">
            <Link
              href={`/flats/${flat.id}`}
              className="flex-1 py-2 rounded-xl bg-slate-100 hover:bg-[#00062A] text-slate-800 hover:text-white font-bold text-xs flex items-center justify-center gap-1 transition no-underline"
            >
              <span>Details</span>
              <IoChevronForward className="text-sm" />
            </Link>
            <Link
              href={`/flats/${flat.id}`}
              className="flex-1 py-2 rounded-xl bg-[#FF4C00] hover:bg-[#e04300] text-white font-extrabold text-xs text-center shadow-md shadow-[#FF4C00]/20 transition no-underline"
            >
              Book Now
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
