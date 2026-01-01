class MonitoringService {
  constructor() {
    this.API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";
    this.sessionId = null;
    this.sessionData = {};
    this.requestCount = {};
  }

  // Initialize monitoring when user logs in
  initializeSession(userId, userName, email) {
    this.sessionId = `sess_${Date.now()}`;
    this.sessionData = {
      sessionId: this.sessionId,
      userId,
      userName,
      email,
      startTime: new Date(),
      pages: [],
      actions: [],
      pageViews: 0,
      actionCount: 0,
    };

    // Send session start to backend
    this.trackEvent("session_start", {
      userId,
      userName,
      email,
      sessionId: this.sessionId,
    });

    // Start tracking page changes
    this.trackPageView();
    window.addEventListener("popstate", () => this.trackPageView());
  }

  // Track page views
  trackPageView() {
    const currentPath = window.location.pathname;
    const timestamp = new Date().toISOString();

    this.sessionData.pages.push({
      page: currentPath,
      timestamp,
      title: document.title,
    });

    this.sessionData.pageViews += 1;

    this.trackEvent("page_view", {
      page: currentPath,
      title: document.title,
    });
  }

  // Track user actions
  trackAction(action, details = {}) {
    const timestamp = new Date().toISOString();

    this.sessionData.actions.push({
      action,
      timestamp,
      details,
    });

    this.sessionData.actionCount += 1;

    this.trackEvent("user_action", {
      action,
      ...details,
    });
  }

  // Track button clicks
  trackClick(elementId, elementText) {
    this.trackAction("click", {
      elementId,
      elementText,
    });
  }

  // Track form submissions
  trackFormSubmit(formName, formData = {}) {
    this.trackAction("form_submit", {
      formName,
      fields: Object.keys(formData),
    });
  }

  // Track API calls
  trackApiCall(method, endpoint, statusCode, duration) {
    const fullEndpoint = `${method} ${endpoint}`;

    if (!this.requestCount[fullEndpoint]) {
      this.requestCount[fullEndpoint] = 0;
    }
    this.requestCount[fullEndpoint] += 1;

    this.trackAction("api_call", {
      method,
      endpoint,
      statusCode,
      duration: `${duration}ms`,
    });
  }

  // Track errors
  trackError(errorName, errorMessage, context = {}) {
    this.trackAction("error", {
      errorName,
      errorMessage,
      context,
    });
  }

  // Track custom events
  trackEvent(eventName, eventData = {}) {
    const timestamp = new Date().toISOString();

    const payload = {
      sessionId: this.sessionId,
      eventName,
      eventData,
      timestamp,
      userAgent: navigator.userAgent,
      url: window.location.href,
    };

    // Send to backend (non-blocking)
    fetch(`${this.API_URL}/api/monitoring/track`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(payload),
    }).catch((err) => console.log("Monitoring:", err));
  }

  // End session
  endSession() {
    const endTime = new Date();
    const duration = endTime - this.sessionData.startTime;
    const hours = Math.floor(duration / 3600000);
    const minutes = Math.floor((duration % 3600000) / 60000);

    this.sessionData.endTime = endTime;
    this.sessionData.duration = `${hours}h ${minutes}m`;

    this.trackEvent("session_end", {
      sessionId: this.sessionId,
      duration: this.sessionData.duration,
      pageViews: this.sessionData.pageViews,
      actionCount: this.sessionData.actionCount,
      requestCount: this.requestCount,
    });

    // Clear session data
    this.sessionId = null;
    this.sessionData = {};
    this.requestCount = {};
  }

  // Get session stats
  getSessionStats() {
    return {
      sessionId: this.sessionId,
      startTime: this.sessionData.startTime,
      pageViews: this.sessionData.pageViews,
      actionCount: this.sessionData.actionCount,
      requestCount: this.requestCount,
    };
  }

  // Track performance metrics
  trackPerformance() {
    if (window.performance && window.performance.timing) {
      const timing = window.performance.timing;
      const metrics = {
        pageLoadTime: timing.loadEventEnd - timing.navigationStart,
        domInteractiveTime: timing.domInteractive - timing.navigationStart,
        resourceLoadTime: timing.responseEnd - timing.requestStart,
      };

      this.trackEvent("performance", metrics);
    }
  }

  // Track user engagement
  trackEngagement(engagementData) {
    this.trackEvent("engagement", {
      postsCreated: engagementData.posts || 0,
      votesGiven: engagementData.votes || 0,
      feedbackGiven: engagementData.feedback || 0,
      score: engagementData.score || 0,
    });
  }
}

export default new MonitoringService();
