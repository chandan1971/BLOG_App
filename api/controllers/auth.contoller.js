const bcryptjs=require("bcryptjs")
const errorHandler=require("../utils/error.js")
const User=require("../models/user.model.js")

const sigup= async  (req,res,next)=>{
    const {username,email,password}=req.body;
    if(!username || !email || !password || username===' ' || email===' ' || password===' '){
        return res.status(400).json({
            message:"All feilds are required"
        })
    }
    else{
        next();
    }
    const hashedPassword= bcryptjs.hashSync(password,10);
    const newUser=new User({
        username,
        email,
        password:hashedPassword,
    });

    try {
        console.log(newUser);
        await newUser.save();
    } catch (error) {
        next(error)
    }
    
    
}


module.exports=sigup