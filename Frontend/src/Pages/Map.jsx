import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// ✅ Fix Leaflet default marker issue in React
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

// ✅ Custom blue marker for fixed coastal stations
const blueIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// ✅ Fixed coastal monitoring locations
const fixedLocations = {
  "Gujarat (Porbandar)": [21.6417, 69.6293],
  Mumbai: [19.0761, 72.8774],
  "Digha (near Kolkata)": [21.627, 87.548], // coastal instead of city center
  Kanyakumari: [8.0883, 77.5385],
  Goa: [15.4909, 73.8278],
};

export default function Map() {
  const [weather, setWeather] = useState({});
  const [alerts, setAlerts] = useState([]);
  const [seaLevel, setSeaLevel] = useState([]);
  const [selectedRegion, setSelectedRegion] = useState(null);
  const socketRef = useRef(null);

  // 🔹 Fetch region-specific data (with live sea level trend)
  const fetchRegionData = async (regionName) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/weather?region=${encodeURIComponent(regionName)}`
      );
      const data = await res.json();

      setWeather(data);
      setSelectedRegion(regionName);

      // ✅ append marine.wave_height into seaLevel trend
      setSeaLevel((prev) => [
        ...prev.slice(-9), // keep last 9 points
        {
          time: new Date().toLocaleTimeString(),
          level: data?.marine?.wave_height ?? 0,
        },
      ]);
    } catch (err) {
      console.error("Failed to fetch weather for region:", err);
    }
  };

  // 🔹 Socket.io connection
  useEffect(() => {
    const socket = io("http://localhost:5000", {
      withCredentials: true,
      transports: ["websocket"],
    });
    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("✅ Connected to socket.io:", socket.id);
    });

    // Live updates only for selected region
    socket.on("weather_update", (data) => {
      if (selectedRegion && data.region === selectedRegion) {
        setWeather(data);
        setSeaLevel((prev) => [
          ...prev.slice(-9),
          {
            time: new Date().toLocaleTimeString(),
            level: data?.marine?.wave_height ?? 0,
          },
        ]);
      }
    });

    socket.on("alert", (data) => {
      setAlerts((prev) => [data, ...prev].slice(0, 30));
    });

    socket.on("disconnect", () => {
      console.log("❌ Disconnected from socket.io");
    });

    return () => socket.disconnect();
  }, [selectedRegion]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-blue-200 p-6">
      <h1 className="text-3xl font-bold text-center text-blue-900 mb-6">
        🌊 Coastal Monitoring Dashboard
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map Section */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-xl overflow-hidden">
          <h2 className="text-xl font-semibold p-4">Coastal Monitoring Map</h2>
          <div className="h-[500px]">
            <MapContainer
              center={[20.5937, 78.9629]} // India center
              zoom={5}
              style={{ height: "100%", width: "100%" }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution="&copy; OpenStreetMap contributors"
              />

              {/* 🔹 Blue markers for coastal regions */}
              {Object.entries(fixedLocations).map(([name, coords]) => (
                <Marker
                  key={name}
                  position={coords}
                  icon={blueIcon}
                  eventHandlers={{
                    click: () => fetchRegionData(name),
                  }}
                >
                  <Popup>
                    <b>{name}</b>
                    <br />📡 Monitoring Station
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        </div>

        {/* Metrics Section */}
        <div className="space-y-6">
          {/* Sea Level Trend */}
          <div className="bg-white rounded-2xl shadow-xl p-4">
            <h2 className="text-xl font-semibold mb-3">
              Sea Level Trend {selectedRegion && `- ${selectedRegion}`}
            </h2>
            {seaLevel.length === 0 ? (
              <p className="text-gray-500">Click a marker to load data</p>
            ) : (
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={seaLevel}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="level"
                    stroke="#2563eb"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Live Weather Metrics */}
          <div className="bg-white rounded-2xl shadow-xl p-4">
            <h2 className="text-xl font-semibold mb-3">
              Live Metrics {selectedRegion && `- ${selectedRegion}`}
            </h2>
            {Object.keys(weather).length === 0 ? (
              <p className="text-gray-500">Click a marker to load metrics</p>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-blue-50 rounded-xl text-center shadow">
                  🌡️{" "}
                  <p className="font-bold">
                    {weather?.marine?.sea_surface_temperature ?? "--"} °C
                  </p>
                  <p className="text-sm text-gray-600">Sea Surface Temp</p>
                </div>
                <div className="p-3 bg-blue-50 rounded-xl text-center shadow">
                  💨{" "}
                  <p className="font-bold">
                    {weather?.forecast?.windspeed ?? "--"} m/s
                  </p>
                  <p className="text-sm text-gray-600">Wind Speed</p>
                </div>
                <div className="p-3 bg-blue-50 rounded-xl text-center shadow">
                  🌬️{" "}
                  <p className="font-bold">
                    {weather?.forecast?.winddirection ?? "--"}°
                  </p>
                  <p className="text-sm text-gray-600">Wind Direction</p>
                </div>
                <div className="p-3 bg-blue-50 rounded-xl text-center shadow">
                  🌊{" "}
                  <p className="font-bold">
                    {weather?.marine?.wave_height ?? "--"} m
                  </p>
                  <p className="text-sm text-gray-600">Wave Height</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Alerts */}
      <div className="bg-white shadow-xl rounded-2xl p-4 mt-6">
        <h2 className="text-xl font-semibold mb-3">⚠️ Recent Alerts</h2>
        {alerts.length === 0 ? (
          <p className="text-gray-500">No alerts yet.</p>
        ) : (
          <ul className="space-y-2 max-h-[200px] overflow-y-auto">
            {alerts.map((a, i) => (
              <li
                key={i}
                className="p-3 border rounded-lg shadow-sm bg-red-50 text-red-700"
              >
                {a.message || JSON.stringify(a)}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
