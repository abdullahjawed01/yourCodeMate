import mongoose from 'mongoose';
import dotenv from "dotenv"
dotenv.config()

async function conenct() {
    let DBURI = process.env.DBURI 
    await mongoose.connect(DBURI)
    console.log("The database is connected");
}
conenct()