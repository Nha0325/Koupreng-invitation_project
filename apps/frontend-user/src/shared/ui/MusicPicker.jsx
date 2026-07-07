import { useRef, useState, useEffect } from "react";
import {
    IoCloseOutline,
    IoMusicalNotesOutline,
    IoPause,
    IoPlay,
    IoVolumeMuteOutline,
} from "react-icons/io5";
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
    const selectedId = value?.id || MUSIC_TRACKS[0]?.id;
    const hasBuiltInSelection = MUSIC_TRACKS.some((track) => track.id === selectedId);
    const customTrack = value?.url && !hasBuiltInSelection
        ? {
            id: value.id || "custom-music",
            name: value.name || "Custom song",
            description: value.description || "Uploaded from your device",
            url: value.url,
            isCustom: true,
        }
        : null;
    const tracks = customTrack ? [customTrack, ...MUSIC_TRACKS] : MUSIC_TRACKS;

    const stopAudio = () => {
        audioRef.current?.pause();
        audioRef.current = null;
        setPlayingId(null);
    };

    useEffect(() => {
        return () => {
            audioRef.current?.pause();
        };
    }, []);

    const togglePlay = (track, e) => {
        e.stopPropagation();
        if (!track.url) return;

        if (playingId === track.id) {
            stopAudio();
            return;
        }

        stopAudio();

        const audio = new Audio(track.url);
        audio.volume = 0.5;
        audio.play().then(() => {
            setPlayingId(track.id);
        }).catch(() => { });

        audio.onended = () => setPlayingId(null);
        audioRef.current = audio;
    };

    const selectTrack = (track) => {
        onChange({ id: track.id, name: track.name, description: track.description, url: track.url });
    };

    const clearCustomTrack = (e) => {
        e.stopPropagation();
        stopAudio();
        onChange(MUSIC_TRACKS[0]);
    };

    return (
        <div className="mp-wrap">
            {tracks.map((track) => (
                <div
                    key={track.id}
                    className={`mp-track${selectedId === track.id ? " selected" : ""}`}
                >
                    <button
                        type="button"
                        className="mp-track-select"
                        onClick={() => selectTrack(track)}
                        aria-pressed={selectedId === track.id}
                    >
                        <span className="mp-track-icon" aria-hidden="true">
                            {track.url ? <IoMusicalNotesOutline /> : <IoVolumeMuteOutline />}
                        </span>
                        <span className="mp-track-info">
                            <span className="mp-track-name">
                                <span className="mp-track-title">{track.name}</span>
                                {track.isCustom && <span className="mp-custom-badge">Custom</span>}
                            </span>
                            <span className="mp-track-desc">{track.description}</span>
                        </span>
                    </button>
                    <div className="mp-track-actions">
                        {track.url && (
                            <button
                                type="button"
                                className={`mp-play-btn${playingId === track.id ? " playing" : ""}`}
                                onClick={(e) => togglePlay(track, e)}
                                aria-label={playingId === track.id ? "Pause" : "Play"}
                            >
                                {playingId === track.id ? <IoPause aria-hidden="true" /> : <IoPlay aria-hidden="true" />}
                            </button>
                        )}
                        {track.isCustom && (
                            <button
                                type="button"
                                className="mp-remove-btn"
                                onClick={clearCustomTrack}
                                aria-label="Remove custom song"
                            >
                                <IoCloseOutline aria-hidden="true" />
                            </button>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}

export default MusicPicker;
