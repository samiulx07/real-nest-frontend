"use client";

import React, { useState } from "react";
import { FaqItem } from "@/shared/interface";
import { IoChevronDownOutline } from "react-icons/io5";
import Button from "../button/Button";
import { BUTTON_VARIANT_ENUM } from "@/shared/enums";

interface FaqProps {
  items: FaqItem[];
}

const Faq: React.FC<FaqProps> = ({ items }) => {
  const [openId, setOpenId] = useState<number | null>(1); // Open the first FAQ item by default

  const toggleFaq = (id: number) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section className="section bg-[#fafbfc]">
      <div className="container">
        {/* Section Title at Top */}
        <div className="text-center max-w-[760px] mx-auto mb-14">
          <h2 className="text-3xl md:text-4xl font-extrabold text-secondary tracking-tight">
            Frequently Asked Questions
          </h2>
        </div>

        {/* 2-Column Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 max-w-[1140px] mx-auto">
          
          {/* Left Column: Description, Need Help, and Contact Button */}
          <div className="lg:col-span-5 flex flex-col gap-6 text-left">
            <p className="text-sm md:text-base text-gray-500 leading-relaxed">
              Locate fast answers to common questions about unit reservation requests, regulatory RAJUK compliance checks, installment payment structures, and site survey inspections.
            </p>

            <div className="h-px bg-gray-200/60 my-2" />

            <div className="flex flex-col gap-3">
              <h3 className="text-lg font-bold text-secondary">
                Need Help?
              </h3>
              <p className="text-xs md:text-sm text-gray-400 leading-relaxed">
                Can't find the answer you are looking for? Reach out to our dedicated customer relationship desk for personalized support.
              </p>
              <Button
                variant={BUTTON_VARIANT_ENUM.PRIMARY}
                className="w-fit px-6 py-2.5 font-bold text-xs cursor-pointer rounded-xl hover:shadow-lg hover:shadow-primary/20 transition-all duration-200 mt-2"
              >
                Contact Us
              </Button>
            </div>
          </div>

          {/* Right Column: FAQ Accordions */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            {items.map((item) => {
              const isOpen = openId === item.id;
              return (
                <div
                  key={item.id}
                  onClick={() => toggleFaq(item.id)}
                  className={`bg-white rounded-2xl border transition-all duration-300 cursor-pointer overflow-hidden select-none
                    ${isOpen 
                      ? "border-primary/20 shadow-[0_8px_30px_rgba(255,76,0,0.04)]" 
                      : "border-gray-100 hover:border-gray-200 shadow-[0_4px_20px_rgba(0,0,0,0.01)]"
                    }`}
                >
                  {/* Accordion Trigger Header */}
                  <div className="flex items-center justify-between p-5 md:p-6 gap-4">
                    <h3 className={`text-sm md:text-base font-bold transition-colors duration-300 text-left
                      ${isOpen ? "text-primary" : "text-secondary"}`}
                    >
                      {item.question}
                    </h3>
                    <div className="shrink-0">
                      <IoChevronDownOutline
                        className={`text-gray-400 text-lg transition-transform duration-300
                          ${isOpen ? "rotate-180 text-primary" : ""}`}
                      />
                    </div>
                  </div>

                  {/* Smooth Sliding Content Wrapper */}
                  <div
                    className={`grid transition-[grid-template-rows] duration-300 ease-in-out
                      ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
                  >
                    <div className="overflow-hidden">
                      <div className="p-5 md:p-6 pt-0 border-t border-gray-50 text-left">
                        <p className="text-xs md:text-sm text-gray-500 leading-relaxed">
                          {item.answer}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </div>
    </section>
  );
};

export default Faq;
