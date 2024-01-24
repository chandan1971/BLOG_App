const becryptjs=require("bcryptjs")

const sigup= async  (req,res,next)=>{
    const {username,email,password}=req.body;
    if(!username || !email || !password || username===' ' || email===' ' || password===' '){
        return res.status(400).json({
            message:"All feilds are required"
        })
    }
    else{
        next(errorHandler(400,"All feilds are required"));
    }
    const newUser=new User({
        username,
        email,
        password:hashedPassword,
    });

    const hashedPassword= becryptjs.hashSync(password,10);
    try {
        await newUser.save();
    } catch (error) {
        next(error)
    }
    
    
}


module.exports=sigup