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

export default function Map() {
  const [weather, setWeather] = useState({});
  const [buoys, setBuoys] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [seaLevel, setSeaLevel] = useState([]);
  const socketRef = useRef(null);

  // 🔹 Initial fetch
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/weather");
        const data = await res.json();
        setWeather(data);

        const buoyList = Object.entries(data).map(([location, details], idx) => ({
          id: idx + 1,
          location,
          ...details,
        }));
        setBuoys(buoyList);

        // fake sea level data for now
        setSeaLevel(
          Array.from({ length: 10 }, (_, i) => ({
            time: i,
            level: 1 + Math.sin(i) * 0.3,
          }))
        );
      } catch (err) {
        console.error("Failed to fetch weather:", err);
      }
    };
    fetchInitialData();
  }, []);

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

    socket.on("weather_update", (data) => {
      setWeather(data);
      const buoyList = Object.entries(data).map(([location, details], idx) => ({
        id: idx + 1,
        location,
        ...details,
      }));
      setBuoys(buoyList);
    });

    socket.on("alert", (data) => {
      setAlerts((prev) => [data, ...prev].slice(0, 30));
    });

    socket.on("disconnect", () => {
      console.log("❌ Disconnected from socket.io");
    });

    return () => socket.disconnect();
  }, []);

  // 🔹 compute averages for metrics
  const avgTemp = (
    buoys.reduce((sum, b) => sum + (b.marine?.sea_surface_temperature || 0), 0) /
    (buoys.length || 1)
  ).toFixed(1);

  const avgWave = (
    buoys.reduce((sum, b) => sum + (b.marine?.wave_height || 0), 0) /
    (buoys.length || 1)
  ).toFixed(1);

  const avgWind = (
    buoys.reduce((sum, b) => sum + (b.forecast?.windspeed || 0), 0) /
    (buoys.length || 1)
  ).toFixed(1);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-blue-200 p-6">
      <h1 className="text-3xl font-bold text-center text-blue-900 mb-6">
        🌊 Coastal Monitoring Dashboard
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map Section */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-xl overflow-hidden">
          <h2 className="text-xl font-semibold p-4">Buoy & Coastal Map</h2>
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
              {buoys
                .filter((b) => b.coords?.lat && b.coords?.lon)
                .map((b) => (
                  <Marker key={b.id} position={[b.coords.lat, b.coords.lon]}>
                    <Popup>
                      <strong>{b.location}</strong>
                      <br />
                      🌬 {b.forecast?.windspeed} km/h @{" "}
                      {b.forecast?.winddirection}°
                      <br />
                      🌊 {b.marine?.wave_height} m
                      <br />
                      🌡 {b.marine?.sea_surface_temperature} °C
                    </Popup>
                  </Marker>
                ))}
            </MapContainer>
          </div>
        </div>

        {/* Metrics Section */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-xl p-4">
            <h2 className="text-xl font-semibold mb-3">Live Metrics</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-orange-50 rounded-xl shadow">
                🌡 <p className="text-lg font-bold">{avgTemp} °C</p>
                <p className="text-sm text-gray-500">Avg Sea Temp</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-xl shadow">
                🌊 <p className="text-lg font-bold">{avgWave} m</p>
                <p className="text-sm text-gray-500">Avg Wave Height</p>
              </div>
              <div className="p-3 bg-cyan-50 rounded-xl shadow col-span-2">
                🌬 <p className="text-lg font-bold">{avgWind} m/s</p>
                <p className="text-sm text-gray-500">Avg Wind Speed</p>
              </div>
            </div>
          </div>

          {/* Sea Level Trend */}
          <div className="bg-white rounded-2xl shadow-xl p-4">
            <h2 className="text-xl font-semibold mb-3">Sea Level Trend</h2>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={seaLevel}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="level" stroke="#2563eb" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
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
