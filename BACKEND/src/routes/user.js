import express from "express"
import { protectedroute } from "../middleware/auth.js"
import { rejectfriendrequest,getrecommendedusers,getmyfriends,sendFriendRequest,acceptFriendRequest,getFriendrequests,getoutgoingfriendrequests } from "../controllers/user.js"

const router = express.Router()
router.use(protectedroute)

router.get("/",getrecommendedusers)
router.get("/friends",getmyfriends)
router.post("/friend-request/:id",sendFriendRequest)
router.put("/friend-request/:id/accept",acceptFriendRequest)
router.get("/friend-requests",getFriendrequests)
router.get("/outgoing-friend-requests",getoutgoingfriendrequests)
router.put("/friend-request/:id/reject",rejectfriendrequest)
export default router;