import jwt from "jsonwebtoken"
import User from "../models/User.js"

export const protectedroute = async (req,res,next)=>{
      try{
        const token = req.cookies.jwt
        
        console.log("🔐 Auth Check - Token present:", !!token)
        console.log("🔐 Cookies received:", Object.keys(req.cookies))
        
        if(!token){
            return res.status(401).json({msg:"Unauthorized - No token provided"})
        }
         const decoded = jwt.verify(token,process.env.SECRET_KEY)
         if(!decoded){
           return res.status(401).json({msg:"unauthoized - Invalid token"})
         }

         const user = await User.findById(decoded.Userid).select("-password")
         if (!user){
            return res.status(401).json({msg:"unauthoized - user not found"})
         }

         req.user = user;
         next();
      }catch(err){
        console.log("❌ Auth error:", err.message)
        return res.status(401).json({msg:"Unauthorized - " + err.message})
      }
}