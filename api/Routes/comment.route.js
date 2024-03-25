const express=require('express');
const { createComment } = require('../controllers/comment.controller');
const verifyToken=require('../utils/verifyUser')


const router=express.Router()

router.post('/create',verifyToken,createComment);

module.exports=router
