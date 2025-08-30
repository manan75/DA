// server.js
import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import { fetchWeatherData, weatherCache } from "./routes/weather.js";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // your frontend Vite/React dev server
    methods: ["GET", "POST"],
  },
});

app.use(cors());

// ✅ REST endpoint
app.get("/api/weather", (req, res) => {
  res.json(weatherCache);
});

// ✅ Refresh and broadcast
async function refreshAndBroadcast() {
  const data = await fetchWeatherData();
  io.emit("weather_update", data);
}

// Fetch once on startup
refreshAndBroadcast();

// Refresh every 5 mins
setInterval(refreshAndBroadcast, 5 * 60 * 1000);

// ✅ Socket setup
io.on("connection", (socket) => {
  console.log("🔌 Client connected:", socket.id);
  socket.emit("weather_update", weatherCache); // send current cache
  socket.emit("welcome", "Connected to coastal monitoring server!");

  socket.on("disconnect", () => {
    console.log("❌ Client disconnected:", socket.id);
  });
});

const PORT = 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
