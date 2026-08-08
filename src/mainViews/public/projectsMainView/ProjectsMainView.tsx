"use client";

import React, { useEffect, useState } from "react";
import Select, { components, ControlProps } from "react-select";
import { useDebounce } from "use-debounce";
import { PropertyCard } from "@/components/propertyCard/PropertyCard";
import PropertyCardSkeleton from "@/components/skeletons/PropertyCardSkeleton";
import {
  HiOutlineBuildingOffice2,
  HiOutlineMagnifyingGlass,
  HiOutlineFunnel,
} from "react-icons/hi2";
import { TiLocation } from "react-icons/ti";
import { FaTag } from "react-icons/fa";
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

export const ProjectsMainView = () => {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounce(search, 500);

  const [cityFilter, setCityFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const fetchProjects = async () => {
    try {
      setLoading(true);
      let url = "/properties?limit=100";
      if (debouncedSearch) url += `&search=${encodeURIComponent(debouncedSearch)}`;
      if (cityFilter) url += `&city=${encodeURIComponent(cityFilter)}`;
      if (statusFilter) url += `&status=${encodeURIComponent(statusFilter)}`;

      const res = await instance.get(url);
      if (res.data?.success) {
        setProjects(res.data.data || []);
      }
    } catch (err) {
      console.error("Failed to fetch public project directory:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [debouncedSearch, cityFilter, statusFilter]);

  const cityOptions: FilterOption[] = [
    { value: "", label: "All" },
    { value: "Dhaka", label: "Dhaka" },
    { value: "Chittagong", label: "Chittagong" },
    { value: "Sylhet", label: "Sylhet" },
    { value: "Rajshahi", label: "Rajshahi" },
  ];

  const statusOptions: FilterOption[] = [
    { value: "", label: "All" },
    { value: "Ongoing", label: "Ongoing" },
    { value: "Completed", label: "Completed" },
    { value: "Ready to Move", label: "Ready to Move" },
    { value: "Handovered", label: "Handovered" },
  ];

  return (
    <div className="min-h-screen bg-[#fafbfc] pb-16">
      {/* Hero Header Section */}
      <div className="bg-[#00062A] text-white pt-28 pb-16 md:pt-32 md:pb-20 px-4 relative overflow-hidden">
        <div className="container mx-auto text-center max-w-3xl relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 bg-[#FF4C00]/20 text-[#FF4C00] text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-wider border border-[#FF4C00]/30">
            <HiOutlineBuildingOffice2 className="w-4 h-4" />
            <span>Featured Real Estate Developments</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight text-white">
            Discover Premium Projects
          </h1>
          <p className="text-sm md:text-base text-slate-300 max-w-xl mx-auto leading-relaxed font-medium">
            Browse our signature residential and commercial building developments across key location zones.
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
              placeholder="Search by project name, area, or address..."
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

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {/* City Select */}
              <Select<FilterOption, false>
                instanceId="project-city-select"
                options={cityOptions}
                placeholder="City"
                value={cityFilter ? cityOptions.find((o) => o.value === cityFilter) : null}
                onChange={(opt) => setCityFilter(opt?.value || "")}
                styles={customSelectStyles}
                components={{ Control: CustomControl }}
                isSearchable={false}
                {...({ icon: <TiLocation className="w-4 h-4 text-rose-500" /> } as any)}
              />

              {/* Status Select */}
              <Select<FilterOption, false>
                instanceId="project-status-select"
                options={statusOptions}
                placeholder="Status"
                value={statusFilter ? statusOptions.find((o) => o.value === statusFilter) : null}
                onChange={(opt) => setStatusFilter(opt?.value || "")}
                styles={customSelectStyles}
                components={{ Control: CustomControl }}
                isSearchable={false}
                {...({ icon: <FaTag className="w-4 h-4 text-emerald-500" /> } as any)}
              />
            </div>
          </div>
        </div>

        {/* Results Info Bar */}
        <div className="flex items-center justify-between text-xs font-bold text-slate-500">
          <span>
            Showing <strong className="text-[#00062A] font-black">{projects.length}</strong> project listings
          </span>
          {(search || cityFilter || statusFilter) && (
            <button
              onClick={() => {
                setSearch("");
                setCityFilter("");
                setStatusFilter("");
              }}
              className="text-[#FF4C00] hover:underline cursor-pointer border-none bg-transparent"
            >
              Reset Filters
            </button>
          )}
        </div>

        {/* Projects Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, idx) => (
              <PropertyCardSkeleton key={idx} />
            ))}
          </div>
        ) : projects.length === 0 ? (
          <div className="bg-white p-16 rounded-2xl border border-dashed border-slate-300 text-center space-y-3">
            <HiOutlineBuildingOffice2 className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-base font-bold text-[#00062A]">No Projects Match Your Filter</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Try adjusting your search terms or clearing your location and status filters.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {projects.map((project) => (
              <PropertyCard key={project.id} project={project} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectsMainView;
