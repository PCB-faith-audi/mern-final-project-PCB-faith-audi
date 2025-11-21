import express from "express";
import dotenv from "dotenv";
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";

// routes
import energyRoutes from "./routes/energy.js";
import carbonRoutes from "./routes/carbon.js";
import climateRoutes from "./routes/climate.js";
import newsRoutes from "./routes/news.js";
import authRoutes from "./routes/auth.js";
import profileRoutes from "./routes/profile.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// trust proxy (Render/Heroku)
app.set("trust proxy", 1);

// security + rate limit
app.use(helmet({ contentSecurityPolicy: process.env.NODE_ENV === "production" ? undefined : false }));
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 1000 }));
app.use(express.json());

// CORS allowlist
const allowedOrigins = [
  "http://localhost:5174",
  process.env.FRONTEND_ORIGIN, // e.g., https://your-frontend.vercel.app
].filter(Boolean);

app.use(cors({
  origin: (origin, cb) => {
    if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
    return cb(new Error("Not allowed by CORS"));
  },
  credentials: true,
}));

// Friendly root + health
app.get("/", (_req, res) => {
  res.status(200).json({ name: "EcoPulse API", status: "ok", uptime: process.uptime(), docs: "/api" });
});
app.get("/healthz", (_req, res) => res.status(200).send("ok"));

// DEV MOCKS (turn off with USE_MOCKS=0)
if (process.env.USE_MOCKS === "1") {
  const day = 86400000;
  const today = new Date();
  const d = (i) => new Date(today - i * day).toISOString().slice(0, 10);

  const mockEnergy = Array.from({ length: 10 }, (_, i) => ({
    _id: `eng-${i + 1}`,
    date: d(i),
    kwh: Math.round((12 + Math.sin(i) * 4 + Math.random() * 2) * 10) / 10,
    source: ["grid", "solar", "wind"][i % 3],
    notes: "Mock energy log",
  }));
  const mockCarbon = Array.from({ length: 10 }, (_, i) => ({
    _id: `crb-${i + 1}`,
    date: d(i),
    kgCO2: Math.round((6 + Math.cos(i) * 2 + Math.random()) * 10) / 10,
    category: ["transport", "electricity", "waste"][i % 3],
    notes: "Mock carbon log",
  }));
  const mockClimate = {
    labels: Array.from({ length: 12 }, (_, i) => {
      const dt = new Date(today);
      dt.setMonth(today.getMonth() - (11 - i));
      return dt.toISOString().slice(0, 10);
    }),
    values: Array.from({ length: 12 }, (_, i) => 0.2 + Math.sin((i / 12) * Math.PI * 2) * 0.15 + Math.random() * 0.05),
  };
  const mockNews = {
    items: [
      { id: "n1", title: "Community Solar Hits New Milestone", summary: "Local projects deliver clean power and lower bills.", url: "#", date: today.toISOString() },
      { id: "n2", title: "Wetlands Restoration Boosts Biodiversity", summary: "Restored habitats show ecological gains.", url: "#", date: new Date(today - day).toISOString() },
      { id: "n3", title: "Smart Grids Reduce Peak Demand", summary: "AI-driven load shifting improves resilience.", url: "#", date: new Date(today - 2 * day).toISOString() },
    ],
  };

  app.get("/api/energy", (_req, res) => res.json({ items: mockEnergy }));
  app.get("/api/carbon", (_req, res) => res.json({ items: mockCarbon }));
  app.get("/api/climate", (_req, res) => res.json(mockClimate));
  app.get("/api/climate/global", (_req, res) => res.json(mockClimate));
  app.get("/api/climate/trend", (_req, res) => res.json(mockClimate));
  app.get("/api/news", (_req, res) => res.json(mockNews));
}

// Real routes (mounted under /api)
app.use("/api/energy", energyRoutes);
app.use("/api/carbon", carbonRoutes);
app.use("/api/climate", climateRoutes);
app.use("/api/news", newsRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);

// 404 + error handler
app.use((_req, res) => res.status(404).json({ error: "Not Found" }));
app.use((err, _req, res, _next) => {
  console.error("Server error:", err);
  res.status(err.status || 500).json({ error: err.message || "Internal Server Error" });
});

app.listen(PORT, () => console.log(`EcoPulse API listening on ${PORT}`));
