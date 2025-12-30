import mongoose from "mongoose"
import bcrypt from "bcryptjs"

const userschema = new mongoose.Schema({
    fullname : {
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
        minlength:6
    },
    bio:{
        type:String,
        default:""
    },
    profilepic:{
        type:String,
        default:""
    },
    nativelanguange:{
        type:String,
        default:""
    },
    learninglanguage:{
        type:String,
        default:""
    },
    isonboarded:{
        type:Boolean,
        default:false
    },
    location:{
        type:String,
        default:""
    },
    friends:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }]
},{timestamps:true})

userschema.pre("save", async function (next) {
    if (!this.isModified("password") ) return next()
    try{
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password,salt)
        next();
    }
    catch(err){
        console.log(err)
        next(err)
    }
}   
)


userschema.methods.matchpassword = async function (password) {
      const value = await bcrypt.compare(password,this.password)
      return value
}

const User = mongoose.model("User",userschema)



export default User