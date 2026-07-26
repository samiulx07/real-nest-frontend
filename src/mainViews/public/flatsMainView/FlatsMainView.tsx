"use client";

import React, { useEffect, useState } from "react";
import { useDebounce } from "use-debounce";
import { FlatCard } from "@/components/flatCard/FlatCard";
import { HiOutlineHome, HiOutlineMagnifyingGlass, HiOutlineFunnel } from "react-icons/hi2";
import instance from "@/services/baseServices";

export const FlatsMainView = () => {
  const [flats, setFlats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounce(search, 500);

  const [statusFilter, setStatusFilter] = useState("");
  const [bedsFilter, setBedsFilter] = useState("");
  const [cityFilter, setCityFilter] = useState("");

  const fetchFlats = async () => {
    try {
      setLoading(true);
      let url = "/flats?limit=100";
      if (debouncedSearch) url += `&search=${encodeURIComponent(debouncedSearch)}`;
      if (statusFilter) url += `&status=${encodeURIComponent(statusFilter)}`;
      if (bedsFilter) url += `&beds=${encodeURIComponent(bedsFilter)}`;
      if (cityFilter) url += `&city=${encodeURIComponent(cityFilter)}`;

      const res = await instance.get(url);
      if (res.data?.success) {
        setFlats(res.data.data || []);
      }
    } catch (err) {
      console.error("Failed to fetch public flats directory:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFlats();
  }, [debouncedSearch, statusFilter, bedsFilter, cityFilter]);

  return (
    <div className="min-h-screen bg-[#fafbfc] pb-16">
      {/* Hero Header Section */}
      <div className="bg-[#00062A] text-white pt-28 pb-16 md:pt-32 md:pb-20 px-4 relative overflow-hidden">
        <div className="container mx-auto text-center max-w-3xl relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 bg-[#FF4C00]/20 text-[#FF4C00] text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-wider border border-[#FF4C00]/30">
            <HiOutlineHome className="w-4 h-4" />
            <span>Available Flats & Units</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight text-white">
            Find Your Ideal Flat Unit
          </h1>
          <p className="text-sm md:text-base text-slate-300 max-w-xl mx-auto leading-relaxed font-medium">
            Explore ready-to-move and under-construction flat units across our top-rated residential developments.
          </p>
        </div>
      </div>

      {/* Main Content & Filters */}
      <div className="container mx-auto px-4 -mt-6 relative z-20 space-y-8">
        {/* Filter Bar Card */}
        <div className="bg-white p-5 rounded-2xl shadow-xl border border-slate-200/80 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-80">
            <HiOutlineMagnifyingGlass className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              placeholder="Search by flat title, code (e.g. 4A)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 text-xs font-bold focus:outline-none focus:border-[#FF4C00]"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <div className="flex items-center gap-2">
              <HiOutlineFunnel className="w-4 h-4 text-slate-400 shrink-0" />
              <span className="text-xs font-extrabold text-slate-700">Filters:</span>
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-3 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:border-[#FF4C00] bg-white cursor-pointer"
            >
              <option value="">All Statuses</option>
              <option value="AVAILABLE">AVAILABLE</option>
              <option value="BOOKED">BOOKED</option>
              <option value="SOLD">SOLD</option>
            </select>

            <select
              value={bedsFilter}
              onChange={(e) => setBedsFilter(e.target.value)}
              className="px-4 py-3 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:border-[#FF4C00] bg-white cursor-pointer"
            >
              <option value="">Any Bedrooms</option>
              <option value="1">1 Bed</option>
              <option value="2">2 Beds</option>
              <option value="3">3 Beds</option>
              <option value="4">4 Beds</option>
            </select>

            <select
              value={cityFilter}
              onChange={(e) => setCityFilter(e.target.value)}
              className="px-4 py-3 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:border-[#FF4C00] bg-white cursor-pointer"
            >
              <option value="">All Cities</option>
              <option value="Dhaka">Dhaka</option>
              <option value="Chittagong">Chittagong</option>
              <option value="Sylhet">Sylhet</option>
              <option value="Rajshahi">Rajshahi</option>
            </select>
          </div>
        </div>

        {/* Results Info Bar */}
        <div className="flex items-center justify-between text-xs font-bold text-slate-500">
          <span>
            Showing <strong className="text-[#00062A] font-black">{flats.length}</strong> flat units
          </span>
          {(search || statusFilter || bedsFilter || cityFilter) && (
            <button
              onClick={() => {
                setSearch("");
                setStatusFilter("");
                setBedsFilter("");
                setCityFilter("");
              }}
              className="text-[#FF4C00] hover:underline cursor-pointer border-none bg-transparent"
            >
              Reset Filters
            </button>
          )}
        </div>

        {/* Flats Grid */}
        {loading ? (
          <div className="py-20 text-center text-sm font-bold text-slate-400">
            Loading available flats inventory...
          </div>
        ) : flats.length === 0 ? (
          <div className="bg-white p-16 rounded-2xl border border-dashed border-slate-300 text-center space-y-3">
            <HiOutlineHome className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-base font-bold text-[#00062A]">No Flat Units Found</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Try adjusting your bedroom count, status, or search query.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {flats.map((flat) => (
              <FlatCard key={flat.id} flat={flat} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FlatsMainView;
