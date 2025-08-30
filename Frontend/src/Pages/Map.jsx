// Map.jsx
import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// ✅ Fix default marker icons (otherwise broken in React)
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
  const socketRef = useRef(null);

  // 🔹 Initial fetch
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/weather"); // ✅ fixed endpoint
        const data = await res.json();

        setWeather(data);

        const buoyList = Object.entries(data).map(([location, details], idx) => ({
          id: idx + 1,
          location,
          ...details,
        }));
        setBuoys(buoyList);
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

    socket.on("welcome", (msg) => {
      console.log("Server says:", msg);
    });

    // ✅ Corrected event name
    socket.on("weather_update", (data) => {
      console.log("📡 Weather update:", data);
      setWeather(data);
      const buoyList = Object.entries(data).map(([location, details], idx) => ({
        id: idx + 1,
        location,
        ...details,
      }));
      setBuoys(buoyList);
    });

    socket.on("alert", (data) => {
      console.log("⚠️ Alert received:", data);
      setAlerts((prev) => [data, ...prev].slice(0, 30));
    });

    socket.on("disconnect", () => {
      console.log("❌ Disconnected from socket.io");
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-blue-300 p-6">
      <h1 className="text-3xl font-bold text-center text-blue-900 mb-6">
        🌊 Coastal Monitoring Dashboard
      </h1>

      {/* Map Section */}
      <div className="h-[400px] mb-6 rounded-2xl overflow-hidden shadow-xl">
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
              <Marker
                key={b.id}
                position={[b.coords.lat, b.coords.lon]}
              >
                <Popup>
                  <strong>{b.location}</strong>
                  <br />
                  🌬 {b.forecast?.windspeed} km/h @ {b.forecast?.winddirection}°
                  <br />
                  🌊 {b.marine?.wave_height} m
                  <br />
                  🌡 {b.marine?.sea_surface_temperature} °C
                </Popup>
              </Marker>
            ))}
        </MapContainer>
      </div>

      {/* Weather Overview */}
      <div className="bg-white shadow-xl rounded-2xl p-4 mb-6">
        <h2 className="text-xl font-semibold mb-3">🌤 Weather Overview</h2>
        <ul className="space-y-2">
          {Object.entries(weather).map(([location, data]) => (
            <li
              key={location}
              className="p-3 border rounded-lg shadow-sm bg-blue-50"
            >
              <h3 className="font-bold">{location}</h3>
              <p>
                🌬 Wind: {data.forecast?.windspeed} km/h @{" "}
                {data.forecast?.winddirection}°
              </p>
              <p>🌊 Wave Height: {data.marine?.wave_height} m</p>
              <p>🌡 Sea Temp: {data.marine?.sea_surface_temperature} °C</p>
            </li>
          ))}
        </ul>
      </div>

      {/* Alerts */}
      <div className="bg-white shadow-xl rounded-2xl p-4">
        <h2 className="text-xl font-semibold mb-3">⚠️ Alerts</h2>
        {alerts.length === 0 ? (
          <p className="text-gray-500">No alerts yet.</p>
        ) : (
          <ul className="space-y-2">
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
