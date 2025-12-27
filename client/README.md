# YourCodeMate Frontend

A futuristic, ultra-responsive frontend for the YourCodeMate coding platform built with React, TypeScript, and Tailwind CSS.

## Features

- 🎨 **Modern UI/UX**: Futuristic design with smooth animations and micro-interactions
- 🌓 **Dark/Light Mode**: Seamless theme switching
- 📱 **Fully Responsive**: Works flawlessly on desktop, tablet, and mobile
- ⚡ **High Performance**: Optimized with lazy loading, code splitting, and caching
- 🔐 **Authentication**: Secure login and registration flows
- 💻 **Code Editor**: Monaco Editor integration for code editing
- 🤖 **AI Features**: AI Mentor chat and code evaluation
- 📊 **Data Visualization**: Charts and graphs for progress tracking
- 🎮 **Gamification**: Points, badges, levels, and leaderboards
- 👨‍💼 **Admin Panel**: Full CRUD operations for test management

## Tech Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **React Query** - Data fetching and caching
- **React Router** - Routing
- **Monaco Editor** - Code editor
- **Recharts** - Data visualization
- **Axios** - HTTP client
- **React Hot Toast** - Notifications

## Getting Started

### Prerequisites

- Node.js 18+ and pnpm (or npm/yarn)

### Installation

1. Navigate to the client directory:
```bash
cd client
```

2. Install dependencies:
```bash
pnpm install
# or
npm install
# or
yarn install
```

3. Create a `.env` file in the client directory:
```env
VITE_API_URL=http://localhost:5000
```

4. Start the development server:
```bash
pnpm dev
# or
npm run dev
# or
yarn dev
```

The app will be available at `http://localhost:3000`

### Build for Production

```bash
pnpm build
# or
npm run build
# or
yarn build
```

The production build will be in the `dist` directory.

## Project Structure

```
client/
├── src/
│   ├── components/      # Reusable components
│   │   ├── Layout.tsx
│   │   ├── ProtectedRoute.tsx
│   │   └── AdminRoute.tsx
│   ├── contexts/         # React contexts
│   │   ├── AuthContext.tsx
│   │   └── ThemeContext.tsx
│   ├── pages/           # Page components
│   │   ├── Dashboard.tsx
│   │   ├── CodingTests.tsx
│   │   ├── TestDetail.tsx
│   │   ├── IDE.tsx
│   │   ├── AIMentor.tsx
│   │   ├── Leaderboard.tsx
│   │   ├── LearningPaths.tsx
│   │   ├── Interview.tsx
│   │   ├── Progress.tsx
│   │   ├── AdminPanel.tsx
│   │   ├── Login.tsx
│   │   ├── Register.tsx
│   │   └── NotFound.tsx
│   ├── services/        # API services
│   │   └── api.ts
│   ├── types/           # TypeScript types
│   │   └── index.ts
│   ├── utils/           # Utility functions
│   │   ├── api.ts
│   │   └── cn.ts
│   ├── App.tsx          # Main app component
│   ├── main.tsx         # Entry point
│   └── index.css        # Global styles
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── tailwind.config.js
```

## Key Features Implementation

### Authentication
- JWT token-based authentication
- Protected routes
- Auto-logout on token expiration
- User context management

### Dashboard
- Real-time stats display
- Progress charts
- Test cards with unlock status
- Notifications

### Coding Tests
- Test listing with filters
- Detailed test view
- Code editor integration
- Hint system
- Solution submission

### IDE
- Multi-language support (JavaScript, Python, Java, C++)
- Real-time code execution
- Output display
- Syntax highlighting

### AI Mentor
- Chat interface
- Real-time responses
- Message history
- Loading states

### Leaderboard
- Top performers display
- User rank tracking
- Badge visualization

### Admin Panel
- Create, edit, delete tests
- Test case management
- Form validation

## API Integration

All API endpoints are integrated through the `services/api.ts` file. The API base URL can be configured via the `VITE_API_URL` environment variable.

## Styling

The app uses Tailwind CSS with custom configuration. Dark mode is the default, with light mode support. The design features:
- Glass morphism effects
- Gradient backgrounds
- Smooth animations
- Responsive breakpoints

## Performance Optimizations

- Code splitting with React.lazy
- React Query for efficient data fetching and caching
- Memoization where appropriate
- Optimized bundle size
- Lazy loading of heavy components

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

This project is part of the YourCodeMate platform.


