import { generatestreamtoken } from "../lib/stream.js"


export async function getstreamtoken(req,res){
    try{
             
        const token = generatestreamtoken(req.user.id)
        console.log(req.user)
        res.status(200).json({token})
    }catch(err){
        console.error("Stream token error:", err);
    return res.status(500).json({ message: "Failed to generate stream token" });
    }
}