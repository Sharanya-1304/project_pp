import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import alumniRoutes from "./routes/alumniRoutes.js";
import monitoringRoutes from "./routes/monitoringRoutes.js";
import { monitoringMiddleware } from "./middleware/monitoringMiddleware.js";

// Load .env from parent directory (project root)
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(monitoringMiddleware);

connectDB();

app.get("/", (req, res) => {
  res.json({ status: "running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/alumni", alumniRoutes);
app.use("/api/monitoring", monitoringRoutes);

app.use((req, res) => {
  res.status(404).json({ error: "Not Found" });
});

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});

export default app;