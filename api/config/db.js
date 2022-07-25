import mongoose from "mongoose";
import config from "config";

const db = config.get("mongoURL")

export const connectDB = async () => {
    try {
        await mongoose.connect(db);
        console.log("db connected")
    } catch (error) {
        console.error(error.message)
        //exit process with failure
        process.exit(1)
    }
}