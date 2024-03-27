const express=require('express');
const { createComment, getPostComment, likeComment } = require('../controllers/comment.controller');
const verifyToken=require('../utils/verifyUser')


const router=express.Router()

router.post('/create',verifyToken,createComment);
router.get('/getPostComment/:postId',getPostComment);
router.put('/likeComment/:commentId',verifyToken,likeComment)

module.exports=router
