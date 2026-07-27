"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import instance from "@/services/baseServices";
import { toast } from "react-toastify";
import {
  HiOutlineCloudArrowUp,
  HiOutlineXMark,
  HiOutlineCheck,
  HiOutlinePhoto,
  HiOutlineSparkles,
} from "react-icons/hi2";

interface MediaItem {
  id: string;
  fileName: string;
  fileUrl: string;
  fileSize: number | null;
  mimeType: string | null;
  folder: string;
  createdAt: string;
}

interface MediaPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (urls: string[]) => void;
  multiple?: boolean;
  folder?: string;
  selectedUrls?: string[];
}

const MediaPickerModal: React.FC<MediaPickerModalProps> = ({
  isOpen,
  onClose,
  onSelect,
  multiple = true,
  folder = "general",
  selectedUrls = [],
}) => {
  const [mediaList, setMediaList] = useState<MediaItem[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set(selectedUrls));
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchMedia = useCallback(async () => {
    setLoading(true);
    try {
      const res = await instance.get("/media", {
        params: { page, limit: 24, folder, sortBy: "createdAt", sortOrder: "desc" },
      });
      if (res.data.success) {
        setMediaList(res.data.data);
        setTotalPages(res.data.meta?.totalPages || 1);
      }
    } catch {
      toast.error("Failed to fetch media assets");
    } finally {
      setLoading(false);
    }
  }, [page, folder]);

  useEffect(() => {
    if (isOpen) {
      fetchMedia();
      setSelected(new Set(selectedUrls));
    }
  }, [isOpen, fetchMedia, selectedUrls]);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) return;
      setUploading(true);
      try {
        for (const file of acceptedFiles) {
          const formData = new FormData();
          formData.append("file", file);
          formData.append("folder", folder);

          await instance.post("/media/upload", formData, {
            headers: { "Content-Type": "multipart/form-data" },
          });
        }
        toast.success(`Uploaded ${acceptedFiles.length} file(s)`);
        fetchMedia();
      } catch {
        toast.error("Upload failed");
      } finally {
        setUploading(false);
      }
    },
    [folder, fetchMedia]
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

  const toggleSelect = (url: string) => {
    const next = new Set(selected);
    if (next.has(url)) {
      next.delete(url);
    } else {
      if (!multiple) next.clear();
      next.add(url);
    }
    setSelected(next);
  };

  const handleUseSelected = () => {
    onSelect(Array.from(selected));
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#00062A]/70 backdrop-blur-md transition-opacity"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-white">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-[#FF4C00]/10 text-[#FF4C00] flex items-center justify-center">
              <HiOutlinePhoto className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-[#00062A]">Media Selector</h3>
              <p className="text-xs text-slate-400 font-semibold uppercase">Folder: {folder}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer border-none bg-transparent"
          >
            <HiOutlineXMark className="w-5 h-5" />
          </button>
        </div>

        {/* Upload Dropzone */}
        <div className="p-6 border-b border-slate-100 bg-slate-50/50">
          <div
            {...getRootProps()}
            className={`p-6 rounded-2xl border-2 border-dashed text-center transition-all cursor-pointer ${
              isDragActive
                ? "border-[#FF4C00] bg-[#FF4C00]/5"
                : "border-slate-300 bg-white hover:border-[#FF4C00]/50"
            }`}
          >
            <input {...getInputProps()} />
            <div className="flex items-center justify-center gap-3">
              <HiOutlineCloudArrowUp className="w-6 h-6 text-[#FF4C00]" />
              <span className="text-xs font-bold text-slate-700">
                {uploading
                  ? "Uploading..."
                  : isDragActive
                  ? "Drop images here!"
                  : "Drag & drop new images here, or click to upload directly"}
              </span>
            </div>
          </div>
        </div>

        {/* Media Grid Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="text-center py-12 text-xs font-bold text-slate-400">
              Loading library...
            </div>
          ) : mediaList.length === 0 ? (
            <div className="text-center py-12 space-y-2">
              <HiOutlinePhoto className="w-10 h-10 text-slate-300 mx-auto" />
              <p className="text-xs font-bold text-slate-500">No media uploaded in this folder.</p>
            </div>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
              {mediaList.map((item) => {
                const isSelected = selected.has(item.fileUrl);
                return (
                  <div
                    key={item.id}
                    onClick={() => toggleSelect(item.fileUrl)}
                    className={`relative aspect-square rounded-xl overflow-hidden cursor-pointer border-2 transition-all ${
                      isSelected
                        ? "border-[#FF4C00] ring-2 ring-[#FF4C00]/30 shadow-md scale-[0.98]"
                        : "border-slate-200 hover:border-slate-300 opacity-90 hover:opacity-100"
                    }`}
                  >
                    <img
                      src={item.fileUrl}
                      alt={item.fileName}
                      className="w-full h-full object-cover"
                    />
                    {isSelected && (
                      <div className="absolute top-1.5 right-1.5 w-6 h-6 bg-[#FF4C00] text-white rounded-full flex items-center justify-center shadow-md">
                        <HiOutlineCheck className="w-3.5 h-3.5" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 bg-slate-50/50">
          <span className="text-xs font-bold text-slate-600">
            {selected.size} image(s) selected
          </span>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-100 transition cursor-pointer bg-white"
            >
              Cancel
            </button>
            <button
              onClick={handleUseSelected}
              disabled={selected.size === 0}
              className="px-6 py-2.5 rounded-xl bg-[#FF4C00] hover:bg-[#e04300] text-white text-xs font-extrabold shadow-md shadow-[#FF4C00]/20 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer border-none"
            >
              Attach Selected
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MediaPickerModal;
