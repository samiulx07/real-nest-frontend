import React from "react";
import Image from "next/image";
import { IoChevronForward } from "react-icons/io5";
import { HiOutlineLocationMarker as LocationIcon } from "react-icons/hi";

import { FeaturedProject } from "@/shared/interface";
import { BUTTON_VARIANT_ENUM } from "@/shared/enums";
import Button from "../button/Button";

interface PropertyCardProps {
  project: FeaturedProject;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({ project }) => {
  return (
    <div className="relative flex flex-col pb-6 group select-none">
      {/* Image Container */}
      <div className="relative h-[420px] w-full rounded-[16px] overflow-hidden shadow-md">
        <Image
          src={project.image}
          alt={project.projectName}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      {/* Details Card Content Box (Overlapping image bottom, exactly 50% upper and 50% bottom) */}
      <div className="bg-white rounded-[16px] p-4 shadow-[0_12px_40px_rgba(0,0,0,0.08)] mx-4 -mt-24 relative z-10 border border-gray-100/50 flex flex-col gap-4">
        {/* Title and Location */}
        <div className="text-left w-full">
          <h3 className="text-xl font-extrabold text-secondary tracking-tight">
            {project.projectName}
          </h3>
          <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium mt-1.5">
            <LocationIcon className="text-gray-400 text-sm shrink-0" />
            <span>{project.location}</span>
          </div>
        </div>

        {/* Separator Divider */}
        <div className="w-full h-[1px] bg-gray-100" />

        {/* Specifications Grid - Centered columns */}
        <div className="grid grid-cols-3 gap-1 w-full">
          <div className="text-center border-r border-gray-100 pr-1">
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1 block">
              Total Floor
            </span>
            <span className="text-sm font-extrabold text-secondary">
              {project.totalFloor}
            </span>
          </div>
          <div className="text-center border-r border-gray-100 px-1">
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1 block">
              Units / Floor
            </span>
            <span className="text-sm font-extrabold text-secondary">
              {project.unitsPerFloor}
            </span>
          </div>
          <div className="text-center pl-1">
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1 block">
              Flat Size
            </span>
            <span className="text-sm font-extrabold text-secondary whitespace-nowrap">
              {project.size}
            </span>
          </div>
        </div>

        <Button
          variant={BUTTON_VARIANT_ENUM.TERTIARY_PRIMARY}
          className="w-full flex items-center justify-center gap-1.5 py-2.5 font-bold text-sm cursor-pointer group/btn"
          rightIcon={
            <IoChevronForward className="text-base transition-transform duration-200 group-hover/btn:translate-x-0.5" />
          }
        >
          View Details
        </Button>
      </div>
    </div>
  );
};
