import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";
import searchRoutes from "./routes/search.routes.js";
import propertiesRoutes from "./routes/properties.routes.js";
import adminRoutes from "./routes/admin.routes.js";

export const app = express();

app.use(
  cors(),
);
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Yatramitra backend API running" });
});

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/auth", authRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/properties", propertiesRoutes);
app.use("/api/admin", adminRoutes);
