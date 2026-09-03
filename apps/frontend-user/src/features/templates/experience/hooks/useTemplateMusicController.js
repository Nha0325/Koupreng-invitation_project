import { useCallback, useEffect, useMemo, useRef, useState } from "react";

export function useTemplateMusicController(src) {
    const audioRef = useRef(null);
    const sourceRef = useRef(src || "");
    const [status, setStatus] = useState(src ? "paused" : "missing");

    useEffect(() => {
        const audio = audioRef.current;
        sourceRef.current = src || "";
        setStatus(src ? "paused" : "missing");
        if (!audio) return undefined;

        audio.pause();
        audio.currentTime = 0;
        if (src) audio.load?.();

        return () => {
            audio.pause();
        };
    }, [src]);

    const play = useCallback(async () => {
        const audio = audioRef.current;
        if (!audio || !sourceRef.current) {
            setStatus("missing");
            return false;
        }

        audio.volume = 0.5;
        try {
            await audio.play();
            setStatus("playing");
            return true;
        } catch {
            setStatus("error");
            return false;
        }
    }, []);

    const pause = useCallback(() => {
        const audio = audioRef.current;
        if (!audio) return;
        audio.pause();
        setStatus(sourceRef.current ? "paused" : "missing");
    }, []);

    const toggle = useCallback(() => {
        const audio = audioRef.current;
        if (audio && !audio.paused) {
            pause();
            return Promise.resolve(false);
        }
        return play();
    }, [pause, play]);

    const controller = useMemo(() => ({
        hasMusic: Boolean(src),
        pause,
        play,
        playing: status === "playing",
        status,
        toggle,
    }), [pause, play, src, status, toggle]);

    return [audioRef, controller];
}

export default useTemplateMusicController;
