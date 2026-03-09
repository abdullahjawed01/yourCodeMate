import express from "express"
import dotenv from "dotenv"
import cors from 'cors';
import helmet from "helmet";
dotenv.config()


// Config
const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(cors({
    origin: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : '*',
    credentials: true
}));
app.use(helmet({
    contentSecurityPolicy: false, // Disable for easier dev/initial prod if using external assets
}));
app.use(express.json());

// Main Router
const apiRouter = express.Router();

// imports 
import "./utils/dbConnect.js"
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import ideRoutes from "./routes/ideRoutes.js";
import codingTestRoutes from "./routes/codingTestRoutes.js";
import aiMentorRoutes from "./routes/aiMentorRoutes.js";
import learningPathRoutes from "./routes/learningPathRoutes.js";
import recommendationRoutes from "./routes/recommendationRoutes.js";
import progressRoutes from "./routes/progressRoutes.js";
import gamificationRoutes from "./routes/gamificationRoutes.js";
import leaderboardRoutes from "./routes/leaderboardRoutes.js";
import pathRoutes from "./routes/pathRoutes.js";
import testRoutes from "./routes/testRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import adminTestRoutes from "./routes/adminTestRoutes.js";
import interviewRoutes from "./routes/interviewRoutes.js"
import hintRoutes from "./routes/hintRoutes.js"
import routeRoutes from "./routes/routeRoutes.js"
import languageRoutes from "./routes/languageRoutes.js"
import contestRoutes from "./routes/contestRoutes.js"
import chatRoutes from "./routes/chatRoutes.js"
import socialRoutes from "./routes/socialRoutes.js"
import communityRoutes from "./routes/communityRoutes.js"


// Route API
apiRouter.use("/auth", authRoutes);
apiRouter.use(userRoutes);
apiRouter.use("/progress", progressRoutes);
apiRouter.use(ideRoutes);
apiRouter.use(codingTestRoutes);
apiRouter.use(aiMentorRoutes);
apiRouter.use(learningPathRoutes);
apiRouter.use(recommendationRoutes);
apiRouter.use("/test", testRoutes);
apiRouter.use("/path", pathRoutes);
apiRouter.use("/dashboard", dashboardRoutes);
apiRouter.use("/gamification", gamificationRoutes);
apiRouter.use("/ai", aiRoutes);
apiRouter.use("/leaderboard", leaderboardRoutes);
apiRouter.use("/interview", interviewRoutes);
apiRouter.use("/hint", hintRoutes);
apiRouter.use("/admin", adminTestRoutes);
apiRouter.use("/routes", routeRoutes);
apiRouter.use("/learn", languageRoutes);
apiRouter.use("/contests", contestRoutes);
apiRouter.use("/social", socialRoutes);
apiRouter.use("/chat-api", chatRoutes);
apiRouter.use("/community", communityRoutes);

// Register API Router
app.use("/api", apiRouter);

// Health check
app.get("/health", (req, res) => {
    res.status(200).json({ status: "ok", time: new Date() });
});

// For production static serving (Optional if using Nginx)
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../client/dist")));
    app.get("*", (req, res) => {
        if (!req.path.startsWith("/api") && !req.path.startsWith("/socket.io")) {
            res.sendFile(path.resolve(__dirname, "../client", "dist", "index.html"));
        }
    });
}

import http from "http";
import { Server } from "socket.io";

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: process.env.FRONTEND_URL || "*",
        methods: ["GET", "POST"]
    }
});

// Socket logic
io.on("connection", (socket) => {
    socket.on("join_room", (roomId) => {
        socket.join(roomId);
    });

    socket.on("send_message", (data) => {
        io.to(data.room).emit("receive_message", data);
    });

    socket.on("disconnect", () => {
        // Handle disconnect
    });
});

/// Listen
server.listen(PORT, () => {
    console.log(`🚀 Production-ready server running on port ${PORT}`);
    console.log(`📡 API available at /api`);
    console.log(`⚡ WebSocket enabled`);
});