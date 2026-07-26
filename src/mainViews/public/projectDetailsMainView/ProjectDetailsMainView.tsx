"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FlatCard } from "@/components/flatCard/FlatCard";
import { HiOutlineLocationMarker as LocationIcon } from "react-icons/hi";
import {
  HiOutlineArrowLeft,
  HiOutlineBuildingOffice2,
  HiOutlineTag,
  HiOutlineBanknotes,
  HiOutlineGlobeAlt,
  HiOutlineCheckBadge,
  HiOutlineSparkles,
  HiOutlinePhone,
  HiOutlineEnvelope,
} from "react-icons/hi2";
import instance from "@/services/baseServices";

interface ProjectDetailsMainViewProps {
  projectId: string;
}

export const ProjectDetailsMainView: React.FC<ProjectDetailsMainViewProps> = ({
  projectId,
}) => {
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState<string>("");

  useEffect(() => {
    const fetchProjectDetails = async () => {
      try {
        setLoading(true);
        const res = await instance.get(`/properties/${projectId}`);
        if (res.data?.success && res.data?.data) {
          const data = res.data.data;
          setProject(data);
          const firstImg =
            (Array.isArray(data.imageUrls) && data.imageUrls[0]) ||
            "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80";
          setActiveImage(firstImg);
        }
      } catch (err) {
        console.error("Failed to fetch project details:", err);
      } finally {
        setLoading(false);
      }
    };

    if (projectId) {
      fetchProjectDetails();
    }
  }, [projectId]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-sm font-bold text-slate-400">
        Loading project details...
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4 text-center">
        <h2 className="text-xl font-bold text-[#00062A]">Project Not Found</h2>
        <Link
          href="/projects"
          className="px-6 py-2.5 rounded-xl bg-[#FF4C00] text-white text-xs font-bold no-underline"
        >
          Back to Projects Directory
        </Link>
      </div>
    );
  }

  const imagesList =
    Array.isArray(project.imageUrls) && project.imageUrls.length > 0
      ? project.imageUrls
      : ["https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80"];

  return (
    <div className="min-h-screen bg-[#fafbfc] pb-16">
      {/* Header Banner */}
      <div className="bg-[#00062A] text-white pt-28 pb-16 md:pt-32 md:pb-20 px-4">

        <div className="container mx-auto max-w-6xl space-y-3">
          <Link
            href="/projects"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-300 hover:text-[#FF4C00] transition no-underline"
          >
            <HiOutlineArrowLeft className="w-4 h-4" />
            <span>Back to All Projects</span>
          </Link>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-2">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-[#FF4C00] text-white text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
                  {project.status || "Ongoing"}
                </span>
                <span className="text-xs font-bold text-slate-300">
                  {project.city || "Dhaka"}
                </span>
              </div>
              <h1 className="text-2xl md:text-4xl font-black text-white tracking-tight">
                {project.title}
              </h1>
              <div className="flex items-center gap-1.5 text-xs text-slate-300 mt-2 font-medium">
                <LocationIcon className="text-[#FF4C00] text-base shrink-0" />
                <span>
                  {project.address}, {project.area}, {project.city}
                </span>
              </div>
            </div>

            <div className="text-left md:text-right bg-white/5 p-4 rounded-2xl border border-white/10 shrink-0">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                Starting Price
              </span>
              <span className="text-2xl font-black text-[#FF4C00]">
                {project.startingPrice
                  ? `৳ ${Number(project.startingPrice).toLocaleString()}`
                  : "Contact Sales"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="container mx-auto max-w-6xl px-4 -mt-8 relative z-10 space-y-8">
        {/* Gallery & Quick Specs Card */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Gallery Block */}
          <div className="lg:col-span-2 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm space-y-3">
            <div className="relative h-[380px] sm:h-[450px] w-full rounded-xl overflow-hidden bg-slate-100">
              <Image
                src={activeImage}
                alt={project.title}
                fill
                className="object-cover transition-all duration-300"
              />
            </div>

            {imagesList.length > 1 && (
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {imagesList.map((img: string, idx: number) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(img)}
                    className={`relative w-20 h-16 rounded-lg overflow-hidden shrink-0 border-2 transition ${
                      activeImage === img ? "border-[#FF4C00]" : "border-transparent opacity-70"
                    }`}
                  >
                    <Image src={img} alt="Thumbnail" fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Quick Info & Sales Box */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
              <h3 className="text-sm font-black text-[#00062A] uppercase tracking-wider pb-2 border-b border-slate-100 flex items-center gap-2">
                <HiOutlineBuildingOffice2 className="w-5 h-5 text-[#FF4C00]" />
                <span>Project At A Glance</span>
              </h3>

              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between py-1.5 border-b border-slate-50">
                  <span className="text-slate-500 font-bold">Floor Level / Format</span>
                  <span className="font-extrabold text-[#00062A]">{project.floorLabel || "G+9"}</span>
                </div>
                <div className="flex items-center justify-between py-1.5 border-b border-slate-50">
                  <span className="text-slate-500 font-bold">Total Floors</span>
                  <span className="font-extrabold text-[#00062A]">{project.totalFloors || "-"}</span>
                </div>
                <div className="flex items-center justify-between py-1.5 border-b border-slate-50">
                  <span className="text-slate-500 font-bold">Total Units</span>
                  <span className="font-extrabold text-[#00062A]">{project.totalUnits || "-"}</span>
                </div>
                <div className="flex items-center justify-between py-1.5 border-b border-slate-50">
                  <span className="text-slate-500 font-bold">Units Per Floor</span>
                  <span className="font-extrabold text-[#00062A]">{project.unitsPerFloor || "-"}</span>
                </div>
                <div className="flex items-center justify-between py-1.5 border-b border-slate-50">
                  <span className="text-slate-500 font-bold">Land Area</span>
                  <span className="font-extrabold text-[#00062A]">{project.landArea || "N/A"}</span>
                </div>
                <div className="flex items-center justify-between py-1.5 border-b border-slate-50">
                  <span className="text-slate-500 font-bold">Orientation / Facing</span>
                  <span className="font-extrabold text-[#00062A]">{project.facing || "South"}</span>
                </div>
                <div className="flex items-center justify-between py-1.5">
                  <span className="text-slate-500 font-bold">Front Road Size</span>
                  <span className="font-extrabold text-[#00062A]">{project.roadSize || "30 Feet"}</span>
                </div>
              </div>
            </div>

            {/* Sales Contact Box */}
            <div className="bg-[#00062A] text-white p-6 rounded-2xl space-y-4">
              <h4 className="text-base font-extrabold text-white">Interested in this Project?</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Connect with our real estate sales advisors for site visits, floor plan inquiries, and booking details.
              </p>
              <div className="space-y-2 pt-1 text-xs">
                <a
                  href="tel:+8801700000000"
                  className="flex items-center gap-2.5 p-3 rounded-xl bg-white/10 hover:bg-[#FF4C00] text-white font-bold transition no-underline"
                >
                  <HiOutlinePhone className="w-4 h-4 text-[#FF4C00] group-hover:text-white" />
                  <span>Call Hotline: +880 1700-000000</span>
                </a>
                <a
                  href="mailto:sales@realnest.com"
                  className="flex items-center gap-2.5 p-3 rounded-xl bg-white/10 hover:bg-[#FF4C00] text-white font-bold transition no-underline"
                >
                  <HiOutlineEnvelope className="w-4 h-4 text-[#FF4C00] group-hover:text-white" />
                  <span>Email: sales@realnest.com</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Overview & Amenities Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-3">
              <h3 className="text-sm font-black text-[#00062A] uppercase tracking-wider pb-2 border-b border-slate-100">
                Project Overview
              </h3>
              <p className="text-xs md:text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                {project.description || "No description provided for this building project."}
              </p>
            </div>

            {/* Features & Facilities */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
              <h3 className="text-sm font-black text-[#00062A] uppercase tracking-wider pb-2 border-b border-slate-100 flex items-center gap-2">
                <HiOutlineSparkles className="w-5 h-5 text-[#FF4C00]" />
                <span>Building Facilities & Amenities</span>
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-bold">
                <div className={`p-3 rounded-xl border flex items-center gap-2 ${project.parkingAvailable ? "bg-emerald-50 border-emerald-200 text-emerald-800" : "bg-slate-50 text-slate-400"}`}>
                  <HiOutlineCheckBadge className="w-4 h-4 text-[#FF4C00]" />
                  <span>Ground Parking</span>
                </div>
                <div className={`p-3 rounded-xl border flex items-center gap-2 ${project.liftAvailable ? "bg-emerald-50 border-emerald-200 text-emerald-800" : "bg-slate-50 text-slate-400"}`}>
                  <HiOutlineCheckBadge className="w-4 h-4 text-[#FF4C00]" />
                  <span>Elevator / Lift</span>
                </div>
                <div className={`p-3 rounded-xl border flex items-center gap-2 ${project.generatorBackup ? "bg-emerald-50 border-emerald-200 text-emerald-800" : "bg-slate-50 text-slate-400"}`}>
                  <HiOutlineCheckBadge className="w-4 h-4 text-[#FF4C00]" />
                  <span>Generator Backup</span>
                </div>
                <div className={`p-3 rounded-xl border flex items-center gap-2 ${project.securityAvailable ? "bg-emerald-50 border-emerald-200 text-emerald-800" : "bg-slate-50 text-slate-400"}`}>
                  <HiOutlineCheckBadge className="w-4 h-4 text-[#FF4C00]" />
                  <span>24/7 Security</span>
                </div>
              </div>

              {Array.isArray(project.amenities) && project.amenities.length > 0 && (
                <div className="pt-2">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
                    Additional Project Features
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {project.amenities.map((item: string, idx: number) => (
                      <span
                        key={idx}
                        className="px-3.5 py-1.5 rounded-full bg-[#FF4C00]/10 text-[#FF4C00] border border-[#FF4C00]/20 text-xs font-bold"
                      >
                        ✓ {item}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Associated Available Flat Units */}
        {Array.isArray(project.flats) && project.flats.length > 0 && (
          <div className="space-y-4 pt-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-extrabold text-[#00062A]">
                Available Flat Units In {project.title}
              </h2>
              <span className="text-xs font-bold text-slate-500">
                {project.flats.length} Flat Units Listed
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {project.flats.map((flat: any) => (
                <FlatCard key={flat.id} flat={{ ...flat, property: project }} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectDetailsMainView;
