import {
    IoCalendarOutline,
    IoCameraOutline,
    IoHeartOutline,
    IoHelpCircleOutline,
    IoGiftOutline,
    IoLocationOutline,
    IoMailOpenOutline,
    IoPeopleOutline,
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
    gallery: IoCameraOutline,
    party: IoPeopleOutline,
    dress: GiClothes,
    gift: IoGiftOutline,
    faq: IoHelpCircleOutline,
};

export function scheduleIcon(index) {
    const icons = [IoCalendarOutline, IoTimeOutline, IoHeartOutline, IoCameraOutline];
    return icons[index % icons.length];
}
