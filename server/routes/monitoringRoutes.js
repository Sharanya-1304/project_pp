import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const router = express.Router();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Track monitoring events
router.post("/track", (req, res) => {
  try {
    const { sessionId, eventName, eventData, timestamp } = req.body;

    // Log to monitoring system
    const logsDir = path.resolve(__dirname, "../../monitoring/logs");
    const logFile = path.join(logsDir, `monitoring_${new Date().toISOString().split("T")[0]}.log`);

    const logEntry = `[EVENT] ${timestamp} - ${eventName} | Session: ${sessionId} | Data: ${JSON.stringify(
      eventData
    )}\n`;

    fs.appendFileSync(logFile, logEntry);

    res.json({ success: true, message: "Event tracked" });
  } catch (error) {
    console.error("Monitoring error:", error);
    res.status(500).json({ error: "Failed to track event" });
  }
});

// Get monitoring stats
router.get("/stats", (req, res) => {
  try {
    const logsDir = path.resolve(__dirname, "../../monitoring/logs");
    const files = fs.readdirSync(logsDir);

    const stats = {
      totalLogs: files.length,
      latestLog: files[files.length - 1] || null,
      logsDir,
    };

    res.json(stats);
  } catch (error) {
    console.error("Monitoring stats error:", error);
    res.status(500).json({ error: "Failed to get stats" });
  }
});

export default router;
