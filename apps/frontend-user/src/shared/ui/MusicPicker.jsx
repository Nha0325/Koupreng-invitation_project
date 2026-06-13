import { useRef, useState, useEffect } from "react";
import { MUSIC_TRACKS } from "../data/musicTracks";
import "./MusicPicker.css";

/**
 * MusicPicker — choose a background music track for the invitation.
 * Allows preview play/pause for each track.
 * Emits: { id, name, url }
 */
export function MusicPicker({ value, onChange }) {
    const [playingId, setPlayingId] = useState(null);
    const audioRef = useRef(null);
    const selectedId = value?.id || "instrumental-wedding";

    useEffect(() => {
        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current = null;
            }
        };
    }, []);

    const togglePlay = (track, e) => {
        e.stopPropagation();
        if (!track.url) return;

        if (playingId === track.id) {
            audioRef.current?.pause();
            setPlayingId(null);
            return;
        }

        if (audioRef.current) {
            audioRef.current.pause();
        }

        const audio = new Audio(track.url);
        audio.volume = 0.5;
        audio.play().then(() => {
            setPlayingId(track.id);
        }).catch(() => { });

        audio.onended = () => setPlayingId(null);
        audioRef.current = audio;
    };

    const selectTrack = (track) => {
        onChange({ id: track.id, name: track.name, url: track.url });
    };

    return (
        <div className="mp-wrap">
            {MUSIC_TRACKS.map((track) => (
                <button
                    key={track.id}
                    type="button"
                    className={`mp-track${selectedId === track.id ? " selected" : ""}`}
                    onClick={() => selectTrack(track)}
                >
                    <div className="mp-track-icon">
                        {track.url ? "🎵" : "🔇"}
                    </div>
                    <div className="mp-track-info">
                        <div className="mp-track-name">{track.name}</div>
                        <div className="mp-track-desc">{track.description}</div>
                    </div>
                    {track.url && (
                        <button
                            type="button"
                            className={`mp-play-btn${playingId === track.id ? " playing" : ""}`}
                            onClick={(e) => togglePlay(track, e)}
                            aria-label={playingId === track.id ? "Pause" : "Play"}
                        >
                            {playingId === track.id ? "❚❚" : "▶"}
                        </button>
                    )}
                </button>
            ))}
        </div>
    );
}

export default MusicPicker;
