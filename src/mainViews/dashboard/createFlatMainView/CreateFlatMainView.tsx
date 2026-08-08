"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "react-toastify";

import {
  HiOutlineArrowLeft,
  HiOutlineHome,
  HiOutlineBuildingOffice2,
  HiOutlineBanknotes,
  HiOutlineCheckBadge,
  HiOutlineTag,
  HiOutlineDocumentText,
  HiOutlinePlus,
  HiOutlineSparkles,
  HiOutlinePhoto,
  HiOutlineXMark,
  HiOutlineGlobeAlt,
  HiOutlineCalendarDays,
} from "react-icons/hi2";
import { BiBed, BiBath, BiArea } from "react-icons/bi";
import instance from "@/services/baseServices";
import CreatableNumberSelect from "@/components/common/CreatableNumberSelect";
import MediaPickerModal from "@/components/mediaPickerModal/MediaPickerModal";

const DEFAULT_FLAT_FEATURES = [
  "South Facing",
  "Corner Flat",
  "Gas Line Connected",
  "Lake View",
  "Master Bath Tub",
  "Balcony Garden",
  "Servant Room",
  "Decorated Interior",
];

const FLAT_CATEGORIES = [
  "Luxury Suite",
  "Premium Unit",
  "Executive Suite",
  "Deluxe Unit",
  "Standard Unit",
  "Penthouse",
  "Duplex Suite",
  "Studio Apartment",
];

const getBuildingInitials = (buildingTitle: string) => {
  if (!buildingTitle) return "PROP";
  const words = buildingTitle.trim().split(/\s+/).filter(Boolean);
  if (words.length === 1) {
    return words[0].slice(0, 3).toUpperCase();
  }
  return words.map((w) => w[0]).join("").toUpperCase().slice(0, 4);
};

export const CreateFlatMainView = () => {
  const router = useRouter();
  const [properties, setProperties] = useState<any[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [mediaPickerOpen, setMediaPickerOpen] = useState(false);


  const [flatCategory, setFlatCategory] = useState("Luxury Suite");
  const [customCategory, setCustomCategory] = useState("");
  const [unitSuffix, setUnitSuffix] = useState("A");
  const [customSuffix, setCustomSuffix] = useState("");

  const [formData, setFormData] = useState({
    propertyId: "",
    title: "",
    flatNumber: "",
    floorNumber: 1,
    beds: 3,
    baths: 3,
    kitchens: true,
    balconies: 2,
    size: 1650,
    price: 18500000,
    status: "AVAILABLE",
    furnishing: "Semi-Furnished",
    facing: "South",
    floorType: "Tiles",
    hasGasLine: true,
    hasWaterSupply: true,
    completionDate: "",
    description: "",
    imageUrls: [] as string[],
    amenities: ["South Facing", "Gas Line Connected", "Lake View"],
    isFeatured: false,
    isPublished: true,
  });

  const [amenityInput, setAmenityInput] = useState("");

  const handleAutoGenerateTitleAndCode = (
    pId = formData.propertyId,
    flNum = formData.floorNumber,
    category = flatCategory,
    suffix = unitSuffix,
    customCatVal = customCategory,
    customSufVal = customSuffix,
    propsList = properties
  ) => {
    const selectedProp = propsList.find((p) => p.id === pId);
    const initials = selectedProp ? getBuildingInitials(selectedProp.title) : "SN";
    const effectiveCategory = category === "Custom..." ? (customCatVal || "Unit") : category;
    const effectiveSuffix = suffix === "Custom..." ? (customSufVal || "1") : suffix;
    const code = `${flNum}${effectiveSuffix}`;
    const generatedTitle = `${initials}-${code}-${effectiveCategory}`;

    setFormData((prev) => ({
      ...prev,
      flatNumber: code,
      title: generatedTitle,
    }));
  };

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const res = await instance.get("/properties?limit=100");
        if (res.data?.success && res.data?.data?.length > 0) {
          const fetchedProps = res.data.data;
          setProperties(fetchedProps);
          const firstPropId = fetchedProps[0].id;
          setFormData((prev) => ({
            ...prev,
            propertyId: firstPropId,
          }));
          handleAutoGenerateTitleAndCode(firstPropId, formData.floorNumber, flatCategory, unitSuffix, fetchedProps);
        }
      } catch (err) {
        console.error("Failed to fetch properties list:", err);
      }
    };

    fetchProperties();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else if (type === "number") {
      setFormData((prev) => ({ ...prev, [name]: value === "" ? "" : Number(value) }));
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

    if (!formData.propertyId || !formData.title || !formData.flatNumber || !formData.price || !formData.size) {
      toast.warning("Please select a Building and fill in Title, Flat Number, Size, and Price.");
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        ...formData,
        floorNumber: Number(formData.floorNumber),
        beds: Number(formData.beds),
        baths: Number(formData.baths),
        kitchens: Boolean(formData.kitchens),
        balconies: Number(formData.balconies),
        size: Number(formData.size),
        price: Number(formData.price),
      };

      const res = await instance.post("/flats", payload);
      if (res.data?.success) {
        toast.success("New flat unit registered to inventory successfully!");
        router.push("/dashboard/flats");
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to create flat unit.");
    } finally {
      setSubmitting(false);
    }
  };


  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* Top Header */}
      <div className="flex items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
        <div>
          <Link
            href="/dashboard/flats"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-[#00062A] mb-2 transition"
          >
            <HiOutlineArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Flats Inventory</span>
          </Link>
          <h2 className="text-xl sm:text-2xl font-black text-[#00062A] tracking-tight flex items-center gap-2">
            <HiOutlineHome className="w-7 h-7 text-[#FF4C00]" />
            <span>Add New Flat Unit</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Fill in the flat unit specifications, floor level, and price.
          </p>
        </div>
      </div>

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section 1: Property Association & Flat Info */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
          <h3 className="text-sm font-black text-[#00062A] uppercase tracking-wider pb-2 border-b border-slate-100 flex items-center gap-2">
            <HiOutlineBuildingOffice2 className="w-5 h-5 text-[#FF4C00]" />
            <span>1. Building & Basic Info</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5 mb-1">
                <HiOutlineBuildingOffice2 className="w-3.5 h-3.5 text-[#FF4C00]" />
                <span>Select Property / Building *</span>
              </label>
              <select
                name="propertyId"
                value={formData.propertyId}
                onChange={(e) => {
                  handleChange(e);
                  handleAutoGenerateTitleAndCode(e.target.value, formData.floorNumber, flatCategory, unitSuffix);
                }}
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold focus:outline-none focus:border-[#FF4C00] bg-white"
              >
                {properties.length === 0 ? (
                  <option value="">No buildings found - please add a property first</option>
                ) : (
                  properties.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.title} ({p.area}, {p.city})
                    </option>
                  ))
                )}
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:col-span-2">
              <div>
                <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5 mb-1">
                  <HiOutlineSparkles className="w-3.5 h-3.5 text-[#FF4C00]" />
                  <span>Flat Category Preset</span>
                </label>
                <select
                  value={flatCategory}
                  onChange={(e) => {
                    const cat = e.target.value;
                    setFlatCategory(cat);
                    handleAutoGenerateTitleAndCode(formData.propertyId, formData.floorNumber, cat, unitSuffix, customCategory, customSuffix);
                  }}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold focus:outline-none focus:border-[#FF4C00] bg-white"
                >
                  {FLAT_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                  <option value="Custom...">Custom...</option>
                </select>
                {flatCategory === "Custom..." && (
                  <input
                    type="text"
                    placeholder="Enter custom category (e.g. Royal Duplex)"
                    value={customCategory}
                    onChange={(e) => {
                      const val = e.target.value;
                      setCustomCategory(val);
                      handleAutoGenerateTitleAndCode(formData.propertyId, formData.floorNumber, "Custom...", unitSuffix, val, customSuffix);
                    }}
                    className="w-full mt-2 px-3 py-2 rounded-lg border border-slate-200 text-xs font-medium focus:outline-none focus:border-[#FF4C00]"
                  />
                )}
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5 mb-1">
                  <HiOutlineTag className="w-3.5 h-3.5 text-slate-400" />
                  <span>Unit Suffix / Letter</span>
                </label>
                <select
                  value={unitSuffix}
                  onChange={(e) => {
                    const suf = e.target.value;
                    setUnitSuffix(suf);
                    handleAutoGenerateTitleAndCode(formData.propertyId, formData.floorNumber, flatCategory, suf, customCategory, customSuffix);
                  }}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold focus:outline-none focus:border-[#FF4C00] bg-white"
                >
                  {["A", "B", "C", "D", "E", "F", "G", "H", "1", "2", "3", "4"].map((letter) => (
                    <option key={letter} value={letter}>
                      Unit {letter}
                    </option>
                  ))}
                  <option value="Custom...">Custom...</option>
                </select>
                {unitSuffix === "Custom..." && (
                  <input
                    type="text"
                    placeholder="Enter custom suffix (e.g. 501, PH-1)"
                    value={customSuffix}
                    onChange={(e) => {
                      const val = e.target.value;
                      setCustomSuffix(val);
                      handleAutoGenerateTitleAndCode(formData.propertyId, formData.floorNumber, flatCategory, "Custom...", customCategory, val);
                    }}
                    className="w-full mt-2 px-3 py-2 rounded-lg border border-slate-200 text-xs font-medium focus:outline-none focus:border-[#FF4C00]"
                  />
                )}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  <HiOutlineHome className="w-3.5 h-3.5 text-[#00062A]" />
                  <span>Flat Title *</span>
                </label>
                <button
                  type="button"
                  onClick={() => handleAutoGenerateTitleAndCode()}
                  className="text-[10px] font-extrabold text-[#FF4C00] hover:underline cursor-pointer bg-transparent border-none flex items-center gap-1"
                >
                  <HiOutlineSparkles className="w-3 h-3" />
                  <span>Auto-Generate</span>
                </button>
              </div>
              <input
                type="text"
                name="title"
                placeholder="e.g. SN-4A-Luxury Suite"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:border-[#FF4C00]"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5 mb-1">
                <HiOutlineTag className="w-3.5 h-3.5 text-slate-400" />
                <span>Flat Number / Code *</span>
              </label>
              <input
                type="text"
                name="flatNumber"
                placeholder="e.g. 4A"
                value={formData.flatNumber}
                onChange={handleChange}
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold focus:outline-none focus:border-[#FF4C00]"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5 mb-1">
                <HiOutlineBuildingOffice2 className="w-3.5 h-3.5 text-[#00062A]" />
                <span>Floor Number *</span>
              </label>
              <CreatableNumberSelect
                value={formData.floorNumber}
                onChange={(val) => {
                  setFormData((prev) => ({ ...prev, floorNumber: val }));
                  handleAutoGenerateTitleAndCode(formData.propertyId, val, flatCategory, unitSuffix);
                }}
                placeholder="Select floor (1-50)"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5 mb-1">
                <HiOutlineCheckBadge className="w-3.5 h-3.5 text-slate-400" />
                <span>Status</span>
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold focus:outline-none focus:border-[#FF4C00] bg-white"
              >
                <option value="AVAILABLE">AVAILABLE</option>
                <option value="BOOKED">BOOKED</option>
                <option value="SOLD">SOLD</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section 2: Room Specifications & Price */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
          <h3 className="text-sm font-black text-[#00062A] uppercase tracking-wider pb-2 border-b border-slate-100 flex items-center gap-2">
            <BiBed className="w-5 h-5 text-[#FF4C00]" />
            <span>2. Room Specifications & Pricing</span>
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5 mb-1">
                <BiBed className="w-3.5 h-3.5 text-[#FF4C00]" />
                <span>Bedrooms</span>
              </label>
              <CreatableNumberSelect
                value={formData.beds}
                onChange={(val) => setFormData((prev) => ({ ...prev, beds: val }))}
                placeholder="Beds (1-10)"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5 mb-1">
                <BiBath className="w-3.5 h-3.5 text-[#FF4C00]" />
                <span>Bathrooms</span>
              </label>
              <CreatableNumberSelect
                value={formData.baths}
                onChange={(val) => setFormData((prev) => ({ ...prev, baths: val }))}
                placeholder="Baths (1-10)"
              />
            </div>



            <div>
              <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5 mb-1">
                <HiOutlineSparkles className="w-3.5 h-3.5 text-slate-400" />
                <span>Balconies</span>
              </label>
              <CreatableNumberSelect
                value={formData.balconies}
                onChange={(val) => setFormData((prev) => ({ ...prev, balconies: val }))}
                placeholder="Balconies"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5 mb-1">
                <BiArea className="w-3.5 h-3.5 text-slate-400" />
                <span>Size (Sqft) *</span>
              </label>
              <input
                type="number"
                name="size"
                placeholder="e.g. 1650"
                value={formData.size}
                onChange={handleChange}
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5 mb-1">
                <HiOutlineBanknotes className="w-3.5 h-3.5 text-[#FF4C00]" />
                <span>Price (BDT) *</span>
              </label>
              <input
                type="number"
                name="price"
                placeholder="e.g. 18500000"
                value={formData.price}
                onChange={handleChange}
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-extrabold text-[#FF4C00]"
              />
            </div>
          </div>

          {/* Flat Finishing & Utilities */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-3 border-t border-slate-100">
            <div>
              <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5 mb-1">
                <HiOutlineSparkles className="w-3.5 h-3.5 text-slate-400" />
                <span>Furnishing Status</span>
              </label>
              <select
                name="furnishing"
                value={formData.furnishing}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold focus:outline-none focus:border-[#FF4C00] bg-white"
              >
                <option value="Unfurnished">Unfurnished</option>
                <option value="Semi-Furnished">Semi-Furnished</option>
                <option value="Fully Furnished">Fully Furnished</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5 mb-1">
                <HiOutlineGlobeAlt className="w-3.5 h-3.5 text-slate-400" />
                <span>Flat Facing / Orientation</span>
              </label>
              <select
                name="facing"
                value={formData.facing}
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
                <option value="Corner">Corner Unit</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5 mb-1">
                <HiOutlineTag className="w-3.5 h-3.5 text-slate-400" />
                <span>Floor Type</span>
              </label>
              <select
                name="floorType"
                value={formData.floorType}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold focus:outline-none focus:border-[#FF4C00] bg-white"
              >
                <option value="Tiles">Tiles</option>
                <option value="Marble">Marble</option>
                <option value="Wooden">Wooden</option>
                <option value="Vitrified">Vitrified</option>
                <option value="Granite">Granite</option>
                <option value="Duplex Tiles">Duplex Tiles</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5 mb-1">
                <HiOutlineCalendarDays className="w-3.5 h-3.5 text-slate-400" />
                <span>Handover / Completion Date</span>
              </label>
              <input
                type="date"
                name="completionDate"
                value={formData.completionDate}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:border-[#FF4C00]"
              />
            </div>

            <div className="flex flex-wrap items-center gap-5 sm:col-span-3 pt-4 border-t border-slate-100">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700 bg-slate-50 px-3 py-2 rounded-xl border border-slate-200 hover:bg-slate-100 transition-colors">
                <input
                  type="checkbox"
                  name="kitchens"
                  checked={Boolean(formData.kitchens)}
                  onChange={(e) => setFormData((prev) => ({ ...prev, kitchens: e.target.checked }))}
                  className="w-4 h-4 text-[#FF4C00] accent-[#FF4C00] rounded border-slate-300 focus:ring-[#FF4C00] cursor-pointer"
                />
                <span className="flex items-center gap-1">
                  <HiOutlineHome className="w-4 h-4 text-[#FF4C00]" />
                  Kitchen Facility Available
                </span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700 bg-slate-50 px-3 py-2 rounded-xl border border-slate-200 hover:bg-slate-100 transition-colors">
                <input
                  type="checkbox"
                  name="hasGasLine"
                  checked={formData.hasGasLine}
                  onChange={handleChange}
                  className="w-4 h-4 text-[#FF4C00] accent-[#FF4C00] rounded border-slate-300 focus:ring-[#FF4C00] cursor-pointer"
                />
                <span>Gas Line Connected</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700 bg-slate-50 px-3 py-2 rounded-xl border border-slate-200 hover:bg-slate-100 transition-colors">
                <input
                  type="checkbox"
                  name="hasWaterSupply"
                  checked={formData.hasWaterSupply}
                  onChange={handleChange}
                  className="w-4 h-4 text-[#FF4C00] accent-[#FF4C00] rounded border-slate-300 focus:ring-[#FF4C00] cursor-pointer"
                />
                <span>24/7 Water Supply</span>
              </label>
            </div>
          </div>
        </div>

        {/* Section 2B: Flat Unit Images */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h3 className="text-sm font-black text-[#FF4C00] uppercase tracking-wider flex items-center gap-2">
              <HiOutlinePhoto className="w-5 h-5" />
              <span>Flat Unit Images ({formData.imageUrls.length})</span>
            </h3>
          </div>

          {/* Selected Images Preview */}
          {formData.imageUrls.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {formData.imageUrls.map((url, idx) => (
                <div key={idx} className="relative aspect-video rounded-xl overflow-hidden border border-slate-200 group bg-slate-50">
                  <img src={url} alt={`Flat image ${idx + 1}`} className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        imageUrls: prev.imageUrls.filter((_, i) => i !== idx),
                      }))
                    }
                    className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition cursor-pointer border-none shadow-md"
                    title="Remove image"
                  >
                    <HiOutlineXMark size={14} />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center text-xs font-semibold text-slate-400 border border-dashed border-slate-200 rounded-xl space-y-2">
              <HiOutlinePhoto className="w-8 h-8 text-slate-300 mx-auto" />
              <p>No images selected for this flat yet.</p>
            </div>
          )}

          <button
            type="button"
            onClick={() => setMediaPickerOpen(true)}
            className="w-full py-3.5 rounded-xl border-2 border-dashed border-slate-300 hover:border-[#FF4C00] text-slate-600 hover:text-[#FF4C00] text-xs font-bold transition cursor-pointer bg-slate-50 hover:bg-[#FF4C00]/5 flex items-center justify-center gap-2"
          >
            <HiOutlinePhoto className="w-4 h-4" />
            <span>{formData.imageUrls.length > 0 ? "Add / Change Images from Media Library" : "Select Images from Media Library"}</span>
          </button>

          <MediaPickerModal
            isOpen={mediaPickerOpen}
            onClose={() => setMediaPickerOpen(false)}
            folder="flats"
            selectedUrls={formData.imageUrls}
            onSelect={(urls) =>
              setFormData((prev) => ({
                ...prev,
                imageUrls: [...new Set([...prev.imageUrls, ...urls])],
              }))
            }
          />
        </div>

        {/* Section 3: Flat Specific Features & Amenities */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
          <h3 className="text-sm font-black text-[#00062A] uppercase tracking-wider pb-2 border-b border-slate-100 flex items-center gap-2">
            <HiOutlineSparkles className="w-5 h-5 text-[#FF4C00]" />
            <span>3. Flat Specific Features & Amenities</span>
          </h3>

          <div>
            <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5 mb-1">
              <HiOutlineDocumentText className="w-3.5 h-3.5 text-slate-400" />
              <span>Flat Description</span>
            </label>
            <textarea
              name="description"
              rows={3}
              placeholder="Description of the flat layout, view, orientation..."
              value={formData.description}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium"
            />
          </div>

          {/* Preset Feature Checkboxes */}
          <div className="space-y-3 pt-2">
            <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <HiOutlineTag className="w-3.5 h-3.5 text-[#FF4C00]" />
              <span>Flat Features (Check/Uncheck to add or remove)</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 bg-slate-50/70 p-4 rounded-xl border border-slate-200/80">
              {DEFAULT_FLAT_FEATURES.map((feature) => {
                const isChecked = formData.amenities.includes(feature);
                return (
                  <label
                    key={feature}
                    className={`flex items-center gap-2.5 p-2 rounded-xl border text-xs font-bold cursor-pointer transition select-none ${
                      isChecked
                        ? "bg-[#00062A]/10 border-[#00062A] text-[#00062A]"
                        : "bg-white border-slate-200 text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => handleToggleFeature(feature)}
                      className="w-4 h-4 text-[#00062A] rounded border-slate-300 focus:ring-[#00062A]"
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
              <HiOutlinePlus className="w-3.5 h-3.5 text-[#00062A]" />
              <span>Add Custom Flat Feature</span>
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Type custom feature (e.g. Master Bath Tub, Balcony Garden)..."
                value={amenityInput}
                onChange={(e) => setAmenityInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddCustomFeature();
                  }
                }}
                className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:border-[#00062A]"
              />
              <button
                type="button"
                onClick={handleAddCustomFeature}
                className="px-5 py-2.5 rounded-xl bg-[#00062A] text-white text-xs font-bold hover:bg-[#00062A]/90 transition cursor-pointer border-none"
              >
                + Add Feature
              </button>
            </div>

            {/* Selected Feature Tags */}
            <div className="flex flex-wrap gap-2 pt-2">
              {formData.amenities.map((item) => (
                <span
                  key={item}
                  className="px-3 py-1 rounded-full bg-[#00062A]/10 text-[#00062A] border border-[#00062A]/20 text-xs font-bold flex items-center gap-1.5"
                >
                  {item}
                  <button
                    type="button"
                    onClick={() => handleRemoveFeature(item)}
                    className="text-[#00062A] hover:text-rose-600 cursor-pointer border-none bg-transparent font-black"
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
            href="/dashboard/flats"
            className="px-6 py-3 rounded-xl border border-slate-300 text-slate-700 text-xs font-extrabold hover:bg-slate-100 transition"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={submitting}
            className="px-8 py-3 rounded-xl bg-[#00062A] hover:bg-[#00062A]/90 text-white text-xs font-extrabold shadow-lg shadow-[#00062A]/10 transition active:scale-98 disabled:opacity-50 cursor-pointer border-none"
          >
            {submitting ? "Saving Flat..." : "Submit & Save Flat"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateFlatMainView;
