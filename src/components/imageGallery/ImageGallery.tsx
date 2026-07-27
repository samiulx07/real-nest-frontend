"use client";

import React, { useState } from "react";
import Lightbox from "yet-another-react-lightbox";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import Counter from "yet-another-react-lightbox/plugins/counter";
import Fullscreen from "yet-another-react-lightbox/plugins/fullscreen";

import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/thumbnails.css";
import "yet-another-react-lightbox/plugins/counter.css";

interface ImageGalleryProps {
  images: string[];
  /** How many thumbnails to show in the preview grid (default: all) */
  previewCount?: number;
}

const ImageGallery: React.FC<ImageGalleryProps> = ({ images, previewCount }) => {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);

  if (!images || images.length === 0) return null;

  const displayImages = previewCount ? images.slice(0, previewCount) : images;
  const remaining = previewCount ? images.length - previewCount : 0;

  const slides = images.map((src) => ({ src }));

  return (
    <>
      {/* Thumbnail Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            images.length === 1
              ? "1fr"
              : images.length === 2
              ? "1fr 1fr"
              : "repeat(auto-fill, minmax(160px, 1fr))",
          gap: "8px",
          borderRadius: "12px",
          overflow: "hidden",
        }}
      >
        {displayImages.map((src, i) => (
          <div
            key={i}
            onClick={() => {
              setIndex(i);
              setOpen(true);
            }}
            style={{
              position: "relative",
              aspectRatio: i === 0 && images.length > 2 ? "16/9" : "4/3",
              gridColumn: i === 0 && images.length > 2 ? "1 / -1" : undefined,
              cursor: "pointer",
              overflow: "hidden",
              borderRadius: "10px",
            }}
          >
            <img
              src={src}
              alt={`Image ${i + 1}`}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                transition: "transform 0.3s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
            />
            {/* "Show more" overlay on the last visible image */}
            {remaining > 0 && i === displayImages.length - 1 && (
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "rgba(0, 0, 0, 0.55)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#fff",
                  fontSize: "22px",
                  fontWeight: 700,
                  letterSpacing: "0.5px",
                }}
              >
                +{remaining} more
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Lightbox */}
      <Lightbox
        open={open}
        close={() => setOpen(false)}
        index={index}
        slides={slides}
        plugins={[Thumbnails, Zoom, Counter, Fullscreen]}
        counter={{ container: { style: { top: "unset", bottom: 0 } } }}
        thumbnails={{ position: "bottom", width: 80, height: 60, gap: 6, borderRadius: 6 }}
        zoom={{ maxZoomPixelRatio: 4 }}
        styles={{
          container: { backgroundColor: "rgba(0, 6, 42, 0.92)" },
        }}
      />
    </>
  );
};

export default ImageGallery;
