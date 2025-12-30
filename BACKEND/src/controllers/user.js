import FriendRequest from "../models/FriendRequest.js";
import User from "../models/User.js"
export const getrecommendedusers = async (req,res)=>{
     try{
        const currentuserid = req.user.id;
        const currentuser = req.user;
         currentuser.friends = currentuser.friends || []
        const recommendedusers = await User.find({$and:[{_id:{$ne:currentuserid}},{_id:{$nin:currentuser.friends}},{isonboarded:true}]})
        console.log(recommendedusers)
        res.status(200).json(recommendedusers)
     }catch(err){ 
        console.log(err)
     }
}


export const getmyfriends = async (req,res)=>{
       try{
        const userreq = req.user;
        const user = await User.findById(userreq._id).select("friends").populate("friends","fullname profilepic bio location learninglanguage nativelanguange")
        res.status(200).json(user.friends)
        console.log(user)
       }catch(err){
         console.log(err)
       }
}


export const sendFriendRequest = async (req,res)=>{
   try{
         const myid = req.user._id;
         const friendid =  req.params.id;
         if (myid.toString() === friendid.toString()){
            return res.status(400).json({message:"You cannot send friend request to yourself"})
         }

         const friend = await User.findById(friendid);
         if (!friend){
            return res.status(404).json({message:"User not found"})
         }

         if (friend.friends.includes(myid)){
            return res.status(400).json({message:"You are already friends"})
         }
         const existingRequest = await FriendRequest.findOne({$or:[{sender:myid,recipient:friendid},{sender:friendid,recipient:myid}]})

         if(existingRequest){
            return res.status(400).json({message:"Friend request already exists"})
         }
         const friendRequest = await FriendRequest.create({sender:myid,recipient:friendid}) 
         res.status(200).json({message:"Friend request sent successfully",friendRequest})

   }catch(err){
      console.log(err)
   }

}

export const acceptFriendRequest = async (req,res)=>{
   try{
        const id = req.params.id;
        const friendrequest = await FriendRequest.findById(id);
        if (!friendrequest){
            return res.status(404).json({message:"Friend request not found"})
        }
        if (friendrequest.recipient.toString() !== req.user._id.toString()){
            return res.status(403).json({message:"You are not authorized to accept this friend request"})
        }
        friendrequest.status = "accepted";
         await friendrequest.save();

         await User.findByIdAndUpdate(friendrequest.recipient,{
            $addToSet:{friends:friendrequest.sender}
         })
         await User.findByIdAndUpdate(friendrequest.sender,{
            $addToSet:{friends:friendrequest.recipient}
         })
         res.status(200).json({message:"Friend request accepted successfully"})
   }catch(err){
      console.log(err)
      
   }
}

export  async function getFriendrequests(req,res){

  try{
   const incomingRequests = await FriendRequest.find({recipient:req.user._id,status:"pending"}).populate("sender" , "fullname profilepic bio location learninglanguage nativelanguange")
    const acceptedRequests = await FriendRequest.find({sender:req.user._id,status:"accepted"}).populate("recipient" ,"fullname profilepic")

    res.status(200).json({incomingRequests,acceptedRequests})
  }catch(err){
    console.log(err)
  }
}

export  async function getoutgoingfriendrequests(req,res){
   try{
          const ougoingRequests = await FriendRequest.find({sender:req.user._id,status:"pending"}).populate("recipient" , "fullname profilepic learninglanguage nativelanguange")
            res.status(200).json(ougoingRequests)
   }catch(err){
      console.log(err)
   }
}

export async function rejectfriendrequest(req,res){
   try{
        const id = req.params.id;   
         const friendrequest = await FriendRequest.findById(id);
         if (!friendrequest){
            return res.status(404).json({message:"Friend request not found"})
         }  
         if (friendrequest.recipient.toString() !== req.user._id.toString()){
            return res.status(403).json({message:"You are not authorized to reject this friend request"})
         }
         friendrequest.status = "rejected";
         await friendrequest.save();
         res.status(200).json({message:"Friend request rejected successfully"})
   }catch(err){
      console.log(err)
   }
}
