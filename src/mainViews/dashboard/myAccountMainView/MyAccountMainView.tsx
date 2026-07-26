"use client";

import React, { useState } from "react";
import { toast } from "react-toastify";
import { useRootContext } from "@/contexts/RootContext";
import {
  HiOutlineUser,
  HiOutlineEnvelope,
  HiOutlinePhone,
  HiOutlineShieldCheck,
} from "react-icons/hi2";
import instance from "@/services/baseServices";

export const MyAccountMainView = () => {
  const { user, setUser } = useRootContext();
  const [fullName, setFullName] = useState(user?.fullName || "");
  const [contactNo, setContactNo] = useState((user as any)?.contactNo || "");

  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      const res = await instance.patch("/users/me", {
        fullName,
        contactNo,
      });

      if (res.data?.success) {
        toast.success("Profile updated successfully!");
        if (setUser && res.data?.data) {
          setUser(res.data.data);
        }
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };


  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[#FF4C00] text-xs font-bold mb-1">
            <HiOutlineUser className="w-4 h-4" />
            <span>Account Settings</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-[#00062A] tracking-tight">
            My Profile & Security
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Manage your personal profile details, contact information, and role credentials.
          </p>
        </div>
      </div>



      {/* Main Form Box */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        {/* User Card Header */}
        <div className="bg-[#00062A] p-6 text-white flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-[#FF4C00]/20 border-2 border-[#FF4C00]/40 text-[#FF4C00] font-black text-2xl flex items-center justify-center shrink-0">
            {user?.fullName?.charAt(0).toUpperCase() || "U"}
          </div>
          <div>
            <h3 className="text-lg font-black tracking-tight">{user?.fullName || "User Profile"}</h3>
            <p className="text-xs text-slate-300 mt-0.5">{user?.email}</p>
          </div>
        </div>

        {/* Profile Settings Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block mb-1">
                Full Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold focus:outline-none focus:border-[#FF4C00]"
                  required
                />
                <HiOutlineUser className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block mb-1">
                Email Address (Read-only)
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={user?.email || ""}
                  disabled
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-400 bg-slate-50 cursor-not-allowed"
                />
                <HiOutlineEnvelope className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block mb-1">
                Contact Phone Number
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="+880 1700-000000"
                  value={contactNo}
                  onChange={(e) => setContactNo(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold focus:outline-none focus:border-[#FF4C00]"
                />
                <HiOutlinePhone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-slate-100">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 rounded-xl bg-[#FF4C00] hover:bg-[#e04300] text-white text-xs font-extrabold shadow-md shadow-[#FF4C00]/20 transition active:scale-98 disabled:opacity-50 cursor-pointer border-none"
            >
              {saving ? "Saving..." : "Save Profile Updates"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MyAccountMainView;
