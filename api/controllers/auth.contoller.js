const bcryptjs=require("bcryptjs")
const errorHandler=require("../utils/error.js")
const User=require("../models/user.model.js")
const jwt=require('jsonwebtoken')

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
        res.status(200).send({message : "Signup Succesful", success : true})
    } catch (error) {
        next(error)
    }
    
}

const signin=async(req,res,next)=>{
    const {email,password}=req.body
    if(!email || !password || email===' ' ||password==='' ){
        next(errorHandler(400,`All Feilds are required`))
    }

    try {
        const validUser=await User.findOne({email});
        if(!validUser){
            return next(errorHandler(404,`User Not Found`))
        }
        const validPassword=bcryptjs.compareSync(password,validUser.password);
        if(!validPassword){
            return next(errorHandler(400,`Invalid Password`));
        }
        const token=jwt.sign(
            {
                id:validUser._id,
                Admin:validUser.isAdmin
            },
            process.env.JWT_SECRET,
        )
        const {password: pass,...rest}=validUser._doc;

        res.status(200).cookie('access_token',token,{
            httpOnly:true
        }).send(rest)

    } catch (error) {
        next(error)
    }

}

const google=async(req,res,next)=>{
    const {email,name,googlePhotoUrl}=req.body;
    try {
        const user=await User.findOne({email});
        if(user){
            const token=jwt.sign({
                id:user._id,
                Admin:user.isAdmin
            },
            process.env.JWT_SECRET);
            const {password,...rest}=user._doc;
            res.status(200).cookie('access_token',token,{
                httpOnly:true,
            }).send(rest);
        }
        else{
            const generatedPassword=Math.random().toString(36).slice(-8);
            const hashedPassword=bcryptjs.hashSync(generatedPassword,10);
            const newUser=new User({
                username:name.toLowerCase().split(' ')+Math.random().toString(9).slice(-4),
                email,
                password:hashedPassword,
                profilePicture:googlePhotoUrl,
            });
            await newUser.save();
            const token=jwt.sign({
                id:user._id
            },
            process.env.JWT_SECRET);
            const {password,...rest}=user._doc;
            res.status(200).cookie('access_token',token,{
                httpOnly:true,
            }).send(rest);

        }
    } catch (error) {
        next(error)
    }
}


module.exports={signup,signin,google}