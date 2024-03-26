const express=require('express');
const { createComment, getPostComment } = require('../controllers/comment.controller');
const verifyToken=require('../utils/verifyUser')


const router=express.Router()

router.post('/create',verifyToken,createComment);
router.get('/getPostComment/:postId',getPostComment);

module.exports=router
