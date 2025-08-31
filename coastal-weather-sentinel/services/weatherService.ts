import { mockWeatherCache } from '../mock/stationData';
import type { WeatherCache } from '../types';

const API_BASE_URL = (import.meta.env?.VITE_API_BASE_URL) || '';

export const getAllStationsData = async (): Promise<WeatherCache> => {
    if (!API_BASE_URL) {
        console.warn("VITE_API_BASE_URL is not set. Using mock data.");
        // Simulate network delay
        await new Promise(res => setTimeout(res, 500));
        return Promise.resolve(mockWeatherCache);
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/api/weather`);
        if (!response.ok) {
            throw new Error(`Failed to fetch: ${response.statusText}`);
        }
        const data: WeatherCache = await response.json();
        return data;
    } catch (error) {
        console.error("Failed to fetch from API, falling back to mock data.", error);
        return mockWeatherCache;
    }
};
