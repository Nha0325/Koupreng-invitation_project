import { useRef, useState, useEffect } from "react";
import { Music, VolumeX } from "lucide-react";

export default function FloatingAudioPlayer({
  src,
  autoPlay = false,
  className = "",
  position = { bottom: "24px", right: "24px" },
}) {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const toggle = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false));
    }
  };

  useEffect(() => {
    if (autoPlay && audioRef.current) {
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false));
    }
  }, [autoPlay]);

  if (!src) return null;

  return (
    <>
      <audio ref={audioRef} src={src} loop preload="none" />
      <button
        type="button"
        onClick={toggle}
        aria-label={isPlaying ? "Mute music" : "Play music"}
        className={`floating-audio-btn ${className}`}
        style={{
          position: "fixed",
          zIndex: 99,
          width: "46px",
          height: "46px",
          borderRadius: "50%",
          border: "1px solid rgba(255, 255, 255, 0.25)",
          background: "rgba(20, 20, 20, 0.75)",
          backdropFilter: "blur(10px)",
          color: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          boxShadow: "0 8px 24px rgba(0,0,0,0.35)",
          transition: "transform 0.2s ease",
          ...position,
        }}
      >
        {isPlaying ? (
          <Music size={20} className="animate-spin-slow" />
        ) : (
          <VolumeX size={20} style={{ opacity: 0.7 }} />
        )}
      </button>
    </>
  );
}
