"use client";

import React, { useEffect, useState } from "react";
import { useDebounce } from "use-debounce";
import Link from "next/link";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import { useRootContext } from "@/contexts/RootContext";
import {
  HiOutlineBuildingOffice2,
  HiOutlineMagnifyingGlass,
  HiOutlineFunnel,
  HiOutlinePlus,
  HiOutlinePencilSquare,
  HiOutlineTrash,
  HiOutlineMapPin,
  HiOutlineTag,
} from "react-icons/hi2";
import instance from "@/services/baseServices";

export const PropertiesMainView = () => {
  const { user } = useRootContext();
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounce(search, 500);
  const [cityFilter, setCityFilter] = useState("");

  const isAdminOrStaff =
    user?.role === "SUPER_ADMIN" ||
    user?.role === "ADMIN" ||
    user?.role === "STAFF";

  const fetchProperties = async () => {
    try {
      setLoading(true);
      let url = "/properties?limit=50";
      if (debouncedSearch) url += `&search=${encodeURIComponent(debouncedSearch)}`;
      if (cityFilter) url += `&city=${encodeURIComponent(cityFilter)}`;

      const res = await instance.get(url);
      if (res.data?.success) {
        setProperties(res.data.data || []);
      }
    } catch (err) {
      console.error("Failed to fetch properties", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, [debouncedSearch, cityFilter]);


  const handleDelete = async (id: string, title: string) => {
    const result = await Swal.fire({
      title: "Delete Property?",
      text: `Are you sure you want to delete "${title}"? This cannot be undone.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#e11d48",
      cancelButtonColor: "#00062A",
      confirmButtonText: "Yes, Delete Property",
      customClass: { popup: "rounded-2xl font-sans" },
    });

    if (!result.isConfirmed) return;

    try {
      const res = await instance.delete(`/properties/${id}`);
      if (res.data?.success) {
        toast.success("Property removed from directory.");
        fetchProperties();
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to delete property.");
    }
  };


  return (
    <div className="space-y-6">
      {/* Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-[#FF4C00] text-xs font-bold mb-1">
            <HiOutlineBuildingOffice2 className="w-4 h-4" />
            <span>Property Directory</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-[#00062A] tracking-tight">
            Building & Project Listings
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            View, filter, create, and manage building listings and configurations.
          </p>
        </div>

        {isAdminOrStaff && (
          <Link
            href="/dashboard/properties/create"
            className="px-4 py-2.5 rounded-xl bg-[#FF4C00] hover:bg-[#e04300] text-white text-xs font-black flex items-center justify-center gap-2 shadow-md shadow-[#FF4C00]/20 transition active:scale-98 shrink-0"
          >
            <HiOutlinePlus className="w-4 h-4 stroke-[3]" />
            <span>Add New Property</span>
          </Link>
        )}
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <HiOutlineMagnifyingGlass className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search by title, location, or area..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:border-[#FF4C00]"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <HiOutlineFunnel className="w-4 h-4 text-slate-400 shrink-0" />
          <select
            value={cityFilter}
            onChange={(e) => setCityFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 focus:outline-none focus:border-[#FF4C00] bg-white w-full sm:w-auto"
          >
            <option value="">All Cities</option>
            <option value="Dhaka">Dhaka</option>
            <option value="Chittagong">Chittagong</option>
            <option value="Sylhet">Sylhet</option>
            <option value="Rajshahi">Rajshahi</option>
          </select>
        </div>
      </div>

      {/* Property Directory Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs font-bold text-slate-400">
            Loading building directory...
          </div>
        ) : properties.length === 0 ? (
          <div className="p-12 text-center text-xs font-bold text-slate-400 space-y-2">
            <div>No properties match your filter criteria.</div>
            {isAdminOrStaff && (
              <Link
                href="/dashboard/properties/create"
                className="inline-block mt-2 text-[#FF4C00] hover:underline"
              >
                + Add your first property project
              </Link>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#00062A] text-slate-300 font-extrabold uppercase text-[10px] tracking-wider border-b border-white/10">
                <tr>
                  <th className="py-3.5 px-6">Building / Project</th>
                  <th className="py-3.5 px-4">Location</th>
                  <th className="py-3.5 px-4">Floors & Units</th>
                  <th className="py-3.5 px-4">Starting Price</th>
                  <th className="py-3.5 px-4">Status</th>
                  {isAdminOrStaff && (
                    <th className="py-3.5 px-6 text-right">Actions</th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {properties.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[#FF4C00]/10 text-[#FF4C00] font-black flex items-center justify-center shrink-0">
                          <HiOutlineBuildingOffice2 className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="font-bold text-[#00062A] text-sm">{p.title}</div>
                          <div className="text-[11px] text-slate-400 mt-0.5">
                            ID: {p.id.slice(0, 8)}...
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-4">
                      <div className="flex items-center gap-1.5 text-slate-600">
                        <HiOutlineMapPin className="w-3.5 h-3.5 text-[#FF4C00] shrink-0" />
                        <span>
                          {p.area}, {p.city}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400 truncate max-w-[180px]">
                        {p.address}
                      </div>
                    </td>

                    <td className="py-4 px-4">
                      <div className="font-bold text-[#00062A]">{p.floorLabel}</div>
                      <div className="text-[11px] text-slate-400">
                        {p.totalUnits} Units Total ({p.unitsPerFloor || "-"} / floor)
                      </div>
                    </td>

                    <td className="py-4 px-4">
                      <div className="font-bold text-[#00062A]">
                        {p.startingPrice
                          ? `৳ ${Number(p.startingPrice).toLocaleString()}`
                          : "N/A"}
                      </div>
                    </td>

                    <td className="py-4 px-4">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase bg-[#FF4C00]/10 text-[#FF4C00] border border-[#FF4C00]/20">
                        <HiOutlineTag className="w-3 h-3" />
                        <span>{p.status || "Ongoing"}</span>
                      </span>
                    </td>

                    {isAdminOrStaff && (
                      <td className="py-4 px-6 text-right space-x-2">
                        <Link
                          href={`/dashboard/properties/edit/${p.id}`}
                          className="inline-flex p-2 rounded-lg text-slate-500 hover:text-[#00062A] hover:bg-slate-100 transition cursor-pointer"
                          title="Edit Property"
                        >
                          <HiOutlinePencilSquare className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(p.id, p.title)}
                          className="p-2 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer border-none bg-transparent"
                          title="Delete Property"
                        >
                          <HiOutlineTrash className="w-4 h-4" />
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default PropertiesMainView;
