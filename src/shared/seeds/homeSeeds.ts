export interface BannerSlide {
  id: number;
  image: string;
  title: string;
  subtitle: string;
  projectName: string;
  location: string;
  price: string;
  totalFloor: string;
  units: string;
  parking: string;
  gym: string;
}

export interface FeaturedProject {
  id: number;
  image: string;
  projectName: string;
  location: string;
  totalFloor: string;
  unitsPerFloor: string;
  size: string;
}

export interface Differentiator {
  id: number;
  title: string;
  description: string;
  iconName: string;
}

export const HOME_SEED_OBJ = {
  bannerSlides: [
    {
      id: 1,
      image: "/banner-6.png",
      title: "Book Your\nDream Apartment\nin Trusted Projects",
      subtitle:
        "Modern living spaces in prime locations.\nDesigned for comfort, built for life.",
      projectName: "Urban Heights",
      location: "Gulshan-2, Dhaka",
      price: "৳ 1,85,00,000",
      totalFloor: "G+10",
      units: "2",
      parking: "Yes",
      gym: "Yes",
    },
    {
      id: 2,
      image: "/banner-5.png",
      title: "Luxury Living\nRedefined for\nModern Families",
      subtitle:
        "Spacious apartments with world-class amenities.\nYour perfect home awaits.",
      projectName: "Elegance Tower",
      location: "Dhanmondi, Dhaka",
      price: "৳ 2,45,00,000",
      totalFloor: "G+12",
      units: "2",
      parking: "Yes",
      gym: "Yes",
    },
    {
      id: 3,
      image: "/banner-3.png",
      title: "Invest in\nPremium Real Estate\nwith Confidence",
      subtitle:
        "Transparent dealings and trusted developers.\nSecure your future today.",
      projectName: "Prestige Manor",
      location: "Banani, Dhaka",
      price: "৳ 3,10,00,000",
      totalFloor: "G+14",
      units: "2",
      parking: "Yes",
      gym: "Yes",
    },
    {
      id: 4,
      image: "/banner-7.png",
      title: "Find Your\nIdeal Home in\nPrime Locations",
      subtitle:
        "Hand-picked properties in the best neighborhoods.\nQuality you can trust.",
      projectName: "Serene Oasis",
      location: "Uttara, Dhaka",
      price: "৳ 1,50,00,000",
      totalFloor: "G+9",
      units: "2",
      parking: "Yes",
      gym: "Yes",
    },
  ] as BannerSlide[],

  featuredProjects: [
    {
      id: 1,
      image: "/building-01.png",
      projectName: "Urban Heights",
      location: "Gulshan-2, Dhaka",
      totalFloor: "G+10",
      unitsPerFloor: "2",
      size: "1,650 Sft",
    },
    {
      id: 2,
      image: "/building-02.png",
      projectName: "Elegance Tower",
      location: "Dhanmondi, Dhaka",
      totalFloor: "G+12",
      unitsPerFloor: "2",
      size: "1,850 Sft",
    },
    {
      id: 3,
      image: "/building-03.png",
      projectName: "Prestige Manor",
      location: "Banani, Dhaka",
      totalFloor: "G+14",
      unitsPerFloor: "2",
      size: "2,100 Sft",
    },
    {
      id: 4,
      image: "/building-04.png",
      projectName: "Serene Oasis",
      location: "Uttara, Dhaka",
      totalFloor: "G+9",
      unitsPerFloor: "2",
      size: "1,450 Sft",
    },
  ] as FeaturedProject[],

  differentiators: [
    {
      id: 1,
      title: "EXPERIENCE",
      description: "With more than 50 years of expertise in construction and real estate, we bring proven knowledge and reliability to every project.",
      iconName: "experience",
    },
    {
      id: 3,
      title: "TRUST",
      description: "We have successfully delivered over 10,000 units across more than 1,200 projects, earning the confidence of countless customers.",
      iconName: "trust",
    },
    {
      id: 4,
      title: "QUALITY",
      description: "We maintain strict standards in every stage of development, ensuring lasting quality, safety, and refined finishing.",
      iconName: "quality",
    },
    {
      id: 5,
      title: "DESIGN",
      description: "We believe great design is not only about appearance, but also comfort, functionality, and long-term value.",
      iconName: "design",
    },
  ] as Differentiator[],
};
