import React from "react";
import { HiShieldCheck } from "react-icons/hi";
import { Differentiator } from "@/shared/interface";
import { FaMedal, FaHandshake, FaDraftingCompass } from "react-icons/fa";

interface WhyChooseUsProps {
  items: Differentiator[];
}

const WhyChooseUs: React.FC<WhyChooseUsProps> = ({ items }) => {
  // Map identifier names from seeds to respective solid fill react-icons
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "experience":
        return <FaMedal />;
      case "trust":
        return <FaHandshake />;
      case "quality":
        return <HiShieldCheck />;
      case "design":
        return <FaDraftingCompass />;
      default:
        return <FaMedal />;
    }
  };

  return (
    <section
      className="relative w-full py-24 bg-cover bg-center overflow-hidden"
      style={{ backgroundImage: "url('/banner-2.png')" }}
    >
      <div className="absolute inset-0 bg-[#00062A]/90 backdrop-blur-[1px] z-0" />

      <div className="relative z-10 container mx-auto px-4 max-w-[1436px]">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight">
            What makes us different
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((item) => (
            <div
              key={item.id}
              className="group bg-white/5 border border-white/10 rounded-[20px] p-6 backdrop-blur-md flex flex-col items-start gap-4 transition-all duration-300 hover:bg-white/10 hover:border-primary/50 hover:shadow-[0_12px_30px_rgba(255,76,0,0.12)] hover:-translate-y-1.5 select-none"
            >
              <div className="w-14 h-14 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary text-3xl shrink-0 group-hover:scale-110 transition-transform duration-300">
                {getIcon(item.iconName)}
              </div>

              <div className="flex flex-col gap-2">
                <h3 className="text-sm font-extrabold text-white tracking-wider uppercase">
                  {item.title}
                </h3>
                <p className="text-xs text-white/70 leading-relaxed font-normal">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
