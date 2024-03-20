const errorHandler = require("../utils/error.js")
const Post=require("../models/post.model.js")


const create= async(req,res,next)=>{
    if(!req.user.Admin){
        return next(errorHandler(403,"You are not allowed to post"))
    }
    if(!req.body.title || !req.body.content){
        return next (errorHandler(400,"Please provide all required fields"))
    }
    const slug=req.body.title.split(' ').join('-').toLowerCase().replace(/[^a-zA-Z0-9-]/g,'');
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

const getposts=async (req,res,next)=>{
    try {
        const startIndex=parseInt(req.query.startIndex) || 0;
        const limit=parseInt(req.query.limit) || 9;
        const sortDirection=req.query.order=== 'asc' ? 1:-1;
        const posts=await Post.find({
            ...(req.query.userId && {userId:req.query.userId}),
            ...(req.query.category && {category: req.query.category}),
            ...(req.query.slug && {slug:req.query.slug}),
            ...(req.query.postId && {_id:req.query.postId}),
            ...(req.query.searchTerm && {
                $or:[
                    {title:{$regex: req.query.searchTerm, $options:'i'}},
                    {content:{$regex: req.query.searchTerm, $options:'i'}},
                ],

            }),

        }).sort({updatedAt:sortDirection}).skip(startIndex).limit(limit);

        const totalPosts= await Post.countDocuments(
            {userId:req.query.userId,}
        );

        const now =new Date();

        const oneMonthAgo=new Date(
            now.getFullYear(),
            now.getMonth()-1,
            now.getDate()
        );

        const lastMonthPosts=await Post.countDocuments({
            createdAt:{$gte: oneMonthAgo},
            userId:req.query.userId,
        });

        res.status(200).send({
            posts,
            totalPosts,
            lastMonthPosts,
        })

    } 
    catch (error) {
        next(error)
    }
}

const deletepost=async(req,res,next)=>{
    if(!req.user.Admin || req.user.id!==req.params.userId){
        return errorHandler(403,"You are not allowed to delete this post");
    }
    try {
        await Post.findByIdAndDelete(req.params.postId);
        res.status(200).send({"message":"The Post has been Deleted"});

    } catch (error) {
        next(error) 
    }
}

module.exports={create,getposts,deletepost}