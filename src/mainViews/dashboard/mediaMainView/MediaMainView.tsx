"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { toast } from "react-toastify";
import instance from "@/services/baseServices";
import { confirmDelete } from "@/utils/confirmAlert";
import { useRootContext } from "@/contexts/RootContext";
import {
  HiOutlineCloudArrowUp,
  HiOutlineTrash,
  HiOutlinePhoto,
  HiOutlineFunnel,
  HiOutlineCheck,
  HiOutlineFolder,
  HiOutlineArrowPath,
  HiOutlineMagnifyingGlass,
  HiOutlineSparkles,
  HiOutlineEye,
  HiOutlineXMark,
} from "react-icons/hi2";

interface MediaItem {
  id: string;
  fileName: string;
  fileUrl: string;
  fileSize: number | null;
  mimeType: string | null;
  folder: string;
  createdAt: string;
  user?: {
    id: string;
    fullName: string;
    email: string;
  };
}

const FOLDER_TABS = [
  { value: "", label: "All Assets", icon: HiOutlinePhoto },
  { value: "properties", label: "Properties", icon: HiOutlineFolder },
  { value: "flats", label: "Flats & Units", icon: HiOutlineFolder },
  { value: "profiles", label: "Profiles", icon: HiOutlineFolder },
  { value: "general", label: "General", icon: HiOutlineFolder },
];

export const MediaMainView = () => {
  const { user } = useRootContext();
  const isCustomer = user?.role === "CUSTOMER";

  const [mediaList, setMediaList] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [activeFolder, setActiveFolder] = useState("");
  const [search, setSearch] = useState("");
  const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchMedia = useCallback(async () => {
    setLoading(true);
    try {
      const params: any = { page, limit: 24, sortBy: "createdAt", sortOrder: "desc" };
      if (activeFolder) params.folder = activeFolder;
      if (search.trim()) params.search = search.trim();

      const res = await instance.get("/media", { params });
      if (res.data.success) {
        setMediaList(res.data.data);
        setTotalPages(res.data.meta?.totalPages || 1);
        setTotal(res.data.meta?.total || 0);
      }
    } catch {
      toast.error("Failed to fetch media assets");
    } finally {
      setLoading(false);
    }
  }, [page, activeFolder, search]);

  useEffect(() => {
    fetchMedia();
  }, [fetchMedia]);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) return;
      setUploading(true);
      try {
        let uploaded = 0;
        const targetFolder = isCustomer ? "profiles" : activeFolder || "general";

        for (const file of acceptedFiles) {
          const formData = new FormData();
          formData.append("file", file);
          formData.append("folder", targetFolder);

          await instance.post("/media/upload", formData, {
            headers: { "Content-Type": "multipart/form-data" },
          });
          uploaded++;
        }
        toast.success(`Uploaded ${uploaded} media asset(s) successfully`);
        setPage(1);
        fetchMedia();
      } catch {
        toast.error("Upload failed. Make sure SUPABASE_SERVICE_ROLE_KEY is set in backend .env");
      } finally {
        setUploading(false);
      }
    },
    [activeFolder, fetchMedia]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/jpeg": [],
      "image/png": [],
      "image/webp": [],
      "image/gif": [],
      "image/svg+xml": [],
    },
    multiple: true,
  });

  const toggleSelect = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedIds(next);
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === mediaList.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(mediaList.map((m) => m.id)));
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedIds.size === 0) return;
    const confirmed = await confirmDelete({
      title: "Delete Selected Media?",
      text: `Are you sure you want to delete ${selectedIds.size} selected file(s)?`,
      confirmButtonText: `Yes, Delete ${selectedIds.size} File(s)`,
    });
    if (!confirmed) return;

    try {
      if (selectedIds.size === 1) {
        const id = Array.from(selectedIds)[0];
        await instance.delete(`/media/${id}`);
      } else {
        await instance.post("/media/bulk-delete", { ids: Array.from(selectedIds) });
      }
      toast.success(`Deleted ${selectedIds.size} file(s)`);
      setSelectedIds(new Set());
      fetchMedia();
    } catch {
      toast.error("Delete failed");
    }
  };

  const handleDeleteSingle = async (id: string) => {
    const confirmed = await confirmDelete({
      title: "Delete Media Asset?",
      text: "This image will be permanently removed from storage.",
      confirmButtonText: "Yes, Delete Media",
    });
    if (!confirmed) return;

    try {
      await instance.delete(`/media/${id}`);
      toast.success("Media deleted");
      fetchMedia();
    } catch {
      toast.error("Delete failed");
    }
  };

  const formatFileSize = (bytes: number | null) => {
    if (!bytes) return "Unknown size";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header Banner Card */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF4C00]/10 text-[#FF4C00] text-xs font-black uppercase tracking-wider mb-2">
            <HiOutlineSparkles className="w-3.5 h-3.5" />
            <span>Digital Asset Manager</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#00062A] tracking-tight flex items-center gap-3">
            <HiOutlinePhoto className="w-8 h-8 text-[#FF4C00]" />
            <span>Media Gallery</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
            Upload, browse, organize, and manage your property images and assets ({total} total items).
          </p>
        </div>

        <button
          onClick={fetchMedia}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 hover:border-slate-300 transition cursor-pointer"
        >
          <HiOutlineArrowPath className={`w-4 h-4 ${loading ? "animate-spin text-[#FF4C00]" : ""}`} />
          <span>Refresh Library</span>
        </button>
      </div>

      {/* Hero Upload Dropzone Card */}
      <div
        {...getRootProps()}
        className={`relative overflow-hidden rounded-3xl border-2 border-dashed transition-all duration-300 cursor-pointer p-8 sm:p-10 text-center ${
          isDragActive
            ? "border-[#FF4C00] bg-[#FF4C00]/5 scale-[0.99]"
            : "border-slate-200 bg-white hover:border-[#FF4C00]/50 hover:bg-slate-50/50 shadow-sm"
        }`}
      >
        <input {...getInputProps()} />

        <div className="flex flex-col items-center justify-center max-w-lg mx-auto space-y-3">
          <div
            className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-transform duration-300 ${
              isDragActive
                ? "bg-[#FF4C00] text-white scale-110 shadow-lg shadow-[#FF4C00]/30"
                : "bg-[#00062A] text-white shadow-md"
            }`}
          >
            <HiOutlineCloudArrowUp className="w-8 h-8" />
          </div>

          <div>
            <h3 className="text-base font-bold text-[#00062A]">
              {uploading
                ? "Uploading files to cloud..."
                : isDragActive
                ? "Drop your media files here..."
                : "Click or drag & drop files to upload"}
            </h3>
            <p className="text-xs text-slate-500 font-medium mt-1">
              Upload images directly to Supabase storage. Supports JPEG, PNG, WebP, GIF, SVG up to 10MB per file.
            </p>
          </div>

          {!isCustomer && (
            <div className="flex items-center gap-2 pt-1">
              <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-[11px] font-bold">
                Target Folder: <span className="text-[#FF4C00] capitalize">{activeFolder || "General"}</span>
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Filter Tabs & Toolbar Card */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
          {/* Folder Filter Tabs (Only shown to Admin / Staff) */}
          {!isCustomer ? (
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0 scrollbar-none">
              <HiOutlineFunnel className="w-4 h-4 text-slate-400 shrink-0 mr-1" />
              {FOLDER_TABS.map((tab) => {
                const isActive = activeFolder === tab.value;
                return (
                  <button
                    key={tab.value}
                    onClick={() => {
                      setActiveFolder(tab.value);
                      setPage(1);
                      setSelectedIds(new Set());
                    }}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer border-none ${
                      isActive
                        ? "bg-[#FF4C00] text-white shadow-md shadow-[#FF4C00]/20"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200/70 hover:text-slate-900"
                    }`}
                  >
                    <tab.icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
              <HiOutlinePhoto className="w-4 h-4 text-[#FF4C00]" />
              <span>My Uploaded Profile Images & Media</span>
            </div>
          )}

          {/* Search Box & Bulk Actions */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Search Input */}
            <div className="relative flex-1 sm:flex-initial">
              <HiOutlineMagnifyingGlass className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search images..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="w-full sm:w-48 pl-9 pr-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:border-[#FF4C00]"
              />
            </div>

            {/* Select All */}
            {mediaList.length > 0 && (
              <button
                onClick={toggleSelectAll}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition cursor-pointer ${
                  selectedIds.size === mediaList.length
                    ? "bg-[#00062A] text-white border-[#00062A]"
                    : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                }`}
              >
                {selectedIds.size === mediaList.length ? "Deselect All" : "Select All"}
              </button>
            )}

            {/* Bulk Delete */}
            {selectedIds.size > 0 && (
              <button
                onClick={handleDeleteSelected}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition shadow-md shadow-rose-600/20 cursor-pointer border-none"
              >
                <HiOutlineTrash className="w-4 h-4" />
                <span>Delete ({selectedIds.size})</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Media Grid Section */}
      {loading ? (
        <div className="bg-white rounded-3xl p-16 text-center border border-slate-200/80">
          <HiOutlineArrowPath className="w-8 h-8 text-[#FF4C00] animate-spin mx-auto mb-3" />
          <p className="text-xs font-bold text-slate-500">Fetching media assets...</p>
        </div>
      ) : mediaList.length === 0 ? (
        /* Styled Empty State Card */
        <div className="bg-white rounded-3xl p-16 text-center border border-slate-200/80 shadow-sm flex flex-col items-center justify-center space-y-4">
          <div className="w-20 h-20 rounded-3xl bg-slate-100 flex items-center justify-center text-slate-400">
            <HiOutlinePhoto className="w-10 h-10" />
          </div>
          <div className="max-w-md">
            <h3 className="text-base font-extrabold text-[#00062A]">No Media Found</h3>
            <p className="text-xs text-slate-500 font-medium mt-1">
              {activeFolder
                ? `No images found in the "${activeFolder}" folder. Use the dropzone above to upload your first image.`
                : "No media assets have been uploaded yet. Drag and drop your images above to get started."}
            </p>
          </div>
        </div>
      ) : (
        /* Image Grid */
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {mediaList.map((item) => {
            const isSelected = selectedIds.has(item.id);

            return (
              <div
                key={item.id}
                className={`group relative bg-white rounded-2xl overflow-hidden border transition-all duration-200 ${
                  isSelected
                    ? "border-[#FF4C00] ring-2 ring-[#FF4C00]/20 shadow-md"
                    : "border-slate-200/80 hover:border-slate-300 hover:shadow-md"
                }`}
              >
                {/* Thumbnail Container */}
                <div
                  className="aspect-square relative overflow-hidden bg-slate-100 cursor-pointer"
                  onClick={() => {
                    if (selectedIds.size > 0) {
                      // In Selection Mode: clicking anywhere toggles selection
                      toggleSelect(item.id);
                    } else {
                      // Normal Mode: clicking image opens fullsize lightbox preview
                      setPreviewImageUrl(item.fileUrl);
                    }
                  }}
                >
                  <img
                    src={item.fileUrl}
                    alt={item.fileName}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />

                  {/* Selection Checkbox Pill (Clicking checkbox directly ALWAYS toggles selection) */}
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleSelect(item.id);
                    }}
                    className={`absolute top-2 left-2 w-6 h-6 rounded-lg flex items-center justify-center transition-all cursor-pointer ${
                      isSelected
                        ? "bg-[#FF4C00] text-white shadow-md scale-100 opacity-100"
                        : selectedIds.size > 0
                        ? "bg-white/90 text-slate-400 border border-slate-300 opacity-100"
                        : "bg-white/80 backdrop-blur-sm text-slate-400 border border-slate-300 opacity-0 group-hover:opacity-100"
                    }`}
                    title={isSelected ? "Deselect" : "Select"}
                  >
                    <HiOutlineCheck className="w-4 h-4" />
                  </div>

                  {/* Action Buttons Overlay */}
                  <div className="absolute top-2 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setPreviewImageUrl(item.fileUrl);
                      }}
                      className="p-1.5 rounded-lg bg-[#00062A]/80 backdrop-blur-sm text-white hover:bg-[#00062A] transition shadow-md border-none cursor-pointer"
                      title="View Full Size"
                    >
                      <HiOutlineEye className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteSingle(item.id);
                      }}
                      className="p-1.5 rounded-lg bg-rose-600/90 backdrop-blur-sm text-white hover:bg-rose-700 transition shadow-md border-none cursor-pointer"
                      title="Delete Image"
                    >
                      <HiOutlineTrash className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* File Details Bar */}
                <div className="p-2.5 border-t border-slate-100">
                  <p
                    className="text-[11px] font-bold text-slate-800 truncate"
                    title={item.fileName}
                  >
                    {item.fileName}
                  </p>
                  <div className="flex items-center justify-between mt-1 text-[10px] text-slate-400 font-semibold uppercase">
                    <span>{item.folder}</span>
                    <span>{formatFileSize(item.fileSize)}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination Footer */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-4">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
          >
            Previous
          </button>
          <span className="text-xs font-bold text-slate-500 px-3">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-4 py-2 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
          >
            Next
          </button>
        </div>
      )}
      {/* Single Image Fullscreen Preview Modal */}
      {previewImageUrl && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#00062A]/90 backdrop-blur-md transition-opacity"
          onClick={() => setPreviewImageUrl(null)}
        >
          {/* Close Button */}
          <button
            onClick={() => setPreviewImageUrl(null)}
            className="absolute top-6 right-6 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition cursor-pointer border-none"
            title="Close Preview"
          >
            <HiOutlineXMark className="w-6 h-6" />
          </button>

          {/* Fullsize Image Container */}
          <div
            className="relative max-w-5xl max-h-[90vh] rounded-2xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={previewImageUrl}
              alt="Full Preview"
              className="w-full h-full object-contain max-h-[85vh] rounded-2xl"
            />
          </div>
        </div>
      )}
    </div>
  );
};
