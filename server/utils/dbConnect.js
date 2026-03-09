import mongoose from 'mongoose';
import dotenv from "dotenv"
dotenv.config()

async function conenct() {
    try {
        let DBURI = process.env.DBURI;
        if (!DBURI) {
            console.error("❌ DBURI is not defined in environment variables");
            process.exit(1);
        }
        await mongoose.connect(DBURI);
        console.log("🚀 Database connected successfully");
    } catch (err) {
        console.error("❌ Database connection error:", err.message);
        process.exit(1);
    }
}
conenct();