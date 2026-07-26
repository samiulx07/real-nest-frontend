"use client";

import React, { useEffect, useState } from "react";
import { useDebounce } from "use-debounce";
import Link from "next/link";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import { useRootContext } from "@/contexts/RootContext";



import {
  HiOutlineHome,
  HiOutlineMagnifyingGlass,
  HiOutlineFunnel,
  HiOutlinePlus,
  HiOutlinePencilSquare,
  HiOutlineTrash,
  HiOutlineBuildingOffice2,
} from "react-icons/hi2";
import instance from "@/services/baseServices";

export const FlatsMainView = () => {
  const { user } = useRootContext();
  const [flats, setFlats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounce(search, 500);
  const [statusFilter, setStatusFilter] = useState("");
  const [bedsFilter, setBedsFilter] = useState("");

  const isAdminOrStaff =
    user?.role === "SUPER_ADMIN" ||
    user?.role === "ADMIN" ||
    user?.role === "STAFF";

  const fetchFlats = async () => {
    try {
      setLoading(true);
      let url = "/flats?limit=100";
      if (debouncedSearch) url += `&search=${encodeURIComponent(debouncedSearch)}`;
      if (statusFilter) url += `&status=${encodeURIComponent(statusFilter)}`;
      if (bedsFilter) url += `&beds=${encodeURIComponent(bedsFilter)}`;

      const res = await instance.get(url);
      if (res.data?.success) {
        setFlats(res.data.data || []);
      }
    } catch (err) {
      console.error("Failed to fetch flats inventory", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFlats();
  }, [debouncedSearch, statusFilter, bedsFilter]);

  const handleDelete = async (id: string, title: string) => {
    const result = await Swal.fire({
      title: "Delete Flat Unit?",
      text: `Are you sure you want to delete flat "${title}"?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#e11d48",
      cancelButtonColor: "#00062A",
      confirmButtonText: "Yes, Delete Flat",
      customClass: { popup: "rounded-2xl font-sans" },
    });

    if (!result.isConfirmed) return;

    try {
      const res = await instance.delete(`/flats/${id}`);
      if (res.data?.success) {
        toast.success("Flat unit removed from inventory.");
        fetchFlats();
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to delete flat unit.");
    }
  };


  const getStatusBadge = (status: string) => {
    switch (status) {
      case "AVAILABLE":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase bg-emerald-50 text-emerald-700 border border-emerald-200">
            Available
          </span>
        );
      case "BOOKED":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase bg-amber-50 text-amber-700 border border-amber-200">
            Booked
          </span>
        );
      case "SOLD":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase bg-rose-50 text-rose-700 border border-rose-200">
            Sold
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase bg-slate-100 text-slate-700">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-[#FF4C00] text-xs font-bold mb-1">
            <HiOutlineHome className="w-4 h-4" />
            <span>Flats & Units Inventory</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-[#00062A] tracking-tight">
            Flat Units Directory
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Browse, filter, and manage individual property flat units across all building floors.
          </p>
        </div>

        {isAdminOrStaff && (
          <Link
            href="/dashboard/flats/create"
            className="px-4 py-2.5 rounded-xl bg-[#00062A] hover:bg-[#00062A]/90 text-white text-xs font-black flex items-center justify-center gap-2 shadow-md shadow-[#00062A]/10 transition active:scale-98 shrink-0"
          >
            <HiOutlinePlus className="w-4 h-4 stroke-[3]" />
            <span>Add New Flat</span>
          </Link>
        )}
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <HiOutlineMagnifyingGlass className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search by flat title or code (e.g. 4A)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:border-[#00062A]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <HiOutlineFunnel className="w-4 h-4 text-slate-400 shrink-0" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 focus:outline-none focus:border-[#00062A] bg-white flex-1 sm:flex-none"
          >
            <option value="">All Statuses</option>
            <option value="AVAILABLE">AVAILABLE</option>
            <option value="BOOKED">BOOKED</option>
            <option value="SOLD">SOLD</option>
          </select>

          <select
            value={bedsFilter}
            onChange={(e) => setBedsFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 focus:outline-none focus:border-[#00062A] bg-white flex-1 sm:flex-none"
          >
            <option value="">Any Bedrooms</option>
            <option value="1">1 Bed</option>
            <option value="2">2 Beds</option>
            <option value="3">3 Beds</option>
            <option value="4">4 Beds</option>
          </select>
        </div>
      </div>

      {/* Flats Inventory Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs font-bold text-slate-400">
            Loading flats inventory...
          </div>
        ) : flats.length === 0 ? (
          <div className="p-12 text-center text-xs font-bold text-slate-400 space-y-2">
            <div>No flats found matching your query.</div>
            {isAdminOrStaff && (
              <Link
                href="/dashboard/flats/create"
                className="inline-block mt-2 text-[#FF4C00] hover:underline"
              >
                + Register a new flat unit
              </Link>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#00062A] text-slate-300 font-extrabold uppercase text-[10px] tracking-wider border-b border-white/10">
                <tr>
                  <th className="py-3.5 px-6">Flat Unit</th>
                  <th className="py-3.5 px-4">Assigned Building</th>
                  <th className="py-3.5 px-4">Specs (Beds/Baths)</th>
                  <th className="py-3.5 px-4">Size (Sqft)</th>
                  <th className="py-3.5 px-4">Price (BDT)</th>
                  <th className="py-3.5 px-4">Status</th>
                  {isAdminOrStaff && (
                    <th className="py-3.5 px-6 text-right">Actions</th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {flats.map((f) => (
                  <tr key={f.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[#00062A]/10 text-[#00062A] font-extrabold flex items-center justify-center shrink-0">
                          {f.flatNumber}
                        </div>
                        <div>
                          <div className="font-bold text-[#00062A] text-sm">{f.title}</div>
                          <div className="text-[11px] text-slate-400 mt-0.5">
                            Floor {f.floorNumber}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-4">
                      <div className="flex items-center gap-1.5 font-bold text-[#00062A]">
                        <HiOutlineBuildingOffice2 className="w-3.5 h-3.5 text-[#FF4C00] shrink-0" />
                        <span>{f.property?.title || "Assigned Building"}</span>
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {f.property?.area}, {f.property?.city}
                      </div>
                    </td>

                    <td className="py-4 px-4">
                      <div className="font-bold text-[#00062A]">
                        {f.beds} Beds • {f.baths} Baths
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {f.kitchens} Kitchen • {f.balconies} Balconies
                      </div>
                    </td>

                    <td className="py-4 px-4 font-bold text-[#00062A]">
                      {f.size} sqft
                    </td>

                    <td className="py-4 px-4">
                      <div className="font-extrabold text-[#00062A] text-sm">
                        ৳ {Number(f.price).toLocaleString()}
                      </div>
                    </td>

                    <td className="py-4 px-4">{getStatusBadge(f.status)}</td>

                    {isAdminOrStaff && (
                      <td className="py-4 px-6 text-right space-x-2">
                        <Link
                          href={`/dashboard/flats/edit/${f.id}`}
                          className="inline-flex p-2 rounded-lg text-slate-500 hover:text-[#00062A] hover:bg-slate-100 transition cursor-pointer"
                          title="Edit Flat"
                        >
                          <HiOutlinePencilSquare className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(f.id, f.title)}
                          className="p-2 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer border-none bg-transparent"
                          title="Delete Flat"
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

export default FlatsMainView;
