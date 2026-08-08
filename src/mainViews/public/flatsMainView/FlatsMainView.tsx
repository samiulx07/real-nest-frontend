"use client";

import React, { useEffect, useState } from "react";
import Select, { components, ControlProps } from "react-select";
import { useDebounce } from "use-debounce";
import { FlatCard } from "@/components/flatCard/FlatCard";
import FlatCardSkeleton from "@/components/skeletons/FlatCardSkeleton";
import {
  HiOutlineHome,
  HiOutlineMagnifyingGlass,
  HiOutlineFunnel,
} from "react-icons/hi2";
import { BsFire } from "react-icons/bs";
import { IoIosWater } from "react-icons/io";
import { GiSofa } from "react-icons/gi";
import { TiLocation } from "react-icons/ti";
import { FaTag, FaStreetView } from "react-icons/fa";
import { IoBed } from "react-icons/io5";
import instance from "@/services/baseServices";

interface FilterOption {
  value: string;
  label: string;
}

const customSelectStyles = {
  control: (base: any, state: any) => ({
    ...base,
    borderRadius: "0.75rem",
    borderColor: state.isFocused ? "#FF4C00" : "#e2e8f0",
    boxShadow: state.isFocused ? "0 0 0 1px #FF4C00" : "none",
    "&:hover": {
      borderColor: "#cbd5e1",
    },
    minHeight: "42px",
    backgroundColor: "#ffffff",
    paddingLeft: "0.25rem",
    cursor: "pointer",
    fontSize: "0.75rem",
    fontWeight: "700",
  }),
  option: (base: any, state: any) => ({
    ...base,
    fontSize: "0.75rem",
    fontWeight: "600",
    backgroundColor: state.isSelected
      ? "#FF4C00"
      : state.isFocused
      ? "#f8fafc"
      : "#ffffff",
    color: state.isSelected ? "#ffffff" : "#1e293b",
    cursor: "pointer",
    padding: "8px 12px",
  }),
  menu: (base: any) => ({
    ...base,
    borderRadius: "0.75rem",
    boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
    border: "1px solid #e2e8f0",
    overflow: "hidden",
    zIndex: 50,
  }),
  singleValue: (base: any) => ({
    ...base,
    color: "#0f172a",
    fontWeight: "700",
  }),
  placeholder: (base: any) => ({
    ...base,
    color: "#475569",
    fontWeight: "700",
  }),
  dropdownIndicator: (base: any) => ({
    ...base,
    color: "#94a3b8",
    padding: "4px 8px",
    "&:hover": {
      color: "#64748b",
    },
  }),
  indicatorSeparator: () => ({
    display: "none",
  }),
};

const CustomControl = ({ children, ...props }: ControlProps<FilterOption, false>) => {
  const icon = (props.selectProps as any).icon;
  return (
    <components.Control {...props}>
      {icon && <div className="pl-3 text-slate-400 shrink-0">{icon}</div>}
      {children}
    </components.Control>
  );
};

export const FlatsMainView = () => {
  const [flats, setFlats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounce(search, 500);

  const [statusFilter, setStatusFilter] = useState("");
  const [bedsFilter, setBedsFilter] = useState("");
  const [cityFilter, setCityFilter] = useState("");
  const [gasFilter, setGasFilter] = useState("");
  const [waterFilter, setWaterFilter] = useState("");
  const [furnishingFilter, setFurnishingFilter] = useState("");
  const [facingFilter, setFacingFilter] = useState("");

  const fetchFlats = async () => {
    try {
      setLoading(true);
      let url = "/flats?limit=100";
      if (debouncedSearch) url += `&search=${encodeURIComponent(debouncedSearch)}`;
      if (statusFilter) url += `&status=${encodeURIComponent(statusFilter)}`;
      if (bedsFilter) url += `&beds=${encodeURIComponent(bedsFilter)}`;
      if (cityFilter) url += `&city=${encodeURIComponent(cityFilter)}`;
      if (gasFilter) url += `&hasGasLine=${encodeURIComponent(gasFilter)}`;
      if (waterFilter) url += `&hasWaterSupply=${encodeURIComponent(waterFilter)}`;
      if (furnishingFilter) url += `&furnishing=${encodeURIComponent(furnishingFilter)}`;
      if (facingFilter) url += `&facing=${encodeURIComponent(facingFilter)}`;

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
  }, [
    debouncedSearch,
    statusFilter,
    bedsFilter,
    cityFilter,
    gasFilter,
    waterFilter,
    furnishingFilter,
    facingFilter,
  ]);

  const hasActiveFilters =
    search ||
    statusFilter ||
    bedsFilter ||
    cityFilter ||
    gasFilter ||
    waterFilter ||
    furnishingFilter ||
    facingFilter;

  const resetAllFilters = () => {
    setSearch("");
    setStatusFilter("");
    setBedsFilter("");
    setCityFilter("");
    setGasFilter("");
    setWaterFilter("");
    setFurnishingFilter("");
    setFacingFilter("");
  };

  // Dynamically derive unique cities from database records alongside defaults
  const uniqueCitiesFromData = Array.from(
    new Set(
      ["Dhaka", "Chittagong", "Sylhet", "Rajshahi", ...flats.map((f) => f.property?.city).filter(Boolean)]
    )
  );

  const cityOptions: FilterOption[] = [
    { value: "", label: "All" },
    ...uniqueCitiesFromData.map((c) => ({ value: c, label: c })),
  ];

  const statusOptions: FilterOption[] = [
    { value: "", label: "All" },
    { value: "AVAILABLE", label: "AVAILABLE" },
    { value: "BOOKED", label: "BOOKED" },
    { value: "SOLD", label: "SOLD" },
  ];

  const bedsOptions: FilterOption[] = [
    { value: "", label: "All" },
    { value: "1", label: "1 Bed" },
    { value: "2", label: "2 Beds" },
    { value: "3", label: "3 Beds" },
    { value: "4", label: "4 Beds" },
  ];

  const gasOptions: FilterOption[] = [
    { value: "", label: "All" },
    { value: "true", label: "Gas Line Available" },
    { value: "false", label: "No Gas Line" },
  ];

  const waterOptions: FilterOption[] = [
    { value: "", label: "All" },
    { value: "true", label: "Water Available" },
    { value: "false", label: "No Water Supply" },
  ];

  const furnishingOptions: FilterOption[] = [
    { value: "", label: "All" },
    { value: "Unfurnished", label: "Unfurnished" },
    { value: "Semi-Furnished", label: "Semi-Furnished" },
    { value: "Fully Furnished", label: "Fully Furnished" },
  ];

  const facingOptions: FilterOption[] = [
    { value: "", label: "All" },
    { value: "North", label: "North" },
    { value: "South", label: "South" },
    { value: "East", label: "East" },
    { value: "West", label: "West" },
    { value: "Corner", label: "Corner Unit" },
  ];

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
        {/* Filter Card with 2-Row Structure */}
        <div className="bg-white p-5 md:p-6 rounded-2xl shadow-xl border border-slate-200/80 space-y-5">
          {/* Row 1: Prominent Full-Width Search Bar */}
          <div className="relative w-full">
            <HiOutlineMagnifyingGlass className="w-5 h-5 text-slate-400 absolute left-4 top-3.5" />
            <input
              type="text"
              placeholder="Search by flat title, unit code (e.g. 4A), or specifications..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 text-xs font-bold focus:outline-none focus:border-[#FF4C00] shadow-xs"
            />
          </div>

          {/* Row 2: Category Filter Row using react-select */}
          <div className="space-y-2">
            <div className="flex items-center gap-1.5">
              <HiOutlineFunnel className="w-4 h-4 text-slate-400" />
              <span className="text-xs font-extrabold text-slate-700">Filter By Category:</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-3">
              {/* Status Select */}
              <Select<FilterOption, false>
                instanceId="flat-status-select"
                options={statusOptions}
                placeholder="Status"
                value={statusFilter ? statusOptions.find((o) => o.value === statusFilter) : null}
                onChange={(opt) => setStatusFilter(opt?.value || "")}
                styles={customSelectStyles}
                components={{ Control: CustomControl }}
                isSearchable={false}
                {...({ icon: <FaTag className="w-4 h-4 text-emerald-500" /> } as any)}
              />

              {/* Beds Select */}
              <Select<FilterOption, false>
                instanceId="flat-beds-select"
                options={bedsOptions}
                placeholder="Bedrooms"
                value={bedsFilter ? bedsOptions.find((o) => o.value === bedsFilter) : null}
                onChange={(opt) => setBedsFilter(opt?.value || "")}
                styles={customSelectStyles}
                components={{ Control: CustomControl }}
                isSearchable={false}
                {...({ icon: <IoBed className="w-4 h-4 text-indigo-500" /> } as any)}
              />

              {/* City Select */}
              <Select<FilterOption, false>
                instanceId="flat-city-select"
                options={cityOptions}
                placeholder="City"
                value={cityFilter ? cityOptions.find((o) => o.value === cityFilter) : null}
                onChange={(opt) => setCityFilter(opt?.value || "")}
                styles={customSelectStyles}
                components={{ Control: CustomControl }}
                isSearchable={false}
                {...({ icon: <TiLocation className="w-4 h-4 text-rose-500" /> } as any)}
              />

              {/* Line Gas Select */}
              <Select<FilterOption, false>
                instanceId="flat-gas-select"
                options={gasOptions}
                placeholder="Line Gas"
                value={gasFilter ? gasOptions.find((o) => o.value === gasFilter) : null}
                onChange={(opt) => setGasFilter(opt?.value || "")}
                styles={customSelectStyles}
                components={{ Control: CustomControl }}
                isSearchable={false}
                {...({ icon: <BsFire className="w-4 h-4 text-amber-500" /> } as any)}
              />

              {/* Water Supply Select */}
              <Select<FilterOption, false>
                instanceId="flat-water-select"
                options={waterOptions}
                placeholder="Water Supply"
                value={waterFilter ? waterOptions.find((o) => o.value === waterFilter) : null}
                onChange={(opt) => setWaterFilter(opt?.value || "")}
                styles={customSelectStyles}
                components={{ Control: CustomControl }}
                isSearchable={false}
                {...({ icon: <IoIosWater className="w-4 h-4 text-sky-500" /> } as any)}
              />

              {/* Furnishing Select */}
              <Select<FilterOption, false>
                instanceId="flat-furnishing-select"
                options={furnishingOptions}
                placeholder="Furnishing"
                value={furnishingFilter ? furnishingOptions.find((o) => o.value === furnishingFilter) : null}
                onChange={(opt) => setFurnishingFilter(opt?.value || "")}
                styles={customSelectStyles}
                components={{ Control: CustomControl }}
                isSearchable={false}
                {...({ icon: <GiSofa className="w-4 h-4 text-purple-500" /> } as any)}
              />

              {/* Facing Select */}
              <Select<FilterOption, false>
                instanceId="flat-facing-select"
                options={facingOptions}
                placeholder="Facing"
                value={facingFilter ? facingOptions.find((o) => o.value === facingFilter) : null}
                onChange={(opt) => setFacingFilter(opt?.value || "")}
                styles={customSelectStyles}
                components={{ Control: CustomControl }}
                isSearchable={false}
                {...({ icon: <FaStreetView className="w-4 h-4 text-teal-500" /> } as any)}
              />
            </div>
          </div>
        </div>

        {/* Results Info Bar */}
        <div className="flex items-center justify-between text-xs font-bold text-slate-500">
          <span>
            Showing <strong className="text-[#00062A] font-black">{flats.length}</strong> flat units
          </span>
          {hasActiveFilters && (
            <button
              onClick={resetAllFilters}
              className="text-[#FF4C00] hover:underline cursor-pointer border-none bg-transparent"
            >
              Reset All Filters
            </button>
          )}
        </div>

        {/* Flats Grid */}
        {loading ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {Array.from({ length: 6 }).map((_, idx) => (
              <FlatCardSkeleton key={idx} />
            ))}
          </div>
        ) : flats.length === 0 ? (
          <div className="bg-white p-16 rounded-2xl border border-dashed border-slate-300 text-center space-y-3">
            <HiOutlineHome className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-base font-bold text-[#00062A]">No Flat Units Found</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Try adjusting your bedroom count, status, gas line, or search query.
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
