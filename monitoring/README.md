# 📊 Monitoring & Sessions Folder

This folder contains all monitoring sessions, analytics, and user activity tracking data.

## 📁 Structure

```
monitoring/
├── README.md (this file)
├── sessions/ (User session logs)
├── analytics/ (User activity analytics)
├── logs/ (Server and application logs)
├── metrics/ (Performance metrics)
└── reports/ (Generated reports)
```

## 📋 Contents

### 1. **sessions/** 
Tracks user login/logout sessions and activity:
- User session IDs
- Login timestamps
- Logout timestamps
- Session duration
- User IP addresses
- Browser info

### 2. **analytics/**
User behavior and engagement analytics:
- User activity timelines
- Post creation frequency
- Vote patterns
- Leaderboard changes
- Page visit tracking
- Feature usage

### 3. **logs/**
Server and application logs:
- Authentication logs
- API request logs
- Error logs
- Database queries
- Performance logs

### 4. **metrics/**
Performance and system metrics:
- Server uptime
- Response times
- Database performance
- Memory usage
- CPU usage
- Request rates

### 5. **reports/**
Generated reports and summaries:
- Daily activity reports
- Weekly user statistics
- Monthly analytics
- Performance reports
- User engagement reports

## 🚀 How to Use

### Add a New Session:
```bash
# Create session file with timestamp
monitoring/sessions/session_[DATE_TIME].json
```

### Monitor Analytics:
```bash
# View activity tracking
monitoring/analytics/[USERNAME]_activity.json
```

### Check Logs:
```bash
# View application logs
monitoring/logs/app_[DATE].log
```

### Review Metrics:
```bash
# View performance metrics
monitoring/metrics/metrics_[DATE].json
```

## 📊 Session File Format

```json
{
  "sessionId": "sess_123456789",
  "userId": "user_id",
  "userName": "John Doe",
  "email": "john@example.com",
  "loginTime": "2026-01-01T10:30:00Z",
  "logoutTime": "2026-01-01T11:45:00Z",
  "duration": "1 hour 15 minutes",
  "ipAddress": "192.168.1.100",
  "browser": "Chrome 91.0",
  "device": "Desktop",
  "pages": [
    {
      "page": "/dashboard",
      "timestamp": "2026-01-01T10:30:05Z",
      "duration": "2 minutes"
    }
  ],
  "actions": [
    {
      "action": "create_post",
      "timestamp": "2026-01-01T10:35:00Z",
      "details": "Created post about React"
    }
  ]
}
```

## 📈 Analytics Format

```json
{
  "userId": "user_id",
  "userName": "John Doe",
  "date": "2026-01-01",
  "sessionCount": 3,
  "totalSessionTime": "4 hours 30 minutes",
  "pagesVisited": 12,
  "postCreated": 2,
  "votesGiven": 5,
  "feedbackGiven": 1,
  "activities": [
    {
      "type": "login",
      "time": "10:30:00"
    },
    {
      "type": "create_post",
      "time": "10:35:00",
      "details": "React Tutorial"
    }
  ]
}
```

## 🔍 Query Examples

### Find user sessions:
```
monitoring/sessions/session_*[username]*.json
```

### Get daily analytics:
```
monitoring/analytics/*_2026-01-01.json
```

### View error logs:
```
monitoring/logs/errors_[DATE].log
```

## 🎯 Monitoring Features

✅ Real-time session tracking
✅ User activity logging
✅ Performance metrics
✅ Error monitoring
✅ Database query logging
✅ API request tracking
✅ User engagement metrics
✅ System health monitoring

## 📝 Important Notes

- Sessions are created automatically when users login
- Analytics are updated in real-time
- Old logs are archived monthly
- Reports are generated daily
- All data is timestamped
- User privacy is maintained
- Data is encrypted in transit

## 🔐 Privacy & Security

- Personal data is handled securely
- IP addresses are anonymized in reports
- Data retention policy: 30 days
- Encrypted data storage
- Access controlled to admin users
- Regular backups maintained

## 🚀 Integration

This monitoring folder integrates with:
- Admin panel (real-time stats)
- Backend API (automatic logging)
- Analytics dashboard (data visualization)
- Email alerts (anomaly detection)

## 📞 Support

For monitoring-related questions:
1. Check session files
2. Review analytics data
3. Check logs for errors
4. Review metrics for performance

---

**Last Updated**: January 1, 2026
**Version**: 1.0.0
**Status**: Active Monitoring
