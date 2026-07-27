import React from "react";
import Link from "next/link";
import { FlatCard } from "../flatCard/FlatCard";
import FlatCardSkeleton from "../skeletons/FlatCardSkeleton";

import { FeaturedFlat } from "@/shared/interface";
import { IoChevronForward } from "react-icons/io5";

interface FeaturedFlatsProps {
  flats: FeaturedFlat[];
  loading?: boolean;
}

const FeaturedFlats: React.FC<FeaturedFlatsProps> = ({ flats, loading }) => {
  return (
    <section className="section bg-[#fafbfc]">
      <div className="container">
        {/* Section Header */}
        <div className="text-center max-w-[620px] mx-auto mb-14 flex flex-col items-center gap-2">
          {/* Heading and Description */}
          <h2 className="text-3xl md:text-4xl font-extrabold text-secondary tracking-tight">
            Explore Our Featured Flats
          </h2>
          <p className="text-sm md:text-base text-gray-500 leading-relaxed mt-1">
            Handpicked flats that combine modern design, smart layouts, and premium amenities for a better living experience.
          </p>
        </div>

        {/* 2-Column responsive grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
          {loading
            ? Array.from({ length: 4 }).map((_, idx) => (
                <FlatCardSkeleton key={idx} />
              ))
            : flats.map((flat) => (
                <FlatCard key={flat.id} flat={flat} />
              ))}
        </div>

        {/* Center Bottom CTA */}
        <div className="flex justify-center">
          <Link
            href="/flats"
            className="flex items-center justify-center gap-1.5 px-8 py-3.5 font-bold text-sm bg-[#00062A] text-white rounded-xl hover:bg-[#FF4C00] shadow-md transition duration-200 no-underline"
          >
            <span>View All Flats</span>
            <IoChevronForward className="text-base" />
          </Link>
        </div>

      </div>
    </section>
  );
};

export default FeaturedFlats;
