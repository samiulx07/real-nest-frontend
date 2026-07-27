"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
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

interface EditFlatMainViewProps {
  flatId?: string;
}

export const EditFlatMainView: React.FC<EditFlatMainViewProps> = ({
  flatId: propId,
}) => {
  const router = useRouter();
  const urlParams = useParams();
  const flatId = propId || (urlParams?.id as string);
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [mediaPickerOpen, setMediaPickerOpen] = useState(false);

  const [formData, setFormData] = useState({
    propertyId: "",
    title: "",
    flatNumber: "",
    floorNumber: 1,
    beds: 3,
    baths: 3,
    kitchens: 1,
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
    amenities: [] as string[],
    isFeatured: false,
    isPublished: true,
  });

  const [amenityInput, setAmenityInput] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch properties list
        const propRes = await instance.get("/properties?limit=100");
        if (propRes.data?.success) {
          setProperties(propRes.data.data || []);
        }

        // Fetch flat details
        const flatRes = await instance.get(`/flats/${flatId}`);
        if (flatRes.data?.success && flatRes.data?.data) {
          const data = flatRes.data.data;
          setFormData({
            propertyId: data.propertyId || "",
            title: data.title || "",
            flatNumber: data.flatNumber || "",
            floorNumber: data.floorNumber || 1,
            beds: data.beds || 1,
            baths: data.baths || 1,
            kitchens: data.kitchens || 1,
            balconies: data.balconies || 0,
            size: data.size ? Number(data.size) : 0,
            price: data.price ? Number(data.price) : 0,
            status: data.status || "AVAILABLE",
            furnishing: data.furnishing || "Semi-Furnished",
            facing: data.facing || "South",
            floorType: data.floorType || "Tiles",
            hasGasLine: Boolean(data.hasGasLine),
            hasWaterSupply: data.hasWaterSupply !== undefined ? Boolean(data.hasWaterSupply) : true,
            completionDate: data.completionDate ? data.completionDate.split("T")[0] : "",
            description: data.description || "",
            imageUrls: Array.isArray(data.imageUrls) ? data.imageUrls : [],
            amenities: Array.isArray(data.amenities) ? data.amenities : [],
            isFeatured: Boolean(data.isFeatured),
            isPublished: Boolean(data.isPublished),
          });
        }
      } catch (err: any) {
        toast.error(err?.response?.data?.message || "Failed to load flat unit details.");
      } finally {
        setLoading(false);
      }
    };

    if (flatId) {
      fetchData();
    }
  }, [flatId]);

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
        kitchens: Number(formData.kitchens),
        balconies: Number(formData.balconies),
        size: Number(formData.size),
        price: Number(formData.price),
      };

      const res = await instance.patch(`/flats/${flatId}`, payload);
      if (res.data?.success) {
        toast.success("Flat unit specifications updated successfully!");
        router.push("/dashboard/flats");
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to update flat unit.");
    } finally {
      setSubmitting(false);
    }
  };


  if (loading) {
    return (
      <div className="py-12 text-center text-xs font-bold text-slate-400">
        Loading flat unit details for editing...
      </div>
    );
  }

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
            <span>Edit Flat Unit</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Update flat specifications, pricing, status, and features.
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
                onChange={handleChange}
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold focus:outline-none focus:border-[#FF4C00] bg-white"
              >
                {properties.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.title} ({p.area}, {p.city})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5 mb-1">
                <HiOutlineHome className="w-3.5 h-3.5 text-[#00062A]" />
                <span>Flat Title *</span>
              </label>
              <input
                type="text"
                name="title"
                placeholder="e.g. SN-4A - Luxury Suite"
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
                onChange={(val) => setFormData((prev) => ({ ...prev, floorNumber: val }))}
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
                <HiOutlineHome className="w-3.5 h-3.5 text-slate-400" />
                <span>Kitchens</span>
              </label>
              <CreatableNumberSelect
                value={formData.kitchens}
                onChange={(val) => setFormData((prev) => ({ ...prev, kitchens: val }))}
                placeholder="Kitchens"
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

            <div className="flex items-center gap-4 sm:col-span-2 pt-5">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700">
                <input
                  type="checkbox"
                  name="hasGasLine"
                  checked={formData.hasGasLine}
                  onChange={handleChange}
                  className="w-4 h-4 text-[#FF4C00] rounded border-slate-300 focus:ring-[#FF4C00]"
                />
                <span>Gas Line Connected</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700">
                <input
                  type="checkbox"
                  name="hasWaterSupply"
                  checked={formData.hasWaterSupply}
                  onChange={handleChange}
                  className="w-4 h-4 text-[#FF4C00] rounded border-slate-300 focus:ring-[#FF4C00]"
                />
                <span>24/7 Water Supply</span>
              </label>
            </div>
          </div>
        </div>

        {/* Section 2B: Flat Unit Images */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
          <h3 className="text-sm font-black text-[#FF4C00] uppercase tracking-wider pb-2 border-b border-slate-100 flex items-center gap-2">
            <HiOutlinePhoto className="w-5 h-5" />
            <span>Flat Unit Images</span>
          </h3>

          {/* Selected Images Preview */}
          {formData.imageUrls.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {formData.imageUrls.map((url, idx) => (
                <div key={idx} className="relative aspect-video rounded-xl overflow-hidden border border-slate-200 group">
                  <img src={url} alt={`Flat ${idx + 1}`} className="w-full h-full object-cover" />
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
            {submitting ? "Updating Flat..." : "Update Flat"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditFlatMainView;
