import jwt from "jsonwebtoken"
import User from "../models/User.js"
import bcrypt from "bcryptjs";
import { generatestreamtoken, upsertstreamuser } from "../lib/stream.js";


export async function signup(req,res){
    const {email,fullname,password} = req.body;
    try{
         if(!email || !fullname || ! password){
            return  res.status(400).json({msg:"All fields are required"})
         }
         if(password.length <6 ){
             return  res.status(400).json({msg:"password must be required "})
         }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
        return res.status(400).json({ message: "Invalid email format" });
        }
        const user = await User.findOne({email})
        if (user){
            return res.status(400).json({message:"Email already exists, please use a different one "})
        }
        const idx = Math.floor(Math.random() * 100 ) + 1  
        const randomavatar = `https://avatar.iran.liara.run/public/${idx}.png`

        const newuser = await User.create({email,fullname,password,profilepic:randomavatar})
         try{
            await upsertstreamuser({id:newuser._id.toString(),
              name:newuser.fullname,
              image:newuser.profilepic || ""
         })
         console.log("streamuser created")
         }catch(err){
            console.log(err)
         }
        const token =  jwt.sign({Userid:newuser._id},process.env.SECRET_KEY,{expiresIn:"30d"})

        res.cookie("jwt",token,{
            maxAge: 7 * 24 * 60 * 60 *1000,
            httpOnly:true,
            secure:process.env.NODE_ENV ==="production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax"
        })
        const userWithoutPassword = newuser.toObject();
            delete userWithoutPassword.password;

       res.status(200).json({success:true,user:userWithoutPassword})
    }catch(error){
        console.log(error)
       return res.status(500).send("error in the signup")
    }
}

export async function login(req,res){
    try{ const {email,password} = req.body;
    if (!email || ! password) {
       return res.status(400).send("All fields are required")
    }
    const user = await User.findOne({email})
     if (!user){
         return res.status(401).send("user not found")
     }

     const ispasswordcorrect = await user.matchpassword(password)

     if (!ispasswordcorrect){
          return res.status(400).send("incorrect password")
     }

     const token =  jwt.sign({Userid:user._id},process.env.SECRET_KEY,{expiresIn:"30d"})

        res.cookie("jwt",token,{
            maxAge: 7 * 24 * 60 * 60 *1000,
            httpOnly:true,
            secure:process.env.NODE_ENV ==="production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax"
        })
       

   return res.status(200).json({success:true,user,token
    })
}catch(err){
    console.log(err)
     return res.status(400).send(err)
}
   
}

export function logout(req,res){
    res.clearCookie("jwt")
    return res.status(200).json({success:true,msg:"logout successful"})
}


export async function onboarding(req,res){
        try{
            const userid = req.user._id
            const {fullname,bio,nativelanguage,learninglanguage,location} = req.body;
            if (!fullname || !bio || !nativelanguage || !learninglanguage ||!location){
                     if(!fullname){
                return res.status(400).json({msg:"fullname is required"})
                     }
                     if(!bio){
                return res.status(400).json({msg:"bio is required"})
                     }
                        if(!nativelanguange){   
                return res.status(400).json({msg:"nativelanguange is required"})
                        }
                        if(!learninglanguage){
                return res.status(400).json({msg:"learninglanguage is required"})
                        }
                        if(!location){
                    return res.status(400).json({msg:"location is required"})
                        }

                    return res.status(400).json({msg:"enter all the details"})
            }

            console.log("req.body",req.body)
           const updateduser =  await User.findByIdAndUpdate(userid,{
            ...req.body,
            isonboarded : true
           },{new:true}).select("-password")

           if (!updateduser){
               return res.status(404).json({msg:"user not found"})
           }

                try{
                    await upsertstreamuser({id:updateduser._id.toString(),
                    fullname:updateduser.fullname,
                    image:updateduser.profilepic
                })
                }catch(err){
                    console.log(err)
                }

             return res.status(200).json({success:true,user:updateduser})

        }catch(err){
            console.log(err)
        }

}


