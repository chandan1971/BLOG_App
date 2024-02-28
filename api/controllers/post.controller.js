const errorHandler = require("../utils/error.js")
const Post=require("../models/post.model.js")


const create= async(req,res,next)=>{
    console.log(req.user);
    if(!req.user.Admin){
        return next(errorHandler(403,"You are not allowed to post"))
    }
    if(!req.body.title || !req.body.content){
        return next (errorHandler(400,"Please provide all required fields"))
    }
    const slug=req.body.title.split(' ').join('-').toLowerCase().replace(/[^a-zA-Z0-9-]/g,'-');
    const newPost=new Post({
        ...req.body,
        slug,
        userId:req.user.id
    })

    try {
        const savedPost= await newPost.save();
        res.status(201).send({
            savedPost
        })
    } catch (error) {
        next(error)
    }
}

module.exports={create}