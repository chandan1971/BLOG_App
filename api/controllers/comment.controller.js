const Comment = require("../models/comment.model.js");
const errorHandler = require("../utils/error.js")


const createComment=async(req,res,next)=>{
    const {content,postId,userId}=req.body;
    if(userId!==req.user.id){
        next(errorHandler(403,"You are not authorized to comment"))
    }
    try {
        const newComment=new Comment({
            content,
            postId,
            userId,
        })
        await newComment.save();
        res.status(200).send(newComment);

    } catch (error) {
        next(error);
    }
}

const getPostComment=async (req,res,next)=>{
    try {
        const comments=await Comment.find({postId:req.params.postId}).sort({
            createdAt:-1
        })
        res.status(200).send(comments)

    } catch (error) {
        next(error);
    }
}

module.exports={createComment,getPostComment}