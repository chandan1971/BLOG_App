const mongoose=require("mongoose")



const userSchema=new mongoose.Schema({
    username:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
    },
    profilePicture:{
        type:String,
        default:"https://images.pexels.com/photos/2690774/pexels-photo-2690774.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
    },
    isAdmin:{
        type:Boolean,
        default:true,
    },
    
},{timestamps:true})

const User=mongoose.model('User',userSchema)

module.exports=User