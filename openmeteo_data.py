import requests

# Coastal locations (lat, lon)
locations = {
    "Gujarat (Porbandar)": (21.6417, 69.6293),
    "Mumbai": (19.0761, 72.8774),
    "Kolkata": (22.5726, 88.3639),
    "Kanyakumari": (8.0883, 77.5385)
}

# Forecast API (wind, air pressure, rainfall)
FORECAST_URL = "https://api.open-meteo.com/v1/forecast"
forecast_params = {
    "hourly": "windspeed_10m,winddirection_10m,windgusts_10m,surface_pressure,precipitation,rain,showers"
}

# Marine API (waves, sea surface temp)
MARINE_URL = "https://marine-api.open-meteo.com/v1/marine"
marine_params = {
    "hourly": "wave_height,wind_wave_height,swell_wave_height,wind_wave_direction,swell_wave_period,sea_surface_temperature"
}

# Function to convert degrees → cardinal
def deg_to_cardinal(deg):
    dirs = ["N","NE","E","SE","S","SW","W","NW"]
    ix = round(deg / 45) % 8
    return dirs[ix]

# Loop over each location
for name, (lat, lon) in locations.items():
    print(f"\n📍 {name} ({lat}, {lon})")

    # Forecast API request
    f_params = forecast_params | {"latitude": lat, "longitude": lon}
    f_res = requests.get(FORECAST_URL, params=f_params).json()
    f_hourly = f_res.get("hourly", {})

    # Extract current values (first index = current/nearest hour)
    ws = f_hourly.get("windspeed_10m", [None])[0]
    wd = f_hourly.get("winddirection_10m", [None])[0]
    gust = f_hourly.get("windgusts_10m", [None])[0]
    sp = f_hourly.get("surface_pressure", [None])[0]

    wind_cardinal = deg_to_cardinal(wd) if wd is not None else "N/A"
    print(f"  Wind Speed: {ws:.1f} m/s | Direction: {wd:.0f}° ({wind_cardinal}) | Gust: {gust if gust else 'N/A'} m/s")
    print(f"  Air Pressure: {sp:.1f} hPa" if sp else "  Air Pressure: N/A")

    # Rainfall / precipitation
    precipitation = f_hourly.get("precipitation", [None])[0]
    rain = f_hourly.get("rain", [None])[0]
    showers = f_hourly.get("showers", [None])[0]
    print(f"  Precipitation (total): {precipitation if precipitation is not None else 'N/A'} mm")
    print(f"  Rainfall: {rain if rain is not None else 'N/A'} mm")
    print(f"  Showers: {showers if showers is not None else 'N/A'} mm")

    # Marine API request
    m_params = marine_params | {"latitude": lat, "longitude": lon}
    m_res = requests.get(MARINE_URL, params=m_params).json()
    m_hourly = m_res.get("hourly", {})

    wave = m_hourly.get("wave_height", [None])[0]
    wind_wave = m_hourly.get("wind_wave_height", [None])[0]
    swell_wave = m_hourly.get("swell_wave_height", [None])[0]
    wind_wave_dir = m_hourly.get("wind_wave_direction", [None])[0]
    swell_period = m_hourly.get("swell_wave_period", [None])[0]
    sst = m_hourly.get("sea_surface_temperature", [None])[0]

    print("  Marine Forecast (Next Hour):")
    print(f"    Wave Height: {wave if wave else 'N/A'} m")
    print(f"    Wind Wave Height: {wind_wave if wind_wave else 'N/A'} m")
    print(f"    Swell Wave Height: {swell_wave if swell_wave else 'N/A'} m")
    print(f"    Wind Wave Direction: {wind_wave_dir if wind_wave_dir else 'N/A'}°")
    print(f"    Swell Wave Period: {swell_period if swell_period else 'N/A'} s")
    print(f"    Sea Surface Temp: {sst if sst else 'N/A'} °C")
