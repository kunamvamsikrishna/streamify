import express from "express"
import { signup,login,logout,onboarding} from "../controllers/auth.js"
import {protectedroute} from "../middleware/auth.js"
const router = express.Router()

router.post("/login",login)
router.post("/signup",signup)
router.post("/logout",logout)
router.post("/onboarding",protectedroute,onboarding)
router.get("/me",protectedroute,(req,res)=>{
    const user = req.user;
    res.status(200).json(user)
})

export default router