"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import dynamic from "next/dynamic";
import { toast } from "react-toastify";

import { HiOutlineLocationMarker as LocationIcon } from "react-icons/hi";
import {
  HiOutlineArrowLeft,
  HiOutlineBuildingOffice2,
  HiOutlineTag,
  HiOutlineBanknotes,
  HiOutlineGlobeAlt,
  HiOutlineCheckBadge,
  HiOutlineSparkles,
  HiOutlineDocumentText,
  HiOutlinePlus,
  HiOutlinePhoto,
  HiOutlineXMark,
  HiOutlineShieldCheck,
  HiOutlineCalendarDays,
  HiOutlineMapPin,
} from "react-icons/hi2";
import instance from "@/services/baseServices";
import CreatableNumberSelect from "@/components/common/CreatableNumberSelect";
import BdAddressSelector from "@/components/bdAddressSelector/BdAddressSelector";
import MediaPickerModal from "@/components/mediaPickerModal/MediaPickerModal";

// Dynamic import for MapPicker (Leaflet needs client-only rendering)
const MapPicker = dynamic(() => import("@/components/mapPicker/MapPicker"), { ssr: false });

const DEFAULT_PROPERTY_FEATURES = [
  "Swimming Pool",
  "Gym",
  "Community Hall",
  "Rooftop Garden",
  "Playground",
  "CCTV Monitoring",
  "Fire Safety",
  "Solar Power Backup",
  "Intercom Facility",
];

interface EditPropertyMainViewProps {
  propertyId?: string;
}

export const EditPropertyMainView: React.FC<EditPropertyMainViewProps> = ({
  propertyId: propId,
}) => {
  const router = useRouter();
  const urlParams = useParams();
  const propertyId = propId || (urlParams?.id as string);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [hasGroundFloor, setHasGroundFloor] = useState(true);
  const [mediaPickerOpen, setMediaPickerOpen] = useState(false);

  const [landVal, setLandVal] = useState("5");
  const [landUnit, setLandUnit] = useState("Katha");
  const [roadVal, setRoadVal] = useState("30");
  const [roadUnit, setRoadUnit] = useState("Feet");
  const [buildingAgePreset, setBuildingAgePreset] = useState("Under Construction");

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    description: "",
    address: "",
    area: "",
    city: "Dhaka",
    division: "",
    district: "",
    upazila: "",
    union: "",
    latitude: 23.7925,
    longitude: 90.4078,
    floorLabel: "G+9",
    totalFloors: 9,
    totalUnits: 18,
    unitsPerFloor: 2,
    startingPrice: 15000000,
    handoverDate: "",
    completionDate: "",
    constructionStart: "",
    landArea: "5 Katha",
    facing: "South",
    roadSize: "30 Feet",
    totalParkingSlots: 0,
    buildingAge: "Under Construction",
    parkingAvailable: true,
    liftAvailable: true,
    generatorBackup: true,
    securityAvailable: true,
    developerName: "",
    rajukApproval: false,
    reraRegistered: false,
    imageUrls: [] as string[],
    amenities: [] as string[],
    status: "ONGOING",
    isFeatured: false,
    isPublished: true,
  });

  const [amenityInput, setAmenityInput] = useState("");

  useEffect(() => {
    const fetchPropertyDetails = async () => {
      try {
        setLoading(true);
        const res = await instance.get(`/properties/${propertyId}`);
        if (res.data?.success && res.data?.data) {
          const data = res.data.data;
          const labelStartsWithG = data.floorLabel ? data.floorLabel.toUpperCase().startsWith("G+") : true;
          setHasGroundFloor(labelStartsWithG);

          if (data.landArea) {
            const parts = data.landArea.trim().split(" ");
            setLandVal(parts[0] || "");
            setLandUnit(parts.slice(1).join(" ") || "Katha");
          }

          if (data.roadSize) {
            const parts = data.roadSize.trim().split(" ");
            setRoadVal(parts[0] || "");
            setRoadUnit(parts.slice(1).join(" ") || "Feet");
          }

          const PRESETS = [
            "Under Construction",
            "Brand New (New Construction)",
            "Less than 1 year",
            "1 - 3 years",
            "3 - 5 years",
            "5 - 10 years",
            "More than 10 years",
          ];
          if (data.buildingAge && PRESETS.includes(data.buildingAge)) {
            setBuildingAgePreset(data.buildingAge);
          } else if (data.buildingAge) {
            setBuildingAgePreset("CUSTOM");
          }

          setFormData({
            title: data.title || "",
            slug: data.slug || "",
            description: data.description || "",
            address: data.address || "",
            area: data.area || "",
            city: data.city || "Dhaka",
            division: data.division || "",
            district: data.district || "",
            upazila: data.upazila || "",
            union: data.union || "",
            latitude: data.latitude ? Number(data.latitude) : 23.7925,
            longitude: data.longitude ? Number(data.longitude) : 90.4078,
            floorLabel: data.floorLabel || "G+9",
            totalFloors: data.totalFloors || 9,
            totalUnits: data.totalUnits || 18,
            unitsPerFloor: data.unitsPerFloor || 2,
            startingPrice: data.startingPrice ? Number(data.startingPrice) : 0,
            handoverDate: data.handoverDate ? data.handoverDate.split("T")[0] : "",
            completionDate: data.completionDate ? data.completionDate.split("T")[0] : "",
            constructionStart: data.constructionStart ? data.constructionStart.split("T")[0] : "",
            landArea: data.landArea || "",
            facing: data.facing || "South",
            roadSize: data.roadSize || "",
            totalParkingSlots: data.totalParkingSlots || 0,
            buildingAge: data.buildingAge || "Under Construction",
            parkingAvailable: Boolean(data.parkingAvailable),
            liftAvailable: Boolean(data.liftAvailable),
            generatorBackup: Boolean(data.generatorBackup),
            securityAvailable: Boolean(data.securityAvailable),
            developerName: data.developerName || "",
            rajukApproval: Boolean(data.rajukApproval),
            reraRegistered: Boolean(data.reraRegistered),
            imageUrls: Array.isArray(data.imageUrls) ? data.imageUrls : [],
            amenities: Array.isArray(data.amenities) ? data.amenities : [],
            status: data.status || "ONGOING",
            isFeatured: Boolean(data.isFeatured),
            isPublished: Boolean(data.isPublished),
          });
        }
      } catch (err: any) {
        toast.error(err?.response?.data?.message || "Failed to load property details.");
      } finally {
        setLoading(false);
      }
    };

    if (propertyId) {
      fetchPropertyDetails();
    }
  }, [propertyId]);

  const handleGroundFloorToggle = (checked: boolean) => {
    setHasGroundFloor(checked);
    const label = checked ? `G+${formData.totalFloors || 0}` : `${formData.totalFloors || 0} Floors`;
    setFormData((prev) => ({
      ...prev,
      floorLabel: label,
    }));
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else if (type === "number") {
      const numVal = value === "" ? 0 : Number(value);
      setFormData((prev) => {
        const updated = { ...prev, [name]: numVal };

        if (name === "totalFloors") {
          updated.floorLabel = hasGroundFloor ? `G+${numVal}` : `${numVal} Floors`;
        }

        return updated;
      });
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleToggleFeature = (feature: string) => {
    setFormData((prev) => {
      const exists = prev.amenities.includes(feature);
      const updated = exists
        ? prev.amenities.filter((item) => item !== feature)
        : [...prev.amenities, feature];
      return { ...prev, amenities: updated };
    });
  };

  const handleAddCustomFeature = () => {
    if (amenityInput.trim()) {
      const trimmed = amenityInput.trim();
      if (!formData.amenities.includes(trimmed)) {
        setFormData((prev) => ({
          ...prev,
          amenities: [...prev.amenities, trimmed],
        }));
      }
      setAmenityInput("");
    }
  };

  const handleRemoveFeature = (feature: string) => {
    setFormData((prev) => ({
      ...prev,
      amenities: prev.amenities.filter((item) => item !== feature),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.address || !formData.area) {
      toast.warning("Please fill in Property Title, Address, and Area.");
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        ...formData,
        startingPrice: formData.startingPrice ? Number(formData.startingPrice) : undefined,
        totalFloors: Number(formData.totalFloors),
        totalUnits: Number(formData.totalUnits),
        unitsPerFloor: formData.unitsPerFloor ? Number(formData.unitsPerFloor) : undefined,
        latitude: formData.latitude ? Number(formData.latitude) : undefined,
        longitude: formData.longitude ? Number(formData.longitude) : undefined,
        handoverDate: formData.handoverDate ? new Date(formData.handoverDate).toISOString() : undefined,
      };

      const res = await instance.patch(`/properties/${propertyId}`, payload);
      if (res.data?.success) {
        toast.success("Building project details updated successfully!");
        router.push("/dashboard/properties");
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to update property.");
    } finally {
      setSubmitting(false);
    }
  };


  if (loading) {
    return (
      <div className="py-12 text-center text-xs font-bold text-slate-400">
        Loading property information for editing...
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Top Header */}
      <div className="flex items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
        <div>
          <Link
            href="/dashboard/properties"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-[#FF4C00] mb-2 transition"
          >
            <HiOutlineArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Property Directory</span>
          </Link>
          <h2 className="text-xl sm:text-2xl font-black text-[#00062A] tracking-tight flex items-center gap-2">
            <HiOutlineBuildingOffice2 className="w-7 h-7 text-[#FF4C00]" />
            <span>Edit Property Listing</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Update building information, location, floor plans, and amenities.
          </p>
        </div>
      </div>

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section 1: Basic Information */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
          <h3 className="text-sm font-black text-[#FF4C00] uppercase tracking-wider pb-2 border-b border-slate-100 flex items-center gap-2">
            <HiOutlineBuildingOffice2 className="w-5 h-5" />
            <span>1. Basic Information</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5 mb-1">
                <HiOutlineBuildingOffice2 className="w-3.5 h-3.5 text-[#FF4C00]" />
                <span>Property Title *</span>
              </label>
              <input
                type="text"
                name="title"
                placeholder="e.g. Grand Rose Tower"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold focus:outline-none focus:border-[#FF4C00]"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5 mb-1">
                <HiOutlineDocumentText className="w-3.5 h-3.5 text-slate-400" />
                <span>Description</span>
              </label>
              <textarea
                name="description"
                rows={3}
                placeholder="Detailed description of the building project..."
                value={formData.description}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:border-[#FF4C00]"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5 mb-1">
                <HiOutlineCheckBadge className="w-3.5 h-3.5 text-slate-400" />
                <span>Project Status</span>
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold focus:outline-none focus:border-[#FF4C00] bg-white"
              >
                <option value="UPCOMING">Upcoming</option>
                <option value="ONGOING">Ongoing</option>
                <option value="COMPLETED">Completed</option>
                <option value="READY_TO_MOVE">Ready to Move</option>
                <option value="HANDOVERED">Handovered</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5 mb-1">
                <HiOutlineBanknotes className="w-3.5 h-3.5 text-[#FF4C00]" />
                <span>Starting Price (BDT)</span>
              </label>
              <input
                type="number"
                name="startingPrice"
                placeholder="e.g. 15000000"
                value={formData.startingPrice}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-[#FF4C00] focus:outline-none focus:border-[#FF4C00]"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Location & Map Coordinates */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
          <h3 className="text-sm font-black text-[#FF4C00] uppercase tracking-wider pb-2 border-b border-slate-100 flex items-center gap-2">
            <LocationIcon className="w-5 h-5" />
            <span>2. Location & Map Coordinates</span>
          </h3>

          <div className="space-y-4">
            <div>
              <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5 mb-1">
                <LocationIcon className="w-3.5 h-3.5 text-slate-400" />
                <span>Street Address / Building No. *</span>
              </label>
              <input
                type="text"
                name="address"
                placeholder="e.g. House 14, Road 12, Block D"
                value={formData.address}
                onChange={handleChange}
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:border-[#FF4C00]"
              />
            </div>

            {/* Bangladesh Location Step-by-Step Selection */}
            <div>
              <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5 mb-2">
                <HiOutlineMapPin className="w-3.5 h-3.5 text-[#FF4C00]" />
                <span>Location (Division → District → Upazila/Thana → Union/Ward) *</span>
              </label>
              <BdAddressSelector
                value={{
                  division: formData.division,
                  district: formData.district,
                  upazila: formData.upazila,
                  union: formData.union,
                }}
                onChange={(addr) =>
                  setFormData((prev) => ({
                    ...prev,
                    division: addr.division || "",
                    district: addr.district || "",
                    upazila: addr.upazila || "",
                    union: addr.union || "",
                    city: addr.district || prev.city,
                    area: addr.upazila || prev.area,
                  }))
                }
              />
            </div>
          </div>

          {/* Map Picker */}
          <div className="pt-2">
            <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5 mb-2">
              <HiOutlineGlobeAlt className="w-3.5 h-3.5 text-[#FF4C00]" />
              <span>Map Coordinates (Click or drag marker)</span>
            </label>
            <MapPicker
              latitude={formData.latitude}
              longitude={formData.longitude}
              onChange={(lat, lng) =>
                setFormData((prev) => ({ ...prev, latitude: lat, longitude: lng }))
              }
            />
          </div>
        </div>

        {/* Section 2C: Property Images */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
          <h3 className="text-sm font-black text-[#FF4C00] uppercase tracking-wider pb-2 border-b border-slate-100 flex items-center gap-2">
            <HiOutlinePhoto className="w-5 h-5" />
            <span>Property Images</span>
          </h3>

          {/* Selected Images Preview */}
          {formData.imageUrls.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {formData.imageUrls.map((url, idx) => (
                <div key={idx} className="relative aspect-video rounded-xl overflow-hidden border border-slate-200 group">
                  <img src={url} alt={`Property ${idx + 1}`} className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        imageUrls: prev.imageUrls.filter((_, i) => i !== idx),
                      }))
                    }
                    className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition cursor-pointer border-none"
                  >
                    <HiOutlineXMark size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}

          <button
            type="button"
            onClick={() => setMediaPickerOpen(true)}
            className="w-full py-3 rounded-xl border-2 border-dashed border-slate-300 text-slate-500 text-xs font-bold hover:border-[#FF4C00] hover:text-[#FF4C00] transition cursor-pointer bg-transparent flex items-center justify-center gap-2"
          >
            <HiOutlinePhoto className="w-4 h-4" />
            {formData.imageUrls.length > 0 ? "Add More Images" : "Select Images from Media Library"}
          </button>

          <MediaPickerModal
            isOpen={mediaPickerOpen}
            onClose={() => setMediaPickerOpen(false)}
            folder="properties"
            selectedUrls={formData.imageUrls}
            onSelect={(urls) =>
              setFormData((prev) => ({
                ...prev,
                imageUrls: [...new Set([...prev.imageUrls, ...urls])],
              }))
            }
          />
        </div>

        {/* Section 3: Building Specifications */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h3 className="text-sm font-black text-[#FF4C00] uppercase tracking-wider flex items-center gap-2">
              <HiOutlineBuildingOffice2 className="w-5 h-5" />
              <span>3. Building Specifications</span>
            </h3>

            {/* Checkmark for Has Ground Floor */}
            <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-800 bg-slate-100/80 px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-100 transition">
              <input
                type="checkbox"
                checked={hasGroundFloor}
                onChange={(e) => handleGroundFloorToggle(e.target.checked)}
                className="w-4 h-4 text-[#FF4C00] rounded border-slate-300 focus:ring-[#FF4C00]"
              />
              <span>Has Ground Floor (Parking/Garage)</span>
            </label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 pt-1">
            <div>
              <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5 mb-1">
                <HiOutlineBuildingOffice2 className="w-3.5 h-3.5 text-[#FF4C00]" />
                <span>Total Floors *</span>
              </label>
              <CreatableNumberSelect
                value={formData.totalFloors}
                onChange={(val) => {
                  setFormData((prev) => ({
                    ...prev,
                    totalFloors: val,
                    floorLabel: hasGroundFloor ? `G+${val}` : `${val} Floors`,
                  }));
                }}
                placeholder="1-50 Floors"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5 mb-1">
                <HiOutlineSparkles className="w-3.5 h-3.5 text-[#FF4C00]" />
                <span>Units Per Floor</span>
              </label>
              <CreatableNumberSelect
                value={formData.unitsPerFloor}
                onChange={(val) => setFormData((prev) => ({ ...prev, unitsPerFloor: val }))}
                placeholder="1-50 Units"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5 mb-1">
                <HiOutlineTag className="w-3.5 h-3.5 text-[#FF4C00]" />
                <span>Floor Label ({hasGroundFloor ? "G+9 Format" : "Standard"})</span>
              </label>
              <input
                type="text"
                name="floorLabel"
                placeholder="e.g. G+9"
                value={formData.floorLabel}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-[#FF4C00] focus:outline-none focus:border-[#FF4C00]"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5 mb-1">
                <HiOutlineBuildingOffice2 className="w-3.5 h-3.5 text-[#00062A]" />
                <span>Total Units *</span>
              </label>
              <CreatableNumberSelect
                value={formData.totalUnits}
                onChange={(val) => setFormData((prev) => ({ ...prev, totalUnits: val }))}
                placeholder="Total Units"
              />
            </div>
          </div>

          {/* Land & Physical Attributes */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-3 border-t border-slate-100">
            <div>
              <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5 mb-1">
                <HiOutlineTag className="w-3.5 h-3.5 text-slate-400" />
                <span>Land Area</span>
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. 5"
                  value={landVal}
                  onChange={(e) => {
                    setLandVal(e.target.value);
                    setFormData((prev) => ({
                      ...prev,
                      landArea: `${e.target.value} ${landUnit}`.trim(),
                    }));
                  }}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:border-[#FF4C00]"
                />
                <select
                  value={landUnit}
                  onChange={(e) => {
                    setLandUnit(e.target.value);
                    setFormData((prev) => ({
                      ...prev,
                      landArea: `${landVal} ${e.target.value}`.trim(),
                    }));
                  }}
                  className="px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-bold focus:outline-none focus:border-[#FF4C00] bg-white shrink-0"
                >
                  <option value="Katha">Katha</option>
                  <option value="Decimal">Decimal</option>
                  <option value="Bigha">Bigha</option>
                  <option value="Sq Ft">Sq Ft</option>
                  <option value="Acre">Acre</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5 mb-1">
                <HiOutlineGlobeAlt className="w-3.5 h-3.5 text-slate-400" />
                <span>Facing / Orientation</span>
              </label>
              <select
                name="facing"
                value={formData.facing || "South"}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold focus:outline-none focus:border-[#FF4C00] bg-white"
              >
                <option value="South">South Facing</option>
                <option value="North">North Facing</option>
                <option value="East">East Facing</option>
                <option value="West">West Facing</option>
                <option value="South-East">South-East Facing</option>
                <option value="South-West">South-West Facing</option>
                <option value="North-East">North-East Facing</option>
                <option value="North-West">North-West Facing</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5 mb-1">
                <HiOutlineTag className="w-3.5 h-3.5 text-slate-400" />
                <span>Front Road Size</span>
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. 30"
                  value={roadVal}
                  onChange={(e) => {
                    setRoadVal(e.target.value);
                    setFormData((prev) => ({
                      ...prev,
                      roadSize: `${e.target.value} ${roadUnit}`.trim(),
                    }));
                  }}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:border-[#FF4C00]"
                />
                <select
                  value={roadUnit}
                  onChange={(e) => {
                    setRoadUnit(e.target.value);
                    setFormData((prev) => ({
                      ...prev,
                      roadSize: `${roadVal} ${e.target.value}`.trim(),
                    }));
                  }}
                  className="px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-bold focus:outline-none focus:border-[#FF4C00] bg-white shrink-0"
                >
                  <option value="Feet">Feet</option>
                  <option value="Feet Road">Feet Road</option>
                  <option value="Meter">Meter</option>
                  <option value="Meter Road">Meter Road</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5 mb-1">
                <HiOutlineBuildingOffice2 className="w-3.5 h-3.5 text-slate-400" />
                <span>Total Parking Slots</span>
              </label>
              <CreatableNumberSelect
                value={formData.totalParkingSlots || 0}
                onChange={(val) => setFormData((prev) => ({ ...prev, totalParkingSlots: val }))}
                placeholder="0-50 Slots"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5 mb-1">
                <HiOutlineBuildingOffice2 className="w-3.5 h-3.5 text-slate-400" />
                <span>Building Age / Condition</span>
              </label>
              <select
                value={buildingAgePreset}
                onChange={(e) => {
                  const val = e.target.value;
                  setBuildingAgePreset(val);
                  if (val !== "CUSTOM") {
                    setFormData((prev) => ({ ...prev, buildingAge: val }));
                  }
                }}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold focus:outline-none focus:border-[#FF4C00] bg-white mb-2"
              >
                <option value="Under Construction">Under Construction</option>
                <option value="Brand New (New Construction)">Brand New (New Construction)</option>
                <option value="Less than 1 year">Less than 1 year</option>
                <option value="1 - 3 years">1 - 3 years</option>
                <option value="3 - 5 years">3 - 5 years</option>
                <option value="5 - 10 years">5 - 10 years</option>
                <option value="More than 10 years">More than 10 years</option>
                <option value="CUSTOM">Custom...</option>
              </select>

              {buildingAgePreset === "CUSTOM" && (
                <input
                  type="text"
                  name="buildingAge"
                  placeholder="Enter custom condition e.g. 15 Years (Renovated)"
                  value={formData.buildingAge || ""}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:border-[#FF4C00]"
                />
              )}
            </div>
          </div>
        </div>

        {/* Section 4: Facilities & Building Features */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
          <h3 className="text-sm font-black text-[#FF4C00] uppercase tracking-wider pb-2 border-b border-slate-100 flex items-center gap-2">
            <HiOutlineSparkles className="w-5 h-5" />
            <span>4. Facilities & Building Features</span>
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pb-2 border-b border-slate-100">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700">
              <input
                type="checkbox"
                name="parkingAvailable"
                checked={formData.parkingAvailable}
                onChange={handleChange}
                className="w-4 h-4 text-[#FF4C00] rounded border-slate-300 focus:ring-[#FF4C00]"
              />
              <span>Ground Parking</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700">
              <input
                type="checkbox"
                name="liftAvailable"
                checked={formData.liftAvailable}
                onChange={handleChange}
                className="w-4 h-4 text-[#FF4C00] rounded border-slate-300 focus:ring-[#FF4C00]"
              />
              <span>Lift / Elevator</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700">
              <input
                type="checkbox"
                name="generatorBackup"
                checked={formData.generatorBackup}
                onChange={handleChange}
                className="w-4 h-4 text-[#FF4C00] rounded border-slate-300 focus:ring-[#FF4C00]"
              />
              <span>Generator Backup</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700">
              <input
                type="checkbox"
                name="securityAvailable"
                checked={formData.securityAvailable}
                onChange={handleChange}
                className="w-4 h-4 text-[#FF4C00] rounded border-slate-300 focus:ring-[#FF4C00]"
              />
              <span>24/7 Security</span>
            </label>
          </div>

          {/* Preset Feature Checkboxes */}
          <div className="space-y-3 pt-2">
            <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <HiOutlineTag className="w-3.5 h-3.5 text-[#FF4C00]" />
              <span>Building Amenities & Preset Features (Check/Uncheck to add or remove)</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 bg-slate-50/70 p-4 rounded-xl border border-slate-200/80">
              {DEFAULT_PROPERTY_FEATURES.map((feature) => {
                const isChecked = formData.amenities.includes(feature);
                return (
                  <label
                    key={feature}
                    className={`flex items-center gap-2.5 p-2 rounded-xl border text-xs font-bold cursor-pointer transition select-none ${
                      isChecked
                        ? "bg-[#FF4C00]/10 border-[#FF4C00] text-[#FF4C00]"
                        : "bg-white border-slate-200 text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => handleToggleFeature(feature)}
                      className="w-4 h-4 text-[#FF4C00] rounded border-slate-300 focus:ring-[#FF4C00]"
                    />
                    <span>{feature}</span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Custom Feature Input */}
          <div className="space-y-2 pt-2">
            <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <HiOutlinePlus className="w-3.5 h-3.5 text-[#FF4C00]" />
              <span>Add Custom Feature</span>
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Type custom feature name (e.g. Swimming Pool, Gym)..."
                value={amenityInput}
                onChange={(e) => setAmenityInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddCustomFeature();
                  }
                }}
                className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:border-[#FF4C00]"
              />
              <button
                type="button"
                onClick={handleAddCustomFeature}
                className="px-5 py-2.5 rounded-xl bg-[#00062A] text-white text-xs font-bold hover:bg-[#00062A]/90 transition cursor-pointer border-none"
              >
                + Add Feature
              </button>
            </div>

            {/* Selected Feature Pills */}
            <div className="flex flex-wrap gap-2 pt-2">
              {formData.amenities.map((item) => (
                <span
                  key={item}
                  className="px-3 py-1 rounded-full bg-[#FF4C00]/10 text-[#FF4C00] border border-[#FF4C00]/20 text-xs font-bold flex items-center gap-1.5"
                >
                  {item}
                  <button
                    type="button"
                    onClick={() => handleRemoveFeature(item)}
                    className="text-[#FF4C00] hover:text-rose-600 cursor-pointer border-none bg-transparent font-black"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Submit Actions */}
        <div className="flex items-center justify-end gap-3 pt-4">
          <Link
            href="/dashboard/properties"
            className="px-6 py-3 rounded-xl border border-slate-300 text-slate-700 text-xs font-extrabold hover:bg-slate-100 transition"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={submitting}
            className="px-8 py-3 rounded-xl bg-[#FF4C00] hover:bg-[#e04300] text-white text-xs font-extrabold shadow-lg shadow-[#FF4C00]/20 transition active:scale-98 disabled:opacity-50 cursor-pointer border-none"
          >
            {submitting ? "Updating Property..." : "Update Property"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditPropertyMainView;
