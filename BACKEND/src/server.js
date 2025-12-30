import path from "path"
import { fileURLToPath } from "url"
import dotenv from "dotenv"
import cors from "cors"
// Configure dotenv FIRST before any other imports
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const envPath = path.join(__dirname, "../.env")
console.log("Loading .env from:", envPath)
const result = dotenv.config({ path: envPath });

if (result.error) {
    console.error("Error loading .env file:", result.error)
} else {
    console.log("Environment variables loaded successfully")
    console.log("STREAM_API_KEY:", process.env.STREAM_API_KEY)
    console.log("STREAM_SECRET_KEY:", process.env.STREAM_SECRET_KEY)
}

// Now import modules that depend on environment variables
import express from "express"
import  Authroutes from "./routes/auth.js";
import Userroutes from "./routes/user.js"
import Chatroutes from "./routes/chat.js"
import { connectdb } from "./lib/db.js";
import cookieParser from "cookie-parser"

const app = express()
const PORT = process.env.PORT

app.use(cors({
    origin: process.env.FRONTEND_URL 
        ? process.env.FRONTEND_URL.split(",") 
        : ["http://localhost:5173","http://localhost:5174"],
    credentials:true,
}))
app.use(express.json())
app.use(cookieParser())
app.use("/api/auth/",Authroutes)
app.use("/api/users/",Userroutes)
app.use("/api/chats/",Chatroutes)



app.listen(PORT || 5001,()=>{
    console.log(`server running at ${PORT || 5001}`)
    connectdb();
})