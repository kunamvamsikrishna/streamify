import mongoose from "mongoose"


export const connectdb = async () =>{
    try{
        if (!process.env.MONGO_URI) {
            throw new Error("MONGO_URI environment variable is not set")
        }
        
        const con = await mongoose.connect(process.env.MONGO_URI)
        console.log(`MongoDB connected: ${con.connection.host}`)
        return con
    }catch(error){
        console.error("Error connecting to MongoDB:", error.message)
        // Don't exit - throw error so caller can handle it
        throw error
    }
}