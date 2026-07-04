"use client";

import Image from "next/image";
import classnames from "classnames";
import { FiTarget } from "react-icons/fi";
import useEmblaCarousel from "embla-carousel-react";
import { HiOutlineLocationMarker } from "react-icons/hi";
import { useCallback, useEffect, useState } from "react";
import { BsBuildings, BsShieldCheck } from "react-icons/bs";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";
import { MdLayers, MdOutlineGridOn, MdOutlineLocalParking, MdOutlineFitnessCenter,} from "react-icons/md";
import styles from "./homeBanner.module.css";

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

interface HomeBannerProps {
  slides: BannerSlide[];
}

const HomeBanner = ({ slides }: HomeBannerProps) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!emblaApi) return;

    setSelectedIndex(emblaApi.selectedScrollSnap());

    const autoplayDelay = 5000; // 5 seconds
    const intervalTime = 100; // tick every 100ms
    const steps = autoplayDelay / intervalTime;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep += 1;
      const currentProgress = (currentStep / steps) * 100;
      setProgress(Math.min(currentProgress, 100));

      if (currentStep >= steps) {
        emblaApi.scrollNext();
        currentStep = 0;
        setProgress(0);
      }
    }, intervalTime);

    const handleSelect = () => {
      setSelectedIndex(emblaApi.selectedScrollSnap());
      currentStep = 0;
      setProgress(0);
    };

    emblaApi.on("select", handleSelect);

    return () => {
      clearInterval(timer);
      emblaApi.off("select", handleSelect);
    };
  }, [emblaApi]);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);
  const scrollTo = useCallback(
    (index: number) => emblaApi?.scrollTo(index),
    [emblaApi]
  );

  const valueProps = [
    { icon: <HiOutlineLocationMarker />, label: "Prime Locations" },
    { icon: <BsBuildings />, label: "Quality Construction" },
    { icon: <BsShieldCheck />, label: "Secure & Transparent" },
  ];

  const activeSlide = slides[selectedIndex];

  return (
    <div className="relative w-full h-[78vh] min-h-[500px] max-h-[680px] overflow-hidden max-lg:h-[65vh] max-lg:min-h-[440px] max-sm:h-[60vh] max-sm:min-h-[380px]">
      {/* ── Embla Carousel Viewport ── */}
      <div className="absolute inset-0 overflow-hidden" ref={emblaRef}>
        <div className="flex h-full backface-hidden touch-pan-y">
          {slides.map((slide) => (
            <div
              key={slide.id}
              className="relative flex-[0_0_100%] min-w-0 h-full"
            >
              <Image
                src={slide.image}
                alt={slide.title.replace(/\n/g, " ")}
                fill
                priority
                className="object-cover object-center"
              />
              {/* Gradient overlay */}
              <div className={styles.slideOverlay} />
            </div>
          ))}
        </div>
      </div>

      {/* ── Content Layer ── */}
      <div className="absolute inset-0 z-2 flex flex-col pt-32 pb-10 pointer-events-none">
        <div className="container flex-1 flex flex-col justify-between pointer-events-auto h-full">
          
          {/* Main content - 2 Column Grid */}
          <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center max-lg:pt-4">
            
            {/* Left Column: Hero Text & Buttons */}
            <div className="flex flex-col justify-center">
              {/* Hero text */}
              <h1
                key={`title-${selectedIndex}`}
                className={classnames(
                  "text-white font-extrabold leading-[1.15] tracking-tight whitespace-pre-line mb-5",
                  "text-[clamp(2rem,4.5vw,3.4rem)]",
                  styles.animateTitle
                )}
              >
                {activeSlide?.title}
              </h1>

              <p
                key={`sub-${selectedIndex}`}
                className={classnames(
                  "text-white/70 leading-relaxed whitespace-pre-line mb-8 max-w-[440px]",
                  "text-[clamp(0.9rem,1.3vw,1.1rem)]",
                  styles.animateSubtitle
                )}
              >
                {activeSlide?.subtitle}
              </p>

              {/* CTA buttons */}
              <div
                key={`cta-${selectedIndex}`}
                className={classnames(
                  "flex items-center gap-3.5 mb-8 pointer-events-auto flex-wrap",
                  styles.animateCta
                )}
              >
                <button
                  className={classnames(
                    "inline-flex items-center gap-2 px-7 py-3.5 text-[0.9rem] font-bold text-white bg-primary border-none rounded-lg cursor-pointer",
                    "transition-all duration-250 hover:bg-[#e04400] hover:-translate-y-0.5 active:translate-y-0",
                    "max-sm:px-5 max-sm:py-3 max-sm:text-[0.82rem]",
                    styles.ctaPrimary
                  )}
                >
                  Explore Projects
                </button>
                <button
                  className={classnames(
                    "inline-flex items-center gap-2 px-6 py-3 text-[0.9rem] font-bold text-secondary bg-white border-none rounded-lg cursor-pointer",
                    "transition-all duration-200 hover:bg-white/90 hover:-translate-y-0.5 active:translate-y-0 hover:shadow-lg",
                    "max-sm:px-5 max-sm:py-2.5 max-sm:text-[0.82rem]"
                  )}
                >
                  <FiTarget className="text-base" />
                  How It Works
                </button>
              </div>

              {/* Value props - placed at the bottom of the buttons */}
              <div className="flex items-center gap-7 flex-wrap max-sm:gap-4 mt-2">
                {valueProps.map((prop) => (
                  <div
                    key={prop.label}
                    className="flex items-center gap-2 text-[0.82rem] font-medium text-white/75 whitespace-nowrap max-sm:text-[0.74rem]"
                  >
                    <span className="flex items-center justify-center text-primary text-[1.05rem]">
                      {prop.icon}
                    </span>
                    {prop.label}
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column: Project Details Card */}
            <div 
              key={`card-${selectedIndex}`}
              className={classnames(
                "hidden md:flex justify-center lg:justify-end select-none self-end pb-8 lg:pb-12",
                styles.animateCard
              )}
            >
              {activeSlide && (
                <div className="bg-white rounded-2xl p-6 shadow-2xl flex gap-6 text-black border border-gray-100 max-w-[420px] w-full items-center">
                  
                  {/* Left Column of Card */}
                  <div className="flex-1 flex flex-col justify-center">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
                      Starts from
                    </span>
                    <span className="text-2xl font-black text-primary leading-none mb-3">
                      {activeSlide.price}
                    </span>
                    <div className="flex items-center gap-1.5 text-xs text-gray-500 font-semibold mb-1">
                      <HiOutlineLocationMarker className="text-gray-400 text-sm" />
                      <span>{activeSlide.location}</span>
                    </div>
                    <h3 className="text-lg font-extrabold text-secondary leading-tight">
                      {activeSlide.projectName}
                    </h3>
                  </div>

                  {/* Vertical Divider */}
                  <div className="w-[1.5px] bg-gray-100 self-stretch" />

                  {/* Right Column of Card */}
                  <div className="flex flex-col gap-2.5 justify-center pl-2 shrink-0">
                    <div className="flex items-center gap-2 text-xs font-bold text-gray-600">
                      <MdLayers className="text-gray-400 text-sm" />
                      <span>Total Floor: {activeSlide.totalFloor}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs font-bold text-gray-600">
                      <MdOutlineGridOn className="text-gray-400 text-sm" />
                      <span>Units: {activeSlide.units}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs font-bold text-gray-600">
                      <MdOutlineLocalParking className="text-gray-400 text-sm" />
                      <span>Parking: {activeSlide.parking}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs font-bold text-gray-600">
                      <MdOutlineFitnessCenter className="text-gray-400 text-sm" />
                      <span>GYM: {activeSlide.gym}</span>
                    </div>
                  </div>

                </div>
              )}
            </div>

          </div>

          {/* Bottom Bar - carousel thumbnails & navigation buttons */}
          <div className="flex justify-end items-center mt-auto pointer-events-auto gap-6 max-lg:flex-col max-lg:items-start max-lg:gap-5">
            <div className="flex items-center gap-3 shrink-0 max-lg:self-start">
              <div className="flex gap-2">
                {slides.map((slide, index) => {
                  const isActive = selectedIndex === index;
                  return (
                    <button
                      key={slide.id}
                      onClick={() => scrollTo(index)}
                      className={classnames(
                        "w-[72px] h-[52px] rounded-lg cursor-pointer border-2 border-white shrink-0 relative",
                        "transition-all duration-300 max-lg:w-[60px] max-lg:h-[44px] max-sm:w-[50px] max-sm:h-[38px] max-sm:rounded-md",
                        isActive
                          ? "opacity-100 z-20"
                          : "opacity-70 hover:opacity-100 z-10"
                      )}
                    >
                      <Image
                        src={slide.image}
                        alt={`Slide ${index + 1}`}
                        width={72}
                        height={52}
                        className="w-full h-full object-cover rounded-[6px] max-sm:rounded-[4px]"
                      />
                      {isActive && (
                        <svg
                          className="absolute -inset-[2px] w-[calc(100%+4px)] h-[calc(100%+4px)] pointer-events-none z-30"
                          viewBox="0 0 100 100"
                          preserveAspectRatio="none"
                        >
                          <rect
                            x="2"
                            y="2"
                            width="96"
                            height="96"
                            rx="8"
                            ry="8"
                            fill="none"
                            stroke="var(--primary)"
                            strokeWidth="4"
                            pathLength="100"
                            strokeDasharray="100"
                            strokeDashoffset={100 - progress}
                            style={{
                              transition: "stroke-dashoffset 100ms linear",
                            }}
                          />
                        </svg>
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="flex gap-1.5">
                <button
                  onClick={scrollPrev}
                  aria-label="Previous slide"
                  className={classnames(
                    "w-[38px] h-[38px] flex items-center justify-center",
                    "border-[1.5px] border-white/40 rounded-lg text-white cursor-pointer text-base",
                    "transition-all duration-250 max-sm:w-[34px] max-sm:h-[34px]",
                    styles.arrowBtn
                  )}
                >
                  <IoChevronBack />
                </button>
                <button
                  onClick={scrollNext}
                  aria-label="Next slide"
                  className={classnames(
                    "w-[38px] h-[38px] flex items-center justify-center",
                    "border-[1.5px] border-white/25 rounded-lg text-white cursor-pointer text-base",
                    "transition-all duration-250 max-sm:w-[34px] max-sm:h-[34px]",
                    styles.arrowBtn
                  )}
                >
                  <IoChevronForward />
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default HomeBanner;