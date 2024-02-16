const test=(req,res)=>{
    res.json({
        message:'Api is working !!!'
    })
}

const updateUser=async(req,res,next)=>{
    console.log(req.user);
}

module.exports=test