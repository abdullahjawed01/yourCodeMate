# YourCodeMate API Documentation

## 📚 Complete API Reference

This document provides comprehensive documentation for all backend APIs, their usage, and integration examples.

---

## 🔐 Base URL

```
Development: http://localhost:5000
Production: [Your Production URL]
```

---

## 🔑 Authentication

Most endpoints require authentication via JWT token. Include the token in the request header:

```http
Authorization: Bearer <your_jwt_token>
```

---

## 📋 API Endpoints

### Authentication

#### Register User
```http
POST /auth/register
```

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword123"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "level": 1,
    "points": 0
  }
}
```

#### Login User
```http
POST /auth/login
```

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "securepassword123"
}
```

**Response:** Same as Register

---

### User Management

#### Get Current User
```http
GET /me
Authorization: Bearer <token>
```

**Response:**
```json
{
  "message": "User found",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "level": 5,
    "points": 450,
    "isAdmin": false
  }
}
```

---

### Coding Tests

#### Get All Tests (Public)
```http
GET /test
```

**Response:**
```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "title": "Reverse String",
    "description": "Write a function to reverse a string",
    "difficulty": "easy",
    "maxScore": 100,
    "hintCost": 10,
    "unlockLevel": 1,
    "testCases": [
      {
        "input": "hello",
        "expectedOutput": "olleh"
      }
    ],
    "hints": ["Think about using array methods"],
    "tags": ["strings", "algorithms"],
    "estimatedTime": 30
  }
]
```

#### Get Test by ID
```http
GET /test/:id
```

**Response:** Single test object (same structure as above)

#### Get User Tests (With Progress)
```http
GET /test/dashboard
Authorization: Bearer <token>
```

**Response:**
```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "title": "Reverse String",
    "description": "Write a function to reverse a string",
    "difficulty": "easy",
    "unlocked": true,
    "completed": false,
    "maxScore": 100,
    "hintCost": 10
  }
]
```

#### Submit Test Solution
```http
POST /tests/submit
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "testId": "507f1f77bcf86cd799439011",
  "code": "function reverse(str) { return str.split('').reverse().join(''); }",
  "language": "javascript"
}
```

**Response:**
```json
{
  "score": 85,
  "feedback": "Good solution! Consider edge cases.",
  "improvements": [
    "Handle null/undefined inputs",
    "Add input validation"
  ]
}
```

---

### AI Code Evaluation

#### Evaluate Code with AI
```http
POST /ai/submit
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "testId": "507f1f77bcf86cd799439011",
  "code": "function reverse(str) { return str.split('').reverse().join(''); }"
}
```

**Response:**
```json
{
  "score": 85,
  "feedback": "Your code works correctly for the test cases. Consider adding input validation.",
  "improvements": [
    "Add null/undefined checks",
    "Handle empty strings"
  ],
  "isNewCompletion": true,
  "newLevel": 2,
  "newPoints": 185
}
```

#### Explain Code
```http
POST /ai/explain
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "code": "function reverse(str) { return str.split('').reverse().join(''); }"
}
```

**Response:**
```json
{
  "explanation": "This function reverses a string by: 1) Splitting into array, 2) Reversing array, 3) Joining back to string."
}
```

---

### Hints

#### Get Hint for Test
```http
POST /hint
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "testId": "507f1f77bcf86cd799439011"
}
```

**Response:**
```json
{
  "hint": "💡 Hint: Try breaking the problem into smaller steps.",
  "message": "💡 Hint unlocked using points"
}
```

**Note:** This endpoint deducts points (hintCost) from user's account.

---

### Interviews

#### Start Interview Session
```http
POST /interview/start
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "role": "frontend",
  "level": "junior"
}
```

**Response:**
```json
{
  "message": "Interview started",
  "sessionId": "507f1f77bcf86cd799439011",
  "question": "Explain the difference between let, const, and var in JavaScript."
}
```

#### Submit Interview Answer
```http
POST /interview/answer
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "sessionId": "507f1f77bcf86cd799439011",
  "answer": "let and const are block-scoped, while var is function-scoped..."
}
```

**Response:**
```json
{
  "score": 85,
  "feedback": "Good explanation! You covered the main differences correctly.",
  "totalScore": 85
}
```

---

### Dashboard

#### Get User Dashboard
```http
GET /dashboard
Authorization: Bearer <token>
```

**Response:**
```json
{
  "points": 450,
  "level": 5,
  "badges": ["High Scorer", "Quick Learner"],
  "notifications": [
    {
      "message": "✅ Test completed: Reverse String",
      "date": "2024-01-15T10:30:00Z"
    }
  ],
  "tests": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "title": "Reverse String",
      "description": "Write a function to reverse a string",
      "difficulty": "easy",
      "unlocked": true,
      "completed": true,
      "maxScore": 100,
      "hintCost": 10
    }
  ]
}
```

---

### Progress

#### Get User Progress
```http
GET /progress/me
Authorization: Bearer <token>
```

**Response:**
```json
{
  "points": 450,
  "level": 5,
  "badges": ["High Scorer", "Quick Learner"],
  "completedTests": ["507f1f77bcf86cd799439011"],
  "notifications": [
    {
      "message": "✅ Test completed: Reverse String"
    }
  ]
}
```

#### Update Progress
```http
POST /progress/progress
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "points": 50,
  "level": 2
}
```

---

### Leaderboard

#### Get Leaderboard
```http
GET /leaderboard
```

**Response:**
```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "points": 1000,
    "level": 10,
    "badges": ["High Scorer"]
  }
]
```

#### Get User Rank
```http
GET /leaderboard/me
Authorization: Bearer <token>
```

**Response:**
```json
{
  "rank": 5,
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "points": 450,
    "level": 5
  }
}
```

---

### IDE

#### Run Code
```http
POST /ide/run
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "code": "console.log('Hello, World!');",
  "language": "javascript"
}
```

**Response:**
```json
{
  "output": "Hello, World!\n",
  "error": null
}
```

---

### AI Mentor

#### Ask AI Mentor
```http
POST /mentor/ask
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "question": "What is the difference between == and === in JavaScript?",
  "context": "I'm learning JavaScript basics"
}
```

**Response:**
```json
{
  "answer": "== performs type coercion, while === checks both value and type..."
}
```

---

### Python Learning

#### Get Python Topics
```http
GET /python/topics
Authorization: Bearer <token>
```

**Response:**
```json
{
  "topics": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "title": "Data Types",
      "description": "Learn about Python data types",
      "content": "# Data Types\n\nPython has several built-in data types...",
      "order": 1,
      "points": 10,
      "unlocked": true,
      "completed": false,
      "testId": "507f1f77bcf86cd799439012"
    }
  ],
  "progress": {
    "totalPoints": 50,
    "hintsUnlocked": 3
  }
}
```

#### Complete Topic
```http
POST /python/topics/complete
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "topicId": "507f1f77bcf86cd799439011"
}
```

#### Use Hint (Python Learning)
```http
POST /python/hint/use
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "testId": "507f1f77bcf86cd799439011"
}
```

---

### Admin Routes

#### Create Test (Admin Only)
```http
POST /admin/test
Authorization: Bearer <admin_token>
```

**Request Body:**
```json
{
  "title": "New Test",
  "description": "Test description",
  "difficulty": "medium",
  "maxScore": 100,
  "hintCost": 10,
  "unlockLevel": 2,
  "testCases": [
    {
      "input": "test",
      "expectedOutput": "tset"
    }
  ],
  "hints": ["Hint 1", "Hint 2"],
  "tags": ["algorithms"],
  "estimatedTime": 30
}
```

---

## 🐍 Python API Usage Examples

### Using `requests` Library

```python
import requests

BASE_URL = "http://localhost:5000"

# Register User
def register_user(name, email, password):
    response = requests.post(
        f"{BASE_URL}/auth/register",
        json={"name": name, "email": email, "password": password}
    )
    return response.json()

# Login
def login(email, password):
    response = requests.post(
        f"{BASE_URL}/auth/login",
        json={"email": email, "password": password}
    )
    data = response.json()
    return data["token"]

# Get All Tests
def get_tests():
    response = requests.get(f"{BASE_URL}/test")
    return response.json()

# Submit Test Solution
def submit_test(token, test_id, code, language="javascript"):
    headers = {"Authorization": f"Bearer {token}"}
    response = requests.post(
        f"{BASE_URL}/tests/submit",
        headers=headers,
        json={"testId": test_id, "code": code, "language": language}
    )
    return response.json()

# Get Dashboard
def get_dashboard(token):
    headers = {"Authorization": f"Bearer {token}"}
    response = requests.get(f"{BASE_URL}/dashboard", headers=headers)
    return response.json()

# Example Usage
if __name__ == "__main__":
    # Register
    user_data = register_user("John Doe", "john@example.com", "password123")
    token = user_data["token"]
    
    # Get tests
    tests = get_tests()
    print(f"Found {len(tests)} tests")
    
    # Submit solution
    if tests:
        test_id = tests[0]["_id"]
        code = "function reverse(str) { return str.split('').reverse().join(''); }"
        result = submit_test(token, test_id, code)
        print(f"Score: {result['score']}/100")
        print(f"Feedback: {result['feedback']}")
    
    # Get dashboard
    dashboard = get_dashboard(token)
    print(f"Points: {dashboard['points']}")
    print(f"Level: {dashboard['level']}")
```

### Using FastAPI Client

```python
from fastapi import FastAPI, HTTPException
import httpx

app = FastAPI()
BASE_URL = "http://localhost:5000"

@app.post("/submit-test")
async def submit_test_endpoint(token: str, test_id: str, code: str):
    async with httpx.AsyncClient() as client:
        response = await client.post(
            f"{BASE_URL}/tests/submit",
            headers={"Authorization": f"Bearer {token}"},
            json={"testId": test_id, "code": code, "language": "javascript"}
        )
        return response.json()
```

### Using Flask

```python
from flask import Flask, request, jsonify
import requests

app = Flask(__name__)
BASE_URL = "http://localhost:5000"

@app.route('/api/submit-test', methods=['POST'])
def submit_test():
    data = request.json
    token = data.get('token')
    test_id = data.get('test_id')
    code = data.get('code')
    
    response = requests.post(
        f"{BASE_URL}/tests/submit",
        headers={"Authorization": f"Bearer {token}"},
        json={"testId": test_id, "code": code, "language": "javascript"}
    )
    
    return jsonify(response.json())
```

---

## 🔄 Frontend ↔ Backend Data Flow

### Test Submission Flow

1. **User writes code** → Frontend stores in state
2. **User clicks Submit** → Frontend calls `aiApi.evaluateCode()`
3. **API Request** → `POST /ai/submit` with `{ testId, code }`
4. **Backend Processing**:
   - Validates test exists
   - Sends code to Groq AI for evaluation
   - Calculates score and feedback
   - Updates user progress (points, level, badges)
   - Checks for plagiarism
5. **Response** → Returns `{ score, feedback, improvements, isNewCompletion, newLevel, newPoints }`
6. **Frontend Update**:
   - Displays score and feedback
   - Updates dashboard stats
   - Shows success notification
   - Invalidates React Query cache

### Interview Flow

1. **User starts interview** → Frontend calls `interviewApi.startInterview()`
2. **API Request** → `POST /interview/start` with `{ role, level }`
3. **Backend Processing**:
   - Creates InterviewSession
   - Generates first question using Groq AI
   - Returns session ID and question
4. **Frontend** → Displays question, stores session ID
5. **User submits answer** → Frontend calls `interviewApi.submitAnswer()`
6. **API Request** → `POST /interview/answer` with `{ sessionId, answer }`
7. **Backend Processing**:
   - Finds unanswered question
   - Evaluates answer with Groq AI
   - Updates session with score and feedback
   - Updates user progress (points, level)
8. **Response** → Returns `{ score, feedback, totalScore }`
9. **Frontend** → Updates UI, shows feedback, prepares for next question

### Hint System Flow

1. **User requests hint** → Frontend calls `hintApi.getHint()`
2. **API Request** → `POST /hint` with `{ testId }`
3. **Backend Processing**:
   - Validates user has enough points
   - Deducts hintCost from user points
   - Generates AI hint (or returns stored hint)
   - Updates user notifications
4. **Response** → Returns `{ hint, message }`
5. **Frontend** → Displays hint, updates points display

---

## 📊 Error Handling

All endpoints return standard error responses:

```json
{
  "message": "Error description here"
}
```

**Common Status Codes:**
- `200` - Success
- `400` - Bad Request (missing/invalid parameters)
- `401` - Unauthorized (invalid/missing token)
- `404` - Not Found (resource doesn't exist)
- `500` - Internal Server Error

---

## 🔒 Security Notes

1. **JWT Tokens**: Store securely, never expose in client-side code
2. **Password**: Always hash on backend (already implemented)
3. **Rate Limiting**: Consider implementing for production
4. **CORS**: Configure properly for production
5. **Input Validation**: Always validate user input

---

## 📝 Notes

- All timestamps are in ISO 8601 format
- Points are calculated automatically on test/interview completion
- Levels are calculated as: `floor(points / 100) + 1`
- Hints cost points (defined per test as `hintCost`)
- Admin routes require `isAdmin: true` in user object

---

## 🚀 Quick Start

1. **Start Backend**: `cd server && npm start`
2. **Start Frontend**: `cd client && npm run dev`
3. **Register/Login** to get JWT token
4. **Use token** in Authorization header for protected routes
5. **Start coding!** 🎉

---

For more details, see the source code in `server/controllers/` and `client/src/services/api.ts`.

