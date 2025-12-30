import path from "path"
import { fileURLToPath } from "url"
import dotenv from "dotenv"
import cors from "cors"

// Configure dotenv FIRST before any other imports
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Only load .env file if it exists (for local development)
// On Render, environment variables are set directly
const envPath = path.join(__dirname, "../.env")
const result = dotenv.config({ path: envPath });

if (result.error && process.env.NODE_ENV !== 'production') {
    console.log("No .env file found, using environment variables directly")
} else if (!result.error) {
    console.log("Environment variables loaded from .env file")
}

// Now import modules that depend on environment variables
import express from "express"
import  Authroutes from "./routes/auth.js";
import Userroutes from "./routes/user.js"
import Chatroutes from "./routes/chat.js"
import { connectdb } from "./lib/db.js";
import cookieParser from "cookie-parser"

const app = express()
const PORT = process.env.PORT || 5001

// Health check endpoint
app.get("/health", (req, res) => {
    res.status(200).json({ 
        status: "ok", 
        message: "Server is running",
        timestamp: new Date().toISOString()
    })
})

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

// Error handling middleware
app.use((err, req, res, next) => {
    console.error("Error:", err)
    res.status(500).json({ 
        message: "Internal server error",
        error: process.env.NODE_ENV === 'production' ? {} : err.message
    })
})

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason)
    // Don't exit the process, just log it
})

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error)
    // Exit gracefully
    process.exit(1)
})

// Start server
const server = app.listen(PORT, async () => {
    console.log(`Server starting on port ${PORT}`)
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`)
    
    // Check required environment variables
    const requiredEnvVars = ['MONGO_URI', 'SECRET_KEY', 'STREAM_API_KEY', 'STREAM_SECRET_KEY']
    const missingVars = requiredEnvVars.filter(varName => !process.env[varName])
    
    if (missingVars.length > 0) {
        console.error(`Missing required environment variables: ${missingVars.join(', ')}`)
        console.error("Please set these variables in your Render dashboard")
        // Don't exit, let it try to connect and fail gracefully
    }
    
    // Connect to database
    try {
        await connectdb()
        console.log("Server is ready!")
    } catch (error) {
        console.error("Failed to connect to database:", error.message)
        console.error("Server is running but database connection failed")
        // Don't exit - let the server run so we can see the error
    }
})

// Handle server errors
server.on('error', (error) => {
    if (error.code === 'EADDRINUSE') {
        console.error(`Port ${PORT} is already in use`)
    } else {
        console.error('Server error:', error)
    }
    process.exit(1)
})