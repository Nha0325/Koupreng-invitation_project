import { IoMusicalNotes, IoPause } from "react-icons/io5";

/**
 * TemplateMusicControl — floating play/pause for background music.
 *
 * Rules honored:
 *  - Never autoplays. Starts paused; only plays on user interaction.
 *  - Respects browser autoplay restrictions (play() is awaited + caught).
 *  - Hidden entirely when no track is provided.
 */
export default function TemplateMusicControl({ controller }) {
    if (!controller?.hasMusic) return null;

    const { playing, status, toggle } = controller;

    return (
        <>
            <button
                type="button"
                className={`tx-music${playing ? " is-playing" : ""}`}
                onClick={toggle}
                aria-pressed={playing}
                aria-label={playing ? "បិទតន្ត្រី" : "បើកតន្ត្រី"}
                data-music-status={status}
            >
                <span className="tx-music__icon" aria-hidden="true">
                    {playing ? <IoPause /> : <IoMusicalNotes />}
                </span>
                <span className="tx-music__pulse" aria-hidden="true" />
            </button>
        </>
    );
}
