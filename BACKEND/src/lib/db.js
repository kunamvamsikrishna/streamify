import mongoose from "mongoose"


export const connectdb = async () =>{
    try{
        const  con = await mongoose.connect(process.env.MONGO_URI)
        console.log(`mongodb connected ${con.connection.host}`)
    }catch(error){
        console.log("error while connection mongo db",  error)
        process.exit(1)
    }
}