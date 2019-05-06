import L from 'leaflet';

let icon_size = [30, 40];
let anchor_point = [15, 20];
let popup_anchor = [0, -15];

export const HomeIcon = new L.icon({
    iconUrl: '/icons/home.svg',
    iconRetinaUrl: '/icons/home.svg',
    iconSize: icon_size,
    iconAnchor: anchor_point,
    popupAnchor: popup_anchor,
});

export const OnIcon = new L.Icon({
    iconUrl: '/icons/lamp_on.svg',
    iconRetinaUrl: '/icons/lamp_on.svg',
    iconSize: icon_size,
    iconAnchor: anchor_point,
    popupAnchor: popup_anchor,
});

export const OffIcon = new L.Icon({
    iconUrl: '/icons/lamp_off.svg',
    iconRetinaUrl: '/icons/lamp_off.svg',
    iconSize: icon_size,
    iconAnchor: anchor_point,
    popupAnchor: popup_anchor,
});

export const DeadIcon = new L.Icon({
    iconUrl: '/icons/lamp_dead.png',
    iconRetinaUrl: '/icons/lamp_dead.png',
    iconSize: [26,26],
    iconAnchor: anchor_point,
    popupAnchor: popup_anchor,
});
