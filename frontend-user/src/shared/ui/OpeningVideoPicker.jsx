import { OPENING_VIDEO_OPTIONS } from "../data/openingVideos";
import "./OpeningVideoPicker.css";

export function OpeningVideoPicker({ value, onChange }) {
    const selectedId = value?.id || OPENING_VIDEO_OPTIONS[0].id;

    return (
        <div className="ovp-grid">
            {OPENING_VIDEO_OPTIONS.map((video) => {
                const selected = selectedId === video.id;

                return (
                    <button
                        key={video.id}
                        type="button"
                        className={`ovp-card${selected ? " selected" : ""}`}
                        onClick={() => onChange(video)}
                        aria-pressed={selected}
                    >
                        <span className="ovp-video-wrap">
                            <video
                                className="ovp-video"
                                src={video.url}
                                autoPlay
                                muted
                                loop
                                playsInline
                                preload="metadata"
                                aria-hidden="true"
                            />
                            {selected && <span className="ovp-selected-mark">✓</span>}
                        </span>
                        <span className="ovp-copy">
                            <span className="ovp-name">{video.name}</span>
                            <span className="ovp-desc">{video.description}</span>
                        </span>
                    </button>
                );
            })}
        </div>
    );
}

export default OpeningVideoPicker;
