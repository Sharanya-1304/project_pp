import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

class MonitoringLogger {
  constructor() {
    this.logsDir = path.resolve(__dirname, "../../monitoring/logs");
    this.metricsDir = path.resolve(__dirname, "../../monitoring/metrics");
    this.sessionsDir = path.resolve(__dirname, "../../monitoring/sessions");
    this.analyticsDir = path.resolve(__dirname, "../../monitoring/analytics");
    this.ensureDirectories();
  }

  ensureDirectories() {
    const dirs = [this.logsDir, this.metricsDir, this.sessionsDir, this.analyticsDir];
    dirs.forEach((dir) => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    });
  }

  getLogFileName() {
    const date = new Date().toISOString().split("T")[0];
    return path.join(this.logsDir, `app_${date}.log`);
  }

  log(level, message, data = {}) {
    const timestamp = new Date().toISOString();
    const logEntry = `[${level}] ${timestamp} - ${message}`;
    const logMessage = Object.keys(data).length > 0 ? `${logEntry} | ${JSON.stringify(data)}` : logEntry;

    console.log(logMessage);

    try {
      fs.appendFileSync(this.getLogFileName(), logMessage + "\n");
    } catch (err) {
      console.error("Failed to write to log file:", err);
    }
  }

  logAuth(userId, userName, email, action, ipAddress) {
    const timestamp = new Date().toISOString();
    this.log("AUTH", `User '${userName}' (${userId}) ${action}`, {
      userId,
      userName,
      email,
      action,
      ipAddress,
      timestamp,
    });
  }

  logRequest(method, path, statusCode, responseTime, userId = null) {
    this.log("REQUEST", `${method} ${path}`, {
      method,
      path,
      statusCode,
      responseTime: `${responseTime}ms`,
      userId,
    });
  }

  logError(error, context = {}) {
    this.log("ERROR", error.message, {
      ...context,
      stack: error.stack,
    });
  }

  logDatabaseQuery(query, duration, userId = null) {
    if (duration > 100) {
      this.log("SLOW_QUERY", `Query took ${duration}ms`, {
        query: query.substring(0, 100),
        duration: `${duration}ms`,
        userId,
      });
    }
  }

  logUserActivity(userId, userName, action, details = {}) {
    this.log("ACTIVITY", `User '${userName}' performed action: ${action}`, {
      userId,
      userName,
      action,
      ...details,
    });
  }

  logApiEndpoint(endpoint, method, requestCount) {
    this.log("ENDPOINT", `${method} ${endpoint}`, {
      endpoint,
      method,
      requestCount,
    });
  }

  generateDailyMetrics(metrics) {
    const date = new Date().toISOString().split("T")[0];
    const fileName = path.join(this.metricsDir, `metrics_${date}.json`);

    try {
      fs.writeFileSync(fileName, JSON.stringify(metrics, null, 2));
      this.log("METRICS", `Daily metrics saved for ${date}`);
    } catch (err) {
      this.log("ERROR", "Failed to save metrics", { error: err.message });
    }
  }

  createSession(userId, userName, email, ipAddress) {
    const timestamp = new Date().toISOString();
    const sessionId = `sess_${Date.now()}`;

    const sessionData = {
      sessionId,
      userId,
      userName,
      email,
      loginTime: timestamp,
      logoutTime: null,
      duration: null,
      ipAddress,
      pages: [],
      actions: [],
      statistics: {
        postsCreated: 0,
        votesGiven: 0,
        feedbackGiven: 0,
        pagesVisited: 0,
        actionsPerformed: 0,
      },
    };

    return sessionData;
  }

  saveSession(sessionData) {
    const date = sessionData.loginTime.split("T")[0];
    const time = sessionData.loginTime.split("T")[1].substring(0, 8).replace(/:/g, "_");
    const fileName = path.join(this.sessionsDir, `session_${date}_${time}.json`);

    try {
      fs.writeFileSync(fileName, JSON.stringify(sessionData, null, 2));
      this.log("SESSION", `Session created for ${sessionData.userName}`, {
        sessionId: sessionData.sessionId,
        userId: sessionData.userId,
      });
    } catch (err) {
      this.log("ERROR", "Failed to save session", { error: err.message });
    }
  }

  updateSession(sessionData, action, page = null) {
    const actionData = {
      action,
      timestamp: new Date().toISOString(),
    };

    sessionData.actions.push(actionData);

    if (page) {
      sessionData.pages.push({
        page,
        timestamp: new Date().toISOString(),
      });
      sessionData.statistics.pagesVisited += 1;
    }

    sessionData.statistics.actionsPerformed += 1;
  }

  closeSession(sessionData) {
    sessionData.logoutTime = new Date().toISOString();
    const loginTime = new Date(sessionData.loginTime);
    const logoutTime = new Date(sessionData.logoutTime);
    const durationMs = logoutTime - loginTime;
    const hours = Math.floor(durationMs / 3600000);
    const minutes = Math.floor((durationMs % 3600000) / 60000);
    sessionData.duration = `${hours} hour${hours !== 1 ? "s" : ""} ${minutes} minute${minutes !== 1 ? "s" : ""}`;

    this.saveSession(sessionData);
  }
}

export default new MonitoringLogger();
