import mongoose from 'mongoose';
import dotenv from "dotenv"
dotenv.config()

/**
 * Connect to MongoDB with retry/backoff.
 *
 * Previously any connection error called `process.exit(1)`, which hard-killed
 * the whole server — taking down realtime collaboration and sockets that don't
 * even depend on the database. Now we retry with exponential backoff and let
 * Mongoose auto-reconnect, so a transient DB blip (or an Atlas IP-whitelist
 * delay) degrades gracefully instead of crashing the process.
 *
 * If `DBURI` is missing we still exit(1): that's a hard misconfiguration, not a
 * transient condition.
 */

const MAX_ATTEMPTS = Number(process.env.DB_MAX_RETRIES || 5);

async function connectWithRetry(attempt = 1) {
    const DBURI = process.env.DBURI;
    if (!DBURI) {
        console.error("❌ DBURI is not defined in environment variables");
        process.exit(1);
    }

    try {
        await mongoose.connect(DBURI, {
            serverSelectionTimeoutMS: 10000,
        });
        console.log("🚀 Database connected successfully");
    } catch (err) {
        console.error(`❌ Database connection error (attempt ${attempt}/${MAX_ATTEMPTS}):`, err.message);
        if (attempt < MAX_ATTEMPTS) {
            const delay = Math.min(30000, 2000 * 2 ** (attempt - 1)); // 2s, 4s, 8s, 16s, capped 30s
            console.log(`↻ Retrying database connection in ${delay / 1000}s…`);
            setTimeout(() => connectWithRetry(attempt + 1), delay);
        } else {
            console.error("⚠️  Database unreachable after retries. The server stays up so realtime " +
                "collaboration and sockets keep working; database-backed routes will return errors " +
                "until connectivity is restored (Mongoose will keep trying to reconnect).");
        }
    }
}

mongoose.connection.on("disconnected", () => console.warn("⚠️  MongoDB disconnected"));
mongoose.connection.on("reconnected", () => console.log("🔁 MongoDB reconnected"));

connectWithRetry();
