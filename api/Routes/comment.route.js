const express=require('express');
const { createComment, getPostComment, likeComment, updateComment, deleteComment } = require('../controllers/comment.controller');
const verifyToken=require('../utils/verifyUser')


const router=express.Router()

router.post('/create',verifyToken,createComment);
router.get('/getPostComment/:postId',getPostComment);
router.put('/likeComment/:commentId',verifyToken,likeComment)
router.put('/editComment/:commentId',verifyToken,updateComment);
router.delete('/deleteComment/:commentId',verifyToken,deleteComment)


module.exports=router
