import { useState, useEffect, useCallback } from "react";
import { IoClose, IoCameraOutline } from "react-icons/io5";

export default function GalleryGrid({
  images = [],
  className = "",
  itemClassName = "",
  onImageClick,
  emptyMessage = "រូបភាពអនុស្សាវរីយ៍នឹងបង្ហាញនៅទីនេះ",
}) {
  const [lightboxIndex, setLightboxIndex] = useState(null);

  const handleClose = useCallback(() => setLightboxIndex(null), []);

  useEffect(() => {
    if (lightboxIndex === null) return;
    const handleKey = (e) => {
      if (e.key === "Escape") handleClose();
      if (e.key === "ArrowRight" && lightboxIndex < images.length - 1) {
        setLightboxIndex((prev) => prev + 1);
      }
      if (e.key === "ArrowLeft" && lightboxIndex > 0) {
        setLightboxIndex((prev) => prev - 1);
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [lightboxIndex, images.length, handleClose]);

  if (!images || images.length === 0) {
    return (
      <div className="gallery-empty-state" style={{ textAlign: "center", padding: "32px 16px", color: "rgba(255,255,255,0.6)" }}>
        <IoCameraOutline size={32} style={{ margin: "0 auto 8px" }} />
        <p style={{ fontSize: "14px", margin: 0 }}>{emptyMessage}</p>
      </div>
    );
  }

  return (
    <>
      <div className={`gallery-grid-root ${className}`}>
        {images.map((img, idx) => {
          const src = typeof img === "string" ? img : img.src;
          const alt = (typeof img === "object" && img.alt) ? img.alt : `Photo ${idx + 1}`;
          return (
            <div
              key={`${src}-${idx}`}
              className={`gallery-item ${itemClassName}`}
              onClick={() => {
                if (onImageClick) {
                  onImageClick(idx, img);
                } else {
                  setLightboxIndex(idx);
                }
              }}
              style={{ cursor: "pointer" }}
            >
              <img
                src={src}
                alt={alt}
                loading="lazy"
                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
              />
            </div>
          );
        })}
      </div>

      {lightboxIndex !== null && (
        <div
          className="gallery-lightbox-overlay"
          onClick={handleClose}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            backgroundColor: "rgba(0, 0, 0, 0.9)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
          }}
        >
          <button
            type="button"
            onClick={handleClose}
            aria-label="Close Lightbox"
            style={{
              position: "absolute",
              top: "20px",
              right: "20px",
              background: "rgba(255,255,255,0.2)",
              border: "none",
              borderRadius: "50%",
              width: "44px",
              height: "44px",
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
            }}
          >
            <IoClose size={28} />
          </button>
          <img
            src={typeof images[lightboxIndex] === "string" ? images[lightboxIndex] : images[lightboxIndex].src}
            alt="Enlarged wedding moment"
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: "90vw",
              maxHeight: "85vh",
              objectFit: "contain",
              borderRadius: "8px",
              boxShadow: "0 20px 50px rgba(0,0,0,0.5)",
            }}
          />
        </div>
      )}
    </>
  );
}
