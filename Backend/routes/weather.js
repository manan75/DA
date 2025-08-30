// Backend/routes/weather.js
import { Router } from "express";

const weatherRouter = Router();

let weatherCache = {}; // in-memory cache ✅

/**
 * Fetch weather + marine data from Open-Meteo
 */
export async function fetchWeatherData() {
  try {
  const locations = [
  { name: "Mumbai", lat: 18.9500, lon: 72.8258 },
  { name: "Chennai", lat: 13.0827, lon: 80.2707 },
  { name: "Goa", lat: 15.4909, lon: 73.8278 },
  { name: "Digha (near Kolkata)", lat: 21.6270, lon: 87.5480 }
];


    const newCache = {};

    for (const loc of locations) {
      // 🌊 Marine API (waves + SST)
      const marineUrl = `https://marine-api.open-meteo.com/v1/marine?latitude=${loc.lat}&longitude=${loc.lon}&hourly=wave_height,sea_surface_temperature&forecast_days=1`;

      // 🌬️ Weather API (wind)
      const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${loc.lat}&longitude=${loc.lon}&hourly=windspeed_10m,winddirection_10m&forecast_days=1`;

      try {
        const [marineRes, weatherRes] = await Promise.all([
          fetch(marineUrl),
          fetch(weatherUrl),
        ]);

        if (!marineRes.ok) {
          console.error(`❌ Marine API failed for ${loc.name}:`, marineRes.status, marineRes.statusText);
          continue;
        }
        if (!weatherRes.ok) {
          console.error(`❌ Weather API failed for ${loc.name}:`, weatherRes.status, weatherRes.statusText);
          continue;
        }

        const marineData = await marineRes.json();
        const weatherData = await weatherRes.json();

        newCache[loc.name] = {
          coords: { lat: loc.lat, lon: loc.lon },
          forecast: {
            windspeed: weatherData.hourly?.windspeed_10m?.[0] ?? null,
            winddirection: weatherData.hourly?.winddirection_10m?.[0] ?? null,
          },
          marine: {
            wave_height: marineData.hourly?.wave_height?.[0] ?? null,
            sea_surface_temperature: marineData.hourly?.sea_surface_temperature?.[0] ?? null,
          },
        };
      } catch (err) {
        console.error(`❌ Error fetching for ${loc.name}:`, err);
      }
    }

    weatherCache = newCache;
    console.log("✅ New Weather Cache:", JSON.stringify(weatherCache, null, 2));
    return weatherCache;
  } catch (err) {
    console.error("❌ Failed to fetch weather data:", err);
    return weatherCache;
  }
}


// API endpoint → GET cached data
weatherRouter.get("/", async (req, res) => {
  try {
    if (Object.keys(weatherCache).length === 0) {
      await fetchWeatherData();
    }
    res.status(200).json(weatherCache);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch weather data", error: err.message });
  }
});

// API endpoint → force refresh
weatherRouter.post("/refresh", async (req, res) => {
  try {
    const updated = await fetchWeatherData();
    res.status(200).json({ message: "Weather data refreshed", data: updated });
  } catch (err) {
    res.status(500).json({ message: "Failed to refresh weather data", error: err.message });
  }
});

export default weatherRouter;
export { weatherCache };
