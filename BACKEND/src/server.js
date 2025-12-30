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

console.log("=== Server Initialization ===")
console.log(`Node version: ${process.version}`)
console.log(`Working directory: ${process.cwd()}`)
console.log(`File location: ${__filename}`)

const app = express()
const PORT = process.env.PORT || 5001

console.log(`Port: ${PORT}`)
console.log(`Environment: ${process.env.NODE_ENV || 'development'}`)

// Health check endpoint
app.get("/health", (req, res) => {
    res.status(200).json({ 
        status: "ok", 
        message: "Server is running",
        timestamp: new Date().toISOString()
    })
})

// CORS configuration with detailed logging
const allowedOrigins = process.env.FRONTEND_URL 
    ? process.env.FRONTEND_URL.split(",").map(url => url.trim())
    : ["http://localhost:5173", "http://localhost:5174"];

console.log("🌐 CORS Configuration:")
console.log("Allowed Origins:", allowedOrigins)
console.log("Frontend URL env var:", process.env.FRONTEND_URL || "NOT SET")

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        
        if (allowedOrigins.indexOf(origin) !== -1 || allowedOrigins.includes('*')) {
            callback(null, true);
        } else {
            console.warn(`❌ CORS blocked request from origin: ${origin}`)
            console.warn(`   Allowed origins are: ${allowedOrigins.join(', ')}`)
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
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
    console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason)
    // Don't exit the process, just log it
})

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
    console.error('❌ Uncaught Exception:', error)
    console.error('❌ Stack:', error.stack)
    // Exit gracefully
    process.exit(1)
})

// Check required environment variables BEFORE starting server
const requiredEnvVars = ['MONGO_URI', 'SECRET_KEY', 'STREAM_API_KEY', 'STREAM_SECRET_KEY']
const missingVars = requiredEnvVars.filter(varName => !process.env[varName])

if (missingVars.length > 0) {
    console.error(`❌ Missing required environment variables: ${missingVars.join(', ')}`)
    console.error("Please set these variables in your Render dashboard")
    // Continue anyway - let the server start so we can see what happens
} else {
    console.log("✅ All required environment variables are set")
}

// Start the server
let server
try {
    console.log("🚀 Starting server...")
    server = app.listen(PORT, () => {
        console.log(`✅ Server is listening on port ${PORT}`)
        console.log(`✅ Health check available at: http://localhost:${PORT}/health`)
        
        // Connect to database (non-blocking)
        connectdb()
            .then(() => {
                console.log("✅ Database connection successful")
                console.log("✅ Server is fully ready!")
            })
            .catch((error) => {
                console.error("❌ Failed to connect to database:", error.message)
                console.error("⚠️  Server is running but database connection failed")
                console.error("⚠️  Some features may not work until database is connected")
            })
    })
    
    // Handle server errors
    server.on('error', (error) => {
        console.error("❌ Server error occurred:", error.message)
        if (error.code === 'EADDRINUSE') {
            console.error(`❌ Port ${PORT} is already in use`)
        } else {
            console.error('❌ Server error details:', error)
        }
        process.exit(1)
    })
    
    // Keep the process alive
    server.on('listening', () => {
        console.log("✅ Server event: listening")
    })
    
    server.on('close', () => {
        console.log("⚠️  Server event: closed")
    })
    
} catch (error) {
    console.error("❌ Failed to start server:", error)
    console.error("❌ Error details:", error.message)
    console.error("❌ Stack:", error.stack)
    process.exit(1)
}

// Keep process alive
process.on('SIGTERM', () => {
    console.log('SIGTERM received, shutting down gracefully')
    if (server) {
        server.close(() => {
            console.log('Process terminated')
            process.exit(0)
        })
    }
})

process.on('SIGINT', () => {
    console.log('SIGINT received, shutting down gracefully')
    if (server) {
        server.close(() => {
            console.log('Process terminated')
            process.exit(0)
        })
    }
})

console.log("=== Server initialization script completed ===")
