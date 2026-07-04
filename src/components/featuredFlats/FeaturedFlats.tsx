import React from "react";
import { FlatCard } from "../flatCard/FlatCard";
import { FeaturedFlat } from "@/shared/interface";
import { MdOutlineStars } from "react-icons/md";
import { IoChevronForward } from "react-icons/io5";
import Button from "../button/Button";
import { BUTTON_VARIANT_ENUM } from "@/shared/enums";

interface FeaturedFlatsProps {
  flats: FeaturedFlat[];
}

const FeaturedFlats: React.FC<FeaturedFlatsProps> = ({ flats }) => {
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
          {flats.map((flat) => (
            <FlatCard key={flat.id} flat={flat} />
          ))}
        </div>

        {/* Center Bottom CTA */}
        <div className="flex justify-center">
          <Button
            variant={BUTTON_VARIANT_ENUM.PRIMARY}
            className="flex items-center justify-center gap-1.5 px-8 py-3.5 font-bold text-sm cursor-pointer hover:shadow-lg hover:shadow-primary/20 active:scale-98 transition duration-200"
            rightIcon={<IoChevronForward className="text-base" />}
          >
            View All Flats
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedFlats;
