import MonitoringLogger from "../utils/MonitoringLogger.js";

export const monitoringMiddleware = (req, res, next) => {
  const startTime = Date.now();

  // Store request info for later use
  req.monitoring = {
    startTime,
    ipAddress: req.ip || req.connection.remoteAddress,
    method: req.method,
    path: req.path,
    userId: req.userId || null,
  };

  // Override res.json to log API calls
  const originalJson = res.json.bind(res);
  res.json = function (data) {
    const endTime = Date.now();
    const responseTime = endTime - startTime;

    // Log the request
    MonitoringLogger.logRequest(req.method, req.path, res.statusCode, responseTime, req.monitoring.userId);

    return originalJson(data);
  };

  next();
};

export const logAuthActivity = (userId, userName, email, action, ipAddress) => {
  MonitoringLogger.logAuth(userId, userName, email, action, ipAddress);
};

export const logUserAction = (userId, userName, action, details) => {
  MonitoringLogger.logUserActivity(userId, userName, action, details);
};

export const logError = (error, context) => {
  MonitoringLogger.logError(error, context);
};

export const logDatabaseQuery = (query, duration, userId) => {
  MonitoringLogger.logDatabaseQuery(query, duration, userId);
};

export const createUserSession = (userId, userName, email, ipAddress) => {
  return MonitoringLogger.createSession(userId, userName, email, ipAddress);
};

export const saveUserSession = (sessionData) => {
  MonitoringLogger.saveSession(sessionData);
};

export const updateUserSession = (sessionData, action, page) => {
  MonitoringLogger.updateSession(sessionData, action, page);
};

export const closeUserSession = (sessionData) => {
  MonitoringLogger.closeSession(sessionData);
};

export const generateMetricsReport = (metrics) => {
  MonitoringLogger.generateDailyMetrics(metrics);
};
