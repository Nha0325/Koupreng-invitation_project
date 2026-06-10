import { OPENING_VIDEO_OPTIONS } from "../data/openingVideos";
import "./OpeningVideoPicker.css";

export function OpeningVideoPicker({ value, onChange }) {
    const selectedId = value?.id || null;
    const noVideoSelected = !selectedId;

    return (
        <div className="ovp-grid">
            <button
                type="button"
                className={`ovp-card ovp-card-empty${noVideoSelected ? " selected" : ""}`}
                onClick={() => onChange(null)}
                aria-pressed={noVideoSelected}
            >
                <span className="ovp-video-wrap ovp-video-wrap-empty">
                    <span className="ovp-empty-mark">OFF</span>
                    {noVideoSelected && <span className="ovp-selected-mark">✓</span>}
                </span>
                <span className="ovp-copy">
                    <span className="ovp-name">មិនប្រើវីដេអូ</span>
                    <span className="ovp-desc">No opening video</span>
                </span>
            </button>
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
