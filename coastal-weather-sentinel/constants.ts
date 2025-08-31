import type { StationMetadata } from './types';

export const MAP_CENTER: [number, number] = [20.5937, 78.9629];
export const MAP_ZOOM: number = 4;
export const MAP_URL: string = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
export const MAP_ATTRIBUTION: string = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

export const STATIONS: StationMetadata[] = [
    { name: "Mumbai", coords: [19.0760, 72.8777] },
    { name: "Gujarat (Porbandar)", coords: [21.6417, 69.6293] },
    { name: "Kolkata", coords: [22.5726, 88.3639] },
    { name: "Kanyakumari", coords: [8.0883, 77.5385] },
    { name: "Chennai", coords: [13.0827, 80.2707] },
    { name: "Visakhapatnam", coords: [17.6868, 83.2185] },
];