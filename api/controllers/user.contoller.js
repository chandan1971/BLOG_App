const errorHandler = require("../utils/error.js")
const bcryptjs=require('bcryptjs')
const User=require('../models/user.model.js')

const test=(req,res)=>{
    res.json({
        message:'Api is working !!!'
    })
}

const updateUser=async(req,res,next)=>{
    if(req.user.id!==req.params.userId){
        return next(errorHandler(400,'You are not allowed to update this user'))
    }
    if(req.body.password){
        if(req.body.password.length <8){
            return next(errorHandler(400,"Password must be at least 8 charachters"))
        }
        req.body.password=bcryptjs.hashSync(req.body.password,10);
    }
    if(req.body.username){
        if(req.body.username.length<7 || req.body.username>20){
            return next(errorHandler(400,"Username must be between 7 to 20 charachters"))
        }
        if(req.body.username.includes(' ')){
            return next(errorHandler(400,"Username Cannot contain spaces"));
        }
        if(req.body.username!== req.body.username.toLowerCase()){
            return next(errorHandler(400,"Username must be in lowercase"));
        }
        if(!req.body.username.match(/^[a-zA-Z0-9]+$/)){
            return next(errorHandler(400,"Username can only contain letters and numbers"));
        }
    }
    try {
        const updatedUser=await User.findByIdAndUpdate(req.params.userId,{
            $set:{
                username:req.body.username,
                email:req.body.email,
                profilePicture:req.body.profilePicture,
                password:req.body.password,
            },
        },
        {new:true}
        );
        // console.log(updatedUser._doc);
        const {password, ...rest}=updatedUser._doc;
        res.status(200).send(rest);
    } catch (error) {
        next(error);
    }
}

module.exports={test,updateUser}