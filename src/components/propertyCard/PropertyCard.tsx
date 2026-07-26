import React from "react";
import Image from "next/image";
import Link from "next/link";
import { IoChevronForward } from "react-icons/io5";
import { HiOutlineLocationMarker as LocationIcon } from "react-icons/hi";

interface PropertyCardProps {
  project: any;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({ project }) => {
  const imageUrl =
    (Array.isArray(project.imageUrls) && project.imageUrls[0]) ||
    project.image ||
    "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80";

  const title = project.title || project.projectName || "Property Project";
  const location =
    project.address || project.location
      ? `${project.area || ""}, ${project.city || ""}`
      : "Dhaka, Bangladesh";

  const floorLabel = project.floorLabel || (project.totalFloors ? `G+${project.totalFloors}` : "-");
  const unitsPerFloor = project.unitsPerFloor ? `${project.unitsPerFloor}` : "-";
  const startingPrice = project.startingPrice
    ? `৳ ${(Number(project.startingPrice) / 10000000).toFixed(2)} Cr`
    : project.price || "Contact for Price";

  return (
    <div className="relative flex flex-col pb-6 group select-none h-full">
      {/* Image Container */}
      <div className="relative h-[320px] w-full rounded-[16px] overflow-hidden shadow-md bg-slate-100">
        <Image
          src={imageUrl}
          alt={title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {project.status && (
          <span className="absolute top-3 left-3 bg-[#00062A]/80 backdrop-blur-md text-white text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
            {project.status}
          </span>
        )}
      </div>

      {/* Details Card Content Box */}
      <div className="bg-white rounded-[16px] p-4 shadow-[0_12px_40px_rgba(0,0,0,0.08)] mx-4 -mt-24 relative z-10 border border-gray-100/50 flex flex-col justify-between gap-4 flex-1">
        {/* Title and Location */}
        <div className="text-left w-full">
          <h3 className="text-lg font-black text-secondary tracking-tight line-clamp-1">
            {title}
          </h3>
          <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium mt-1.5">
            <LocationIcon className="text-gray-400 text-sm shrink-0" />
            <span className="truncate">{location}</span>
          </div>
        </div>

        {/* Separator Divider */}
        <div className="w-full h-[1px] bg-gray-100" />

        {/* Specifications Grid */}
        <div className="grid grid-cols-3 gap-1 w-full text-center">
          <div className="border-r border-gray-100 pr-1">
            <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider mb-0.5 block">
              Floor Plan
            </span>
            <span className="text-xs font-extrabold text-secondary">
              {floorLabel}
            </span>
          </div>
          <div className="border-r border-gray-100 px-1">
            <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider mb-0.5 block">
              Units/Floor
            </span>
            <span className="text-xs font-extrabold text-secondary">
              {unitsPerFloor}
            </span>
          </div>
          <div className="pl-1">
            <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider mb-0.5 block">
              Start Price
            </span>
            <span className="text-xs font-black text-[#FF4C00] whitespace-nowrap">
              {startingPrice}
            </span>
          </div>
        </div>

        <Link
          href={`/projects/${project.id}`}
          className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-[#FF4C00] text-slate-800 hover:text-white font-bold text-xs flex items-center justify-center gap-1.5 transition duration-200 group/btn no-underline"
        >
          <span>View Details</span>
          <IoChevronForward className="text-sm transition-transform duration-200 group-hover/btn:translate-x-0.5" />
        </Link>
      </div>
    </div>
  );
};
