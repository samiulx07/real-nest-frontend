import React from "react";
import { PropertyCard } from "../propertyCard/PropertyCard";
import PropertyCardSkeleton from "../skeletons/PropertyCardSkeleton";
import { FeaturedProject } from "@/shared/interface";

interface FeaturedProjectsProps {
  projects: FeaturedProject[];
  loading?: boolean;
}

const FeaturedProjects: React.FC<FeaturedProjectsProps> = ({ projects, loading }) => {
  return (
    <section className="section bg-white">
      <div className="container">
        {/* Section Header */}
        <div className="text-center max-w-[580px] mx-auto mb-14">
          <h2 className="text-3xl md:text-4xl font-extrabold text-secondary tracking-tight mb-3">
            Featured Projects
          </h2>
          <p className="text-sm md:text-base text-gray-500 leading-relaxed">
            Discover our premium selection of residential and commercial properties located in prime zones. Built with state-of-the-art standards and premium finishes.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {loading
            ? Array.from({ length: 4 }).map((_, idx) => (
                <PropertyCardSkeleton key={idx} />
              ))
            : projects.map((project) => (
                <PropertyCard key={project.id} project={project} />
              ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProjects;
