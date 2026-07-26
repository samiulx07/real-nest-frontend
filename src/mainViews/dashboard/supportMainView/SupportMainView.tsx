"use client";

import React from "react";
import { HiOutlineQuestionMarkCircle, HiOutlineChatBubbleLeftRight, HiOutlinePhone } from "react-icons/hi2";

export const SupportMainView = () => {
  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
        <div className="flex items-center gap-2 text-[#FF4C00] text-xs font-bold mb-1">
          <HiOutlineQuestionMarkCircle className="w-4 h-4" />
          <span>Customer Help Desk</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-black text-[#00062A] tracking-tight">
          Help & Support Center
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Get in touch with our real estate customer support team or open a support ticket.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-3">
          <div className="w-12 h-12 rounded-xl bg-[#FF4C00]/10 text-[#FF4C00] flex items-center justify-center font-bold">
            <HiOutlineChatBubbleLeftRight className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-[#00062A]">Live Support Chat</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Our property advisors are online 24/7 to assist you with flat bookings, pricing inquiries, and property visits.
          </p>
          <button className="px-4 py-2.5 rounded-xl bg-[#FF4C00] text-white text-xs font-bold hover:bg-[#e04300] transition cursor-pointer border-none">
            Start Live Chat
          </button>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-3">
          <div className="w-12 h-12 rounded-xl bg-[#00062A]/10 text-[#00062A] flex items-center justify-center font-bold">
            <HiOutlinePhone className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-[#00062A]">Call Center Hotline</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Reach our customer helpline directly at +880 1700-000000 for emergency assistance or documentation guidance.
          </p>
          <a
            href="tel:+8801700000000"
            className="inline-flex px-4 py-2.5 rounded-xl bg-[#00062A] text-white text-xs font-bold hover:bg-[#00062A]/90 transition no-underline"
          >
            Call Customer Support
          </a>
        </div>
      </div>
    </div>
  );
};

export default SupportMainView;
