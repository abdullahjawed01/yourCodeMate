import express from "express"
import dotenv from "dotenv"
import cors from 'cors';
import helmet from "helmet";
dotenv.config()


// vars
const app = express()
const PORT = process.env.PORT
app.use(cors());
app.use(helmet());
app.use(express.json());




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
import adminRoutes from "./routes/adminTestRoutes.js"
import routeRoutes from "./routes/routeRoutes.js"
import pythonRoutes from "./routes/pythonRoutes.js"
import javascriptRoutes from "./routes/javascriptRoutes.js"







// test api
app.get("/",(req,res)=>{
    try {
        res.status(200).json("The backend is running")
    } catch (error) {
        console.log(error);
        res.status(500).json(error)
    }
})



// routes



//public
app.use( authRoutes);
app.use("/auth", authRoutes);
//private
app.use(userRoutes)
app.use("/progress", progressRoutes);
app.use(ideRoutes);
app.use(codingTestRoutes);
app.use(aiMentorRoutes);
app.use(learningPathRoutes);
app.use(recommendationRoutes);
app.use("/test", testRoutes);
app.use("/path", pathRoutes);
app.use("/dashboard", dashboardRoutes);
app.use("/gamification", gamificationRoutes);
app.use("/admin/test", adminTestRoutes);
app.use("/ai", aiRoutes);
app.use("/leaderboard", leaderboardRoutes);
app.use("/interview", interviewRoutes);
app.use("/hint", hintRoutes);
app.use("/admin", adminRoutes);
app.use("/routes", routeRoutes);
app.use("/python", pythonRoutes);
app.use("/javascript", javascriptRoutes);

/// exit listen
app.listen(PORT,()=>{
    console.log(`The server is up and running on http://localhost:${PORT}`);
})