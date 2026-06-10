import { useEffect, useRef, useState } from "react";
import { IoMusicalNotes, IoPause } from "react-icons/io5";

/**
 * TemplateMusicControl — floating play/pause for background music.
 *
 * Rules honored:
 *  - Never autoplays. Starts paused; only plays on user interaction.
 *  - Respects browser autoplay restrictions (play() is awaited + caught).
 *  - Hidden entirely when no track is provided.
 */
export default function TemplateMusicControl({ src }) {
    const audioRef = useRef(null);
    const [playing, setPlaying] = useState(false);

    useEffect(() => {
        const audio = audioRef.current;
        return () => {
            if (audio) audio.pause();
        };
    }, [src]);

    if (!src) return null;

    const toggle = async () => {
        const audio = audioRef.current;
        if (!audio) return;

        if (!audio.paused) {
            audio.pause();
            setPlaying(false);
            return;
        }

        audio.volume = 0.5;
        try {
            await audio.play();
            setPlaying(true);
        } catch {
            setPlaying(false);
        }
    };

    return (
        <>
            <audio ref={audioRef} src={src} loop preload="none" />
            <button
                type="button"
                className={`tx-music${playing ? " is-playing" : ""}`}
                onClick={toggle}
                aria-pressed={playing}
                aria-label={playing ? "បិទតន្ត្រី" : "បើកតន្ត្រី"}
            >
                <span className="tx-music__icon" aria-hidden="true">
                    {playing ? <IoPause /> : <IoMusicalNotes />}
                </span>
                <span className="tx-music__pulse" aria-hidden="true" />
            </button>
        </>
    );
}
