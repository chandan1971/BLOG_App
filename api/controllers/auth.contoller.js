const becryptjs=require("bcryptjs")

const sigup= async  (req,res)=>{
    const {username,email,password}=req.body;
    if(!username || !email || !password || username===' ' || email===' ' || password===' '){
        return res.status(400).json({
            message:"All feilds are required"
        })
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
        res.json({
            message:"records saved !!!",
        })
    }
    
    
}


module.exports=sigup