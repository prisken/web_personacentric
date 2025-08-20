# External Quiz Integration Guide

## Overview
This document describes how to integrate external quiz platforms with our point redemption system.

## API Endpoints

### 1. Quiz Configuration
**GET** `/api/external-quiz/quiz/:external_id/config`

Returns quiz configuration for external platforms.

**Response:**
```json
{
  "success": true,
  "quiz_config": {
    "quiz_id": "external_quiz_123",
    "title": "投資理財基礎測驗",
    "description": "測試您的投資理財知識",
    "max_points": 100,
    "min_score_for_points": 70,
    "point_calculation_method": "percentage"
  }
}
```

### 2. Quiz Completion Webhook
**POST** `/api/external-quiz/webhook/quiz-completion`

Send quiz completion data to award points.

**Request Body:**
```json
{
  "quiz_id": "external_quiz_123",
  "user_email": "user@example.com",
  "score_percentage": 85,
  "time_taken": 1200,
  "answers": [
    {"question_id": 1, "answer": "A"},
    {"question_id": 2, "answer": "B"}
  ],
  "external_quiz_data": {
    "platform": "quizlet",
    "session_id": "session_123"
  }
}
```

**Response:**
```json
{
  "success": true,
  "points_earned": 85,
  "user_total_points": 285
}
```

## Integration Steps

1. **Register Quiz**: Admin creates quiz entry with external_quiz_id
2. **Get Configuration**: Fetch quiz config before starting quiz
3. **Complete Quiz**: Send completion data via webhook
4. **Verify Points**: Check response for points awarded

## Security Considerations

- Implement webhook signature validation
- Use HTTPS for all communications
- Validate user email ownership
- Rate limit webhook calls
- Log all webhook activities

## Point Calculation Methods

### Percentage-based
Points = (Score Percentage / 100) × Max Points

### Fixed Points
Points = Max Points (if score ≥ min_score_for_points)

### Custom Calculation
Implement custom logic based on quiz requirements

## Example Integration

### Step 1: Admin Creates External Quiz
```javascript
// Admin creates quiz in dashboard
{
  "title": "投資理財基礎測驗",
  "quiz_type": "external",
  "external_quiz_id": "investment_basics_001",
  "external_quiz_url": "https://external-platform.com/quiz/investment-basics",
  "max_points": 100,
  "point_calculation_method": "percentage",
  "min_score_for_points": 70
}
```

### Step 2: External Platform Gets Quiz Config
```javascript
const response = await fetch('/api/external-quiz/quiz/investment_basics_001/config');
const config = await response.json();
// Use config.quiz_config for quiz setup
```

### Step 3: Send Completion Webhook
```javascript
const webhookData = {
  quiz_id: "investment_basics_001",
  user_email: "user@example.com",
  score_percentage: 85,
  time_taken: 1200,
  answers: [...],
  external_quiz_data: {
    platform: "external_platform",
    session_id: "session_123"
  }
};

const response = await fetch('/api/external-quiz/webhook/quiz-completion', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(webhookData)
});
```

## Error Handling

### Common Error Responses
- `404 Quiz not found`: Invalid external_quiz_id
- `404 User not found`: User email not registered
- `500 Internal server error`: Server processing error

### Best Practices
- Always validate webhook responses
- Implement retry logic for failed webhooks
- Log all webhook attempts and responses
- Monitor webhook success rates

## Testing

### Test Webhook Endpoint
```bash
curl -X POST http://localhost:5001/api/external-quiz/webhook/quiz-completion \
  -H "Content-Type: application/json" \
  -d '{
    "quiz_id": "test_quiz_001",
    "user_email": "test@example.com",
    "score_percentage": 85,
    "time_taken": 600,
    "answers": [],
    "external_quiz_data": {"platform": "test"}
  }'
```

### Test Config Endpoint
```bash
curl http://localhost:5001/api/external-quiz/quiz/test_quiz_001/config
```

## Support

For integration support, contact the development team with:
- Platform name and description
- Expected quiz volume
- Integration timeline
- Technical requirements 