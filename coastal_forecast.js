// filename: coastal_forecast_hourly_formatted.js
import fetch from "node-fetch";

// Coastal locations (lat, lon)
const locations = {
  "Gujarat (Porbandar)": [21.6417, 69.6293],
  "Mumbai": [19.0761, 72.8774],
  "Kolkata": [22.5726, 88.3639],
  "Kanyakumari": [8.0883, 77.5385]
};

// Forecast API (16-day data)
const FORECAST_URL = "https://api.open-meteo.com/v1/forecast";

// Hourly parameters
const hourly_params = {
  hourly: "temperature_2m,precipitation,rain,showers,windspeed_10m,windgusts_10m,winddirection_10m",
  forecast_days: 16,
  timezone: "auto"
};

// Convert wind degrees → cardinal
function degToCardinal(deg) {
  const dirs = ["N","NE","E","SE","S","SW","W","NW"];
  return dirs[Math.round(deg / 45) % 8];
}

// Helper to format numbers
function fmt(num, decimals = 1) {
  return num !== undefined ? num.toFixed(decimals) : "N/A";
}

async function getHourlyWeather() {
  for (const [name, [lat, lon]] of Object.entries(locations)) {
    console.log(`\n🌍 Hourly Forecast for ${name} (${lat}, ${lon})`);
    console.log("-----------------------------------------------------");

    const url = `${FORECAST_URL}?latitude=${lat}&longitude=${lon}&${new URLSearchParams(hourly_params)}`;
    const res = await fetch(url);
    const data = await res.json();

    const hourly = data?.hourly || {};
    const hours = hourly.time?.length || 0;

    if (hours === 0) {
      console.log("❌ No hourly data available.");
      continue;
    }

    // Group hourly data by day
    let currentDay = "";
    for (let i = 0; i < hours; i++) {
      const dateTime = hourly.time[i];
      const [date, time] = dateTime.split("T");

      if (date !== currentDay) {
        currentDay = date;
        console.log(`\n📅 ${currentDay}`);
        console.log("-----------------------------------------------------");
        console.log("Time  | Temp(°C) | Precip(mm) | Rain(mm) | Showers(mm) | Wind(m/s) | Gusts(m/s) | Dir");
        console.log("----------------------------------------------------------------------------------------");
      }

      const temp = fmt(hourly.temperature_2m?.[i]);
      const prcp = fmt(hourly.precipitation?.[i]);
      const rain = fmt(hourly.rain?.[i]);
      const showers = fmt(hourly.showers?.[i]);
      const ws = fmt(hourly.windspeed_10m?.[i]);
      const gust = fmt(hourly.windgusts_10m?.[i]);
      const wd = hourly.winddirection_10m?.[i];
      const wind_cardinal = wd !== undefined ? degToCardinal(wd) : "N/A";

      console.log(
        `${time} | ${temp.padStart(8)} | ${prcp.padStart(10)} | ${rain.padStart(8)} | ${showers.padStart(12)} | ${ws.padStart(9)} | ${gust.padStart(11)} | ${wind_cardinal.padStart(3)}`
      );
    }
  }
}

getHourlyWeather();
