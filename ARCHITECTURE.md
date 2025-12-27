# YourCodeMate - Architecture Documentation

## 🏗️ Application Architecture

### Overview

YourCodeMate is a full-stack learning platform built with:
- **Frontend**: React 18 + TypeScript + Vite
- **Backend**: Node.js + Express.js
- **Database**: MongoDB with Mongoose
- **AI**: Groq AI for code evaluation and explanations
- **Styling**: Tailwind CSS with custom design system

---

## 📁 Project Structure

```
yourCodeMate/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   │   ├── ui/        # Base UI components (Button, Card, Input, etc.)
│   │   │   ├── Layout.tsx # Main layout with navbar/sidebar
│   │   │   └── Footer.tsx
│   │   ├── contexts/      # React contexts
│   │   │   ├── AuthContext.tsx
│   │   │   └── ThemeContext.tsx
│   │   ├── pages/         # Page components
│   │   │   ├── Dashboard.tsx
│   │   │   ├── Tests.tsx
│   │   │   ├── TestDetail.tsx
│   │   │   ├── Interview.tsx
│   │   │   ├── PythonLearning.tsx
│   │   │   ├── Leaderboard.tsx
│   │   │   ├── Progress.tsx
│   │   │   ├── IDE.tsx
│   │   │   ├── AIMentor.tsx
│   │   │   └── ...
│   │   ├── services/      # API service layer
│   │   │   └── api.ts     # All API endpoints
│   │   ├── utils/         # Utility functions
│   │   │   ├── api.ts     # Axios instance
│   │   │   └── cn.ts      # Class name utility
│   │   ├── types/         # TypeScript types
│   │   ├── App.tsx        # Main app with routing
│   │   └── main.tsx       # Entry point
│   └── package.json
│
└── server/                 # Backend Express application
    ├── controllers/        # Route controllers
    │   ├── testController.js
    │   ├── interviewController.js
    │   ├── hintController.js
    │   ├── aiController.js
    │   └── ...
    ├── models/            # Mongoose models
    │   ├── User.js
    │   ├── CodingTest.js
    │   ├── Progress.js
    │   ├── InterviewSession.js
    │   └── ...
    ├── routes/            # Express routes
    │   ├── testRoutes.js
    │   ├── interviewRoutes.js
    │   ├── hintRoutes.js
    │   └── ...
    ├── middleware/        # Express middleware
    │   └── authMiddleware.js
    ├── utils/             # Utility functions
    │   ├── dbConnect.js
    │   └── groqClient.js
    └── app.js             # Express app setup
```

---

## 🔄 Data Flow Architecture

### Frontend → Backend Flow

```
User Action
    ↓
React Component
    ↓
API Service (api.ts)
    ↓
Axios Instance (utils/api.ts)
    ↓
HTTP Request
    ↓
Express Route
    ↓
Middleware (Auth)
    ↓
Controller
    ↓
Model (Mongoose)
    ↓
MongoDB
```

### Example: Test Submission

```
1. User writes code in TestDetail.tsx
   ↓
2. User clicks "Submit" button
   ↓
3. handleSubmit() calls aiApi.evaluateCode()
   ↓
4. api.ts makes POST /ai/submit
   ↓
5. Backend: aiRoutes.js → aiController.js
   ↓
6. Controller validates, calls Groq AI
   ↓
7. Updates Progress model in MongoDB
   ↓
8. Returns { score, feedback, improvements }
   ↓
9. Frontend displays result
   ↓
10. React Query invalidates cache
   ↓
11. Dashboard updates automatically
```

---

## 🎨 UI/UX Architecture

### Design System

**Color Palette:**
- Primary: Blue (`primary-600`, `primary-700`)
- Success: Green (`green-600`)
- Warning: Yellow (`yellow-600`)
- Danger: Red (`red-600`)
- Neutral: Gray scale

**Components:**
- `Button`: Multiple variants (default, outline, ghost, destructive)
- `Card`: Container with hover effects
- `Input`: Form input with icons
- `Modal`: Overlay dialogs
- `Badge`: Status indicators
- `LoadingSpinner`: Loading states

**Layout:**
- **Top Navbar**: Quick navigation (desktop), menu toggle (mobile)
- **Sidebar**: Full navigation menu, collapsible on mobile
- **Main Content**: Page-specific content
- **Footer**: Links and copyright

### Responsive Design

- **Mobile**: < 640px - Drawer sidebar, stacked layout
- **Tablet**: 640px - 1024px - Collapsible sidebar, grid layouts
- **Desktop**: > 1024px - Full sidebar, multi-column layouts

---

## 🔐 Authentication Flow

```
1. User registers/logs in
   ↓
2. Backend validates credentials
   ↓
3. Backend generates JWT token
   ↓
4. Frontend stores token in localStorage
   ↓
5. Axios interceptor adds token to requests
   ↓
6. Protected routes check token
   ↓
7. Token expires → Auto logout
```

### Protected Routes

- `/dashboard` - Requires auth
- `/test` - Public (list), Protected (submit)
- `/tests/:id` - Public (view), Protected (submit)
- `/interview` - Requires auth
- `/python` - Requires auth
- `/admin/*` - Requires auth + admin role

---

## 📊 State Management

### React Query (Server State)

- **Caching**: Automatic caching of API responses
- **Refetching**: On window focus, network reconnect
- **Mutations**: Optimistic updates for better UX
- **Invalidation**: Automatic cache invalidation on mutations

### React Context (Client State)

- **AuthContext**: User data, login/logout
- **ThemeContext**: Dark/light mode

### Local State (Component State)

- Form inputs
- UI toggles (modals, dropdowns)
- Temporary data

---

## 🧪 Testing Features

### Test Flow

1. **List Tests** (`GET /test`)
   - Fetches all available tests
   - Displays in grid/list view
   - Search and filter functionality

2. **View Test** (`GET /test/:id`)
   - Shows problem description
   - Displays test cases
   - Code editor (Monaco Editor)

3. **Submit Solution** (`POST /ai/submit`)
   - Sends code to backend
   - AI evaluates code
   - Returns score, feedback, improvements
   - Updates user progress

4. **Get Hint** (`POST /hint`)
   - Deducts points (hintCost)
   - Returns AI-generated hint
   - Updates user notifications

---

## 🎤 Interview Features

### Interview Flow

1. **Start Interview** (`POST /interview/start`)
   - User selects role and level
   - Backend creates session
   - AI generates first question

2. **Submit Answer** (`POST /interview/answer`)
   - User types answer
   - Backend evaluates with AI
   - Returns score and feedback
   - Updates user progress

3. **Continue Interview**
   - Frontend manages question state
   - Backend tracks session progress
   - Multiple questions per session

---

## 🐍 Python Learning System

### Learning Path Flow

1. **Get Topics** (`GET /python/topics`)
   - Returns all Python topics
   - Includes unlock status
   - Shows progress

2. **Complete Topic** (`POST /python/topics/complete`)
   - Marks topic as completed
   - Awards points
   - Unlocks next topic

3. **Take Test** (uses test system)
   - Associated test for each topic
   - Must pass to progress

4. **Use Hint** (`POST /python/hint/use`)
   - Deducts points
   - Unlocks hint for test

---

## 💡 Hint System

### Hint Flow

1. **Request Hint** (`POST /hint`)
   - Checks user has enough points
   - Deducts hintCost
   - Generates/returns hint
   - Updates notifications

2. **Python Learning Hints** (`POST /python/hint/use`)
   - Similar flow
   - Integrated with learning system

---

## ⭐ Points & Levels System

### Points Calculation

- **Test Completion**: Score = points earned (0-100)
- **Interview Answers**: Score = points earned (0-100)
- **Topic Completion**: Fixed points per topic
- **Hint Usage**: Deducts hintCost

### Level Calculation

```
Level = floor(points / 100) + 1
```

### Unlock Logic

- Tests unlock based on `unlockLevel`
- Topics unlock based on prerequisites
- Hints unlock based on points

---

## 🔄 Real-time Updates

### React Query Cache Invalidation

When user completes action:
1. Mutation succeeds
2. Cache invalidated for related queries
3. Components refetch automatically
4. UI updates seamlessly

**Example:**
```typescript
// After test submission
queryClient.invalidateQueries({ queryKey: ['dashboard'] });
queryClient.invalidateQueries({ queryKey: ['tests'] });
queryClient.invalidateQueries({ queryKey: ['progress'] });
```

---

## 🚀 Performance Optimizations

### Frontend

- **Code Splitting**: Lazy loading of pages
- **React Query**: Automatic caching and deduplication
- **Memoization**: React.memo for expensive components
- **Virtual Scrolling**: For long lists (if needed)

### Backend

- **Database Indexing**: On frequently queried fields
- **Lean Queries**: Using `.lean()` for read operations
- **Pagination**: For large datasets (future)
- **Caching**: Redis (future)

---

## 🔒 Security

### Frontend

- JWT stored in localStorage (consider httpOnly cookies for production)
- Protected routes with `ProtectedRoute` component
- Admin routes with `AdminRoute` component
- Input validation on forms

### Backend

- JWT authentication middleware
- Password hashing with bcrypt
- Input validation
- CORS configuration
- Rate limiting (recommended for production)

---

## 📱 Responsive Breakpoints

```css
sm: 640px   /* Mobile landscape */
md: 768px   /* Tablet */
lg: 1024px  /* Desktop */
xl: 1280px  /* Large desktop */
```

---

## 🎯 Key Features Implementation

### 1. Tests
- ✅ List all tests
- ✅ View test details
- ✅ Submit solutions
- ✅ AI evaluation
- ✅ Score and feedback
- ✅ Hint system
- ✅ Progress tracking

### 2. Interviews
- ✅ Start interview session
- ✅ Submit answers
- ✅ AI evaluation
- ✅ Score and feedback
- ✅ Progress tracking

### 3. Python Learning
- ✅ Topic list
- ✅ Topic completion
- ✅ Associated tests
- ✅ Hint system
- ✅ Progress tracking

### 4. Points & Levels
- ✅ Real-time calculation
- ✅ Display in navbar
- ✅ Unlock logic
- ✅ Badge system

### 5. Navigation
- ✅ Top navbar (desktop)
- ✅ Sidebar (mobile/desktop)
- ✅ Active route highlighting
- ✅ Smooth transitions

---

## 🛠️ Development Workflow

### Starting Development

```bash
# Terminal 1: Backend
cd server
npm install
npm start

# Terminal 2: Frontend
cd client
npm install
npm run dev
```

### Adding New Feature

1. **Backend**:
   - Create model (if needed)
   - Create controller
   - Create route
   - Test with Postman/curl

2. **Frontend**:
   - Add API function in `services/api.ts`
   - Create page/component
   - Add route in `App.tsx`
   - Add to navigation

3. **Integration**:
   - Test end-to-end
   - Handle errors
   - Add loading states
   - Update documentation

---

## 📚 Additional Resources

- **API Documentation**: See `API_DOCUMENTATION.md`
- **Backend Routes**: See `server/routes/`
- **Frontend Services**: See `client/src/services/api.ts`
- **Components**: See `client/src/components/`

---

## 🎉 Summary

YourCodeMate is a production-ready, full-stack learning platform with:
- ✅ Complete API integration
- ✅ Modern, minimal UI/UX
- ✅ Real-time updates
- ✅ AI-powered features
- ✅ Comprehensive documentation
- ✅ Scalable architecture

All features work end-to-end with real backend APIs. No mock data, no placeholders, no broken buttons! 🚀

