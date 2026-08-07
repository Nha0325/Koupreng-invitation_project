import {
    IoCalendarOutline,
    IoCallOutline,
    IoCameraOutline,
    IoChatbubbleEllipsesOutline,
    IoCheckmarkOutline,
    IoCopyOutline,
    IoHeartOutline,
    IoHelpCircleOutline,
    IoGiftOutline,
    IoLogoFacebook,
    IoLocationOutline,
    IoMapOutline,
    IoMailOpenOutline,
    IoMusicalNotesOutline,
    IoPeopleOutline,
    IoSparklesOutline,
    IoTimeOutline,
} from "react-icons/io5";
import { GiClothes, GiDiamondRing } from "react-icons/gi";

export const templateIcons = {
    invitation: IoMailOpenOutline,
    couple: GiDiamondRing,
    countdown: IoTimeOutline,
    story: IoHeartOutline,
    schedule: IoCalendarOutline,
    venue: IoLocationOutline,
    map: IoMapOutline,
    gallery: IoCameraOutline,
    party: IoPeopleOutline,
    dress: GiClothes,
    gift: IoGiftOutline,
    wish: IoChatbubbleEllipsesOutline,
    thank: IoHeartOutline,
    music: IoMusicalNotesOutline,
    call: IoCallOutline,
    facebook: IoLogoFacebook,
    sparkle: IoSparklesOutline,
    copy: IoCopyOutline,
    copied: IoCheckmarkOutline,
    faq: IoHelpCircleOutline,
};

export function scheduleIcon(index) {
    const icons = [IoCalendarOutline, IoTimeOutline, IoHeartOutline, IoCameraOutline];
    return icons[index % icons.length];
}
