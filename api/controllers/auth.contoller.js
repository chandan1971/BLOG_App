const bcryptjs=require("bcryptjs")
const errorHandler=require("../utils/error.js")
const User=require("../models/user.model.js")

const signup= async  (req,res,next)=>{
    const {username,email,password}=req.body;
    if(!username || !email || !password || username===' ' || email===' ' || password===' '){
        next(errorHandler(400, 'All fields are required'));
    }
    const hashedPassword= bcryptjs.hashSync(password,10);
    const newUser=new User({
        username,
        email,
        password:hashedPassword,
    });

    try {
        await newUser.save();
        res.send(200).json({message : "Signup Succesful", success : true})
    } catch (error) {
        next(error)
    }
    
    
}


module.exports=signup