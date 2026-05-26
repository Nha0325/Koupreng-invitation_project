export const OPENING_VIDEO_OPTIONS = [
    {
        id: "opening-1",
        name: "វីដេអូ 1",
        description: "Opening style 1",
        url: "/vdo/1.mp4",
    },
    {
        id: "opening-2",
        name: "វីដេអូ 2",
        description: "Opening style 2",
        url: "/vdo/2.mp4",
    },
    {
        id: "opening-3",
        name: "វីដេអូ 3",
        description: "Opening style 3",
        url: "/vdo/3.mp4",
    },
    {
        id: "opening-4",
        name: "វីដេអូ 4",
        description: "Opening style 4",
        url: "/vdo/4.mp4",
    },
];

export const DEFAULT_OPENING_VIDEO = OPENING_VIDEO_OPTIONS[0];

export function getOpeningVideo(id) {
    return OPENING_VIDEO_OPTIONS.find((video) => video.id === id) || DEFAULT_OPENING_VIDEO;
}
