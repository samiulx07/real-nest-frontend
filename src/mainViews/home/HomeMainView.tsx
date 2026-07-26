"use client";

import React, { useEffect, useState } from "react";
import HomeBanner from "@/components/homeBanner/HomeBanner";
import FeaturedProjects from "@/components/featuredProjects/FeaturedProjects";
import FeaturedFlats from "@/components/featuredFlats/FeaturedFlats";
import WhyChooseUs from "@/components/whyChooseUs/WhyChooseUs";
import ProjectLocations from "@/components/projectLocations/ProjectLocations";
import Faq from "@/components/faq/Faq";
import { HOME_SEED_OBJ } from "@/shared/seeds/homeSeeds";
import instance from "@/services/baseServices";

const HomeMainView = () => {
  const [projects, setProjects] = useState<any[]>(HOME_SEED_OBJ.featuredProjects);
  const [flats, setFlats] = useState<any[]>(HOME_SEED_OBJ.featuredFlats);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const propRes = await instance.get("/properties?limit=4");
        if (propRes.data?.success && propRes.data?.data?.length > 0) {
          setProjects(propRes.data.data);
        }

        const flatRes = await instance.get("/flats?limit=4");
        if (flatRes.data?.success && flatRes.data?.data?.length > 0) {
          setFlats(flatRes.data.data);
        }
      } catch (err) {
        console.error("Failed to load homepage backend listings:", err);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <HomeBanner slides={HOME_SEED_OBJ.bannerSlides} />
      <FeaturedProjects projects={projects} />
      <FeaturedFlats flats={flats} />
      <WhyChooseUs items={HOME_SEED_OBJ.differentiators} />
      <ProjectLocations projects={HOME_SEED_OBJ.mapProjects} />
      <Faq items={HOME_SEED_OBJ.faqs} />
    </div>
  );
};

export default HomeMainView;
