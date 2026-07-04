import React from "react";
import Image from "next/image";
import { HiOutlineLocationMarker as LocationIcon } from "react-icons/hi";
import { IoChevronForward } from "react-icons/io5";
import { BiBed, BiBath, BiArea } from "react-icons/bi";
import { FeaturedFlat } from "@/shared/interface";
import Button from "../button/Button";
import { BUTTON_VARIANT_ENUM } from "@/shared/enums";

interface FlatCardProps {
  flat: FeaturedFlat;
}

export const FlatCard: React.FC<FlatCardProps> = ({ flat }) => {
  return (
    <div className="flex flex-col sm:flex-row bg-white rounded-[20px] overflow-hidden border border-gray-100 shadow-[0_8px_30px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.06)] transition-all duration-300 group">
      {/* Image Block */}
      <div className="relative w-full sm:w-[45%] h-[200px] sm:h-auto min-h-[220px]">
        <Image
          src={flat.image}
          alt={flat.title}
          fill
          sizes="(max-width: 640px) 100vw, 30vw"
          className="object-cover transition-transform duration-500 group-hover:scale-103"
        />
      </div>

      {/* Details Block */}
      <div className="w-full sm:w-[55%] p-5 flex flex-col justify-between gap-4 text-left">
        {/* Tag, Title & Location */}
        <div>
          <span className="inline-block bg-primary/5 text-primary text-[10px] font-extrabold px-2.5 py-1 rounded-md mb-2 tracking-wide uppercase">
            {flat.tag}
          </span>
          <h3 className="text-lg font-bold text-secondary tracking-tight">
            {flat.title}
          </h3>
          <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium mt-1">
            <LocationIcon className="text-gray-400 text-sm shrink-0" />
            <span>{flat.location}</span>
          </div>
        </div>

        {/* Specs Grid */}
        <div className="grid grid-cols-3 gap-1 border-y border-gray-100 py-3 text-center">
          <div className="flex flex-col items-center justify-center gap-1 border-r border-gray-100 last:border-0">
            <BiBed className="text-gray-400 text-lg" />
            <span className="text-xs font-bold text-secondary">{flat.beds} Beds</span>
          </div>
          <div className="flex flex-col items-center justify-center gap-1 border-r border-gray-100 last:border-0">
            <BiBath className="text-gray-400 text-lg" />
            <span className="text-xs font-bold text-secondary">{flat.baths} Baths</span>
          </div>
          <div className="flex flex-col items-center justify-center gap-1">
            <BiArea className="text-gray-400 text-lg" />
            <span className="text-xs font-bold text-secondary">{flat.size}</span>
          </div>
        </div>

        {/* Pricing and Button Stack */}
        <div className="flex flex-col gap-3">
          <div className="text-left">
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">
              Starting From
            </span>
            <span className="text-lg font-extrabold text-primary">
              {flat.price}
            </span>
          </div>

          {/* Action Buttons Row */}
          <div className="flex items-center gap-3 w-full">
            <Button
              variant={BUTTON_VARIANT_ENUM.TERTIARY_PRIMARY}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 font-bold text-xs cursor-pointer group/btn whitespace-nowrap"
            >
              View Details
            </Button>
            <Button
              variant={BUTTON_VARIANT_ENUM.PRIMARY}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 font-bold text-xs cursor-pointer whitespace-nowrap"
            >
              Book Now
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
