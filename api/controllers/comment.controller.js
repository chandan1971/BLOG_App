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

const likeComment=async(req,res,next)=>{
    try {
        const comment =await Comment.findById(req.params.commentId)
        if(!comment){
            return next(errorHandler(404,"Comment not found"));

        }
        const userIndex=comment.likes.indexOf(req.user.id);
        if(userIndex===-1){
            comment.numberofLikes+=1;
            comment.likes.push(req.user.id);
        }
        else{
            comment.numberofLikes-=1;
            comment.likes.splice(userIndex,1);
        }
        await comment.save();
        res.status(200).send(comment);
    } catch (error) {
        next(error);
    }
}

const updateComment=async(req,res,next)=>{
    try {
        const comment=await Comment.findById(req.params.commentId);
        if(!comment){
            return next(errorHandler(404,"Comment not found"));
        }
        if(comment.userId!== req.user.id){
            return next(errorHandler(403,"You are not allowed to edit thid comment"));
        }
        const updatedComment=await Comment.findByIdAndUpdate(req.params.commentId,{
            content:req.body.content,
        },
        {new:true}
        );
        res.status(200).json(updatedComment)
    } catch (error) {
        next(error);
    }
}

const deleteComment=async(req,res,next)=>{
    try {
        const comment=await Comment.findById(req.params.commentId);
        if(!comment){
            return next(errorHandler(404,"Comment not found"));
        }
        if(req.user.id!== comment.userId && user.Admin){
            return next(errorHandler(403,"You are not authorized to delete this comment"));
        }
        const deletedComment=await Comment.findByIdAndDelete(req.params.commentId);
        console.log(deletedComment);
        res.status(200).send({
            "message":"Comment Deleted Successfully",
        })
        
    } catch (error) {
        next(error);
    }
}

module.exports={createComment,getPostComment,likeComment,updateComment,deleteComment}