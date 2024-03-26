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


const deleteUser=async(req,res,next)=>{
    if(!req.user.Admin && req.user.id!==req.params.userId){
        return next(errorHandler(400,'You are not allowed to update this user'))
    }
    try {
        await User.findByIdAndDelete(req.params.userId);
        res.status(200).send({message:"User Deleted",
    success:true});
    } catch (error) {
        next(error)
    }
}

const signout=(req,res,next)=>{
    try {
        res.clearCookie('access_token').status(200).json('User has been signed out');
    } catch (error) {
        next(error)
    }
}

const getusers= async (req,res,next)=>{
    if(!req.user.Admin){
        return next(errorHandler(403,"You are not allowe to see all Users"))
    }
    try {
        const startIndex=parseInt(req.query.startIndex) || 0;
        const limit=parseInt(req.query.limit) || 9;
        const sortDirection=req.query.sort==='asc' ? 1: -1 ;

        const Users= await User.find()
        .sort({createdAt:sortDirection})
        .skip(startIndex)
        .limit(limit);
        const UserWithoutPassword=Users.map((user)=>{
            const {password,...rest}=user._doc;
            return rest;
        })
        const totalUsers=await User.countDocuments();
        const now =new Date();
        const oneMonthAgo=new Date(
            now.getFullYear(),
            now.getMonth()-1,
            now.getDate(),
        )
        const lastMonthUsers=await User.countDocuments({createdAt:{$gte:oneMonthAgo}});

        res.status(200).send({
            users:UserWithoutPassword,
            totalUsers,
            lastMonthUsers,
        });
    } catch (error) {
        next(error)
    }
}

const getUser=async(req,res,next)=>{
    try {
        const user=await User.findById(req.params.userId);
        if(!user){
            next(errorHandler(404,"User not found"));
        }
        const {password,...rest}=user._doc;
        res.status(200).send(rest);
    } catch (error) {
        next(error);
    }
}
module.exports={test,updateUser,deleteUser,signout,getusers,getUser}